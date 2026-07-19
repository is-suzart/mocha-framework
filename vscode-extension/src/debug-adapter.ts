import {
  DebugSession,
  InitializedEvent,
  StoppedEvent,
  ThreadEvent,
  TerminatedEvent,
  Thread,
  Scope,
  Source,
  StackFrame,
} from "@vscode/debugadapter";
import { DebugProtocol } from "@vscode/debugprotocol";
import { spawn, ChildProcess } from "child_process";
import * as http from "http";
import * as path from "path";

function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

interface LaunchRequestArguments extends DebugProtocol.LaunchRequestArguments {
  program: string;
  cwd?: string;
  port?: number;
  args?: string[];
}

const THREAD_V8 = 1;
const THREAD_QT = 2;

export class MochaDebugSession extends DebugSession {
  private _process: ChildProcess | null = null;
  private _port = 9229;
  private _variables = new Map<number, DebugProtocol.Variable[]>();
  private _nextVarRef = 1000;
  private _breakpoints = new Map<string, DebugProtocol.Breakpoint[]>();

  constructor() {
    super();
    this.setDebuggerLinesStartAt1(true);
    this.setDebuggerColumnsStartAt1(true);
  }

  protected initializeRequest(
    response: DebugProtocol.InitializeResponse,
    _args: DebugProtocol.InitializeRequestArguments
  ): void {
    response.body = response.body || {};
    response.body.supportsConfigurationDoneRequest = true;
    response.body.supportsEvaluateForHovers = true;
    response.body.supportsStepBack = false;
    response.body.supportsSetVariable = true;
    response.body.supportsRestartFrame = false;
    response.body.supportsTerminateRequest = true;
    this.sendResponse(response);
    this.sendEvent(new InitializedEvent());
  }

  protected async launchRequest(
    response: DebugProtocol.LaunchResponse,
    args: LaunchRequestArguments
  ): Promise<void> {
    this._port = args.port || (50000 + Math.floor(Math.random() * 10000));
    const cwd = args.cwd || process.cwd();
    const program = args.program;

    if (!program) {
      this.sendErrorResponse(response, 1001, "No program specified");
      return;
    }

    const programArgs = args.args || [];

    const inheritedEnv: Record<string, string> = {};
    for (const key of [
      "PATH", "HOME", "USER", "SHELL", "LANG", "LC_ALL",
      "DISPLAY", "WAYLAND_DISPLAY", "XDG_RUNTIME_DIR", "XDG_SESSION_TYPE",
      "QT_QPA_PLATFORM", "QT_QPA_PLATFORMTHEME",
      "LD_LIBRARY_PATH", "LD_PRELOAD",
      "DBUS_SESSION_BUS_ADDRESS", "XDG_DATA_DIRS",
      "npm_config_cache", "npm_config_prefix",
    ]) {
      if (process.env[key] !== undefined) {
        inheritedEnv[key] = process.env[key] as string;
      }
    }
    const spawnEnv = {
      ...inheritedEnv,
      MOCHA_DEVTOOLS: "1",
      MOCHA_DEVTOOLS_PORT: String(this._port),
    };

    this._process = spawn("npx", ["tsx", program, ...programArgs], {
      cwd,
      env: spawnEnv,
      shell: true,   // use the user's shell so PATH (nvm/volta/etc.) resolves correctly
      stdio: ["ignore", "pipe", "pipe"],
    });

    let processExited = false;
    let exitCode: number | null = null;

    this._process.stdout?.on("data", (data: Buffer) => {
      this.sendEvent({
        event: "output",
        body: { category: "stdout", output: data.toString() },
      } as any);
    });

    this._process.stderr?.on("data", (data: Buffer) => {
      this.sendEvent({
        event: "output",
        body: { category: "stderr", output: data.toString() },
      } as any);
    });

    this._process.on("exit", (code) => {
      processExited = true;
      exitCode = code;
      if (exitCode !== 0) {
        this.sendEvent(new TerminatedEvent());
      } else {
        this.sendEvent(new TerminatedEvent());
      }
    });

    this._process.on("error", (err) => {
      processExited = true;
      this.sendEvent({
        event: "output",
        body: { category: "stderr", output: `Failed to start process: ${err.message}\nMake sure 'npx' and 'tsx' are available in your PATH.\n` },
      } as any);
      this.sendErrorResponse(response, 1002, `Failed to start: ${err.message}`);
    });

    // Wait up to 15s for the debug server to come up, but abort if process exits
    const serverUp = await this._waitForServer(30, 500, () => processExited);

    if (processExited) {
      this.sendErrorResponse(response, 1003, `Process exited before debug server started (code=${exitCode}). Check the Debug Console for details.`);
      return;
    }

    if (!serverUp) {
      // Server didn't come up but process is still alive — launch anyway (app might not use devtools)
      this.sendEvent({
        event: "output",
        body: { category: "console", output: "[Mocha] Debug server not detected — running without inspector.\n" },
      } as any);
    }

    this.sendEvent(new ThreadEvent("started", THREAD_V8));
    this.sendEvent(new ThreadEvent("started", THREAD_QT));

    this.sendResponse(response);

    if (serverUp) {
      this._startPausePolling();
    }
  }

  protected configurationDoneRequest(
    response: DebugProtocol.ConfigurationDoneResponse,
    _args: DebugProtocol.ConfigurationDoneArguments
  ): void {
    this.sendResponse(response);
  }

  protected async setBreakPointsRequest(
    response: DebugProtocol.SetBreakpointsResponse,
    args: DebugProtocol.SetBreakpointsArguments
  ): Promise<void> {
    const sourcePath = args.source.path || "";
    const clientBreakpoints = args.breakpoints || [];

    const verifiedBreakpoints: DebugProtocol.Breakpoint[] = clientBreakpoints.map((bp) => ({
      verified: true,
      line: bp.line,
      source: args.source,
    }));

    this._breakpoints.set(sourcePath, verifiedBreakpoints);

    // Sync breakpoints to DebugServer as method breakpoints
    // Strategy: scan up from breakpoint line to find the enclosing method name.
    const methodNames: string[] = [];
    if (args.source.path) {
      try {
        const fs = require("fs");
        const content = fs.readFileSync(args.source.path, "utf-8");
        const lines = content.split("\n");

        for (const bp of clientBreakpoints) {
          let foundMethod: string | null = null;
          // Scan upward from the breakpoint line to find its enclosing method
          for (let i = bp.line - 1; i >= 0 && !foundMethod; i--) {
            const lineText = lines[i];
            if (!lineText) continue;
            // Look for class method declaration: `async methodName(` or `methodName(`
            const methodDecl = lineText.match(/^\s*(?:async\s+|private\s+|public\s+|protected\s+|override\s+)*([a-z_$][\w$]*)\s*\(/);
            if (methodDecl && methodDecl[1] !== "if" && methodDecl[1] !== "for" && methodDecl[1] !== "while") {
              foundMethod = methodDecl[1];
            }
            // Look for arrow function assigned to class field
            const arrowDecl = lineText.match(/^\s*(?:private\s+|public\s+|protected\s+)?([a-z_$][\w$]*)\s*=\s*(?:async\s+)?(?:\(|\w+\s*=>)/);
            if (!foundMethod && arrowDecl) foundMethod = arrowDecl[1];
          }
          if (foundMethod) methodNames.push(foundMethod);
        }
      } catch {}
    }

    try {
      if (methodNames.length > 0) {
        await this._httpPost("/debugger/setBreakpoints", { methods: methodNames });
      } else {
        // No methods detected — clear remote breakpoints
        await this._httpPost("/debugger/setBreakpoints", { methods: [] });
      }
    } catch {}

    response.body = { breakpoints: verifiedBreakpoints };
    this.sendResponse(response);
  }

  protected threadsRequest(response: DebugProtocol.ThreadsResponse): void {
    response.body = {
      threads: [
        new Thread(THREAD_V8, "V8 / TypeScript"),
        new Thread(THREAD_QT, "Qt Main Thread"),
      ],
    };
    this.sendResponse(response);
  }

  protected async stackTraceRequest(
    response: DebugProtocol.StackTraceResponse,
    args: DebugProtocol.StackTraceArguments
  ): Promise<void> {
    const state = await this._fetchState();
    const frames: StackFrame[] = [];

    if (state?.componentTree) {
      const root = state.componentTree[0];
      if (root) {
        frames.push(
          new StackFrame(
            0,
            `${root.name || root.className}`,
            undefined,
            1,
            0
          )
        );
      }
    }

    if (state?.qmlTree && state.qmlTree.length > 0) {
      frames.push(
        new StackFrame(1, `QML: ${state.qmlTree[0].type}`, undefined, 1, 0)
      );
    }

    response.body = { stackFrames: frames, totalFrames: frames.length };
    this.sendResponse(response);
  }

  protected async scopesRequest(
    response: DebugProtocol.ScopesResponse,
    _args: DebugProtocol.ScopesArguments
  ): Promise<void> {
    const state = await this._fetchState();
    const scopes: Scope[] = [];

    if (state?.properties) {
      const varRef = this._nextVarRef++;
      const vars: DebugProtocol.Variable[] = [];
      for (const [objName, props] of Object.entries(state.properties)) {
        const propEntries = Object.entries(props as Record<string, any>);
        for (const [propName, propInfo] of propEntries) {
          vars.push({
            name: `${objName}.${propName}`,
            value: JSON.stringify(propInfo.value),
            variablesReference: 0,
            type: propInfo.type,
          });
        }
      }
      this._variables.set(varRef, vars);
      scopes.push(new Scope("QObject Properties", varRef, false));
    }

    if (state?.qmlTree && state.qmlTree.length > 0) {
      const varRef = this._nextVarRef++;
      const vars = this._qmlTreeToVariables(state.qmlTree);
      this._variables.set(varRef, vars);
      scopes.push(new Scope("QML Widgets", varRef, false));
    }

    response.body = { scopes };
    this.sendResponse(response);
  }

  protected variablesRequest(
    response: DebugProtocol.VariablesResponse,
    args: DebugProtocol.VariablesArguments
  ): void {
    const vars = this._variables.get(args.variablesReference) || [];
    response.body = { variables: vars };
    this.sendResponse(response);
  }

  protected async setVariableRequest(
    response: DebugProtocol.SetVariableResponse,
    args: DebugProtocol.SetVariableArguments
  ): Promise<void> {
    const match = args.name.match(/^(.+)\.(\w+)$/);
    if (match) {
      const state = await this._fetchState();
      if (state?.componentTree) {
        const root = state.componentTree[0];
        if (root) {
          let parsed: unknown;
          try { parsed = JSON.parse(args.value); } catch { parsed = args.value; }
          await this._setProperty(root.id, match[2], parsed);
          response.body = { value: args.value };
        }
      }
    }
    this.sendResponse(response);
  }

  protected continueRequest(
    response: DebugProtocol.ContinueResponse,
    _args: DebugProtocol.ContinueArguments
  ): void {
    this._debuggerAction("resume");
    response.body = { allThreadsContinued: true };
    this.sendResponse(response);
  }

  protected nextRequest(
    response: DebugProtocol.NextResponse,
    _args: DebugProtocol.NextArguments
  ): void {
    this._debuggerAction("step");
    this.sendResponse(response);
  }

  protected stepInRequest(
    response: DebugProtocol.StepInResponse,
    _args: DebugProtocol.StepInArguments
  ): void {
    this._debuggerAction("step");
    this.sendResponse(response);
  }

  protected stepOutRequest(
    response: DebugProtocol.StepOutResponse,
    _args: DebugProtocol.StepOutArguments
  ): void {
    this._debuggerAction("resume");
    this.sendResponse(response);
  }

  protected pauseRequest(
    response: DebugProtocol.PauseResponse,
    _args: DebugProtocol.PauseArguments
  ): void {
    this._debuggerAction("pause");
    this.sendEvent(new StoppedEvent("pause", THREAD_V8));
    this.sendResponse(response);
  }

  protected async evaluateRequest(
    response: DebugProtocol.EvaluateResponse,
    args: DebugProtocol.EvaluateArguments
  ): Promise<void> {
    const state = await this._fetchState();
    if (state?.properties) {
      for (const [objName, props] of Object.entries(state.properties)) {
        const propEntries = Object.entries(props as Record<string, any>);
        for (const [propName, propInfo] of propEntries) {
          if (`${objName}.${propName}` === args.expression || propName === args.expression) {
            response.body = {
              result: JSON.stringify(propInfo.value),
              variablesReference: 0,
              type: propInfo.type,
            };
            this.sendResponse(response);
            return;
          }
        }
      }
    }
    response.body = { result: "undefined", variablesReference: 0 };
    this.sendResponse(response);
  }

  protected async terminateRequest(
    response: DebugProtocol.TerminateResponse,
    _args: DebugProtocol.TerminateArguments
  ): Promise<void> {
    await this._cleanup();
    this.sendResponse(response);
  }

  protected async disconnectRequest(
    response: DebugProtocol.DisconnectResponse,
    _args: DebugProtocol.DisconnectArguments
  ): Promise<void> {
    await this._cleanup();
    this.sendResponse(response);
  }

  private async _cleanup(): Promise<void> {
    if (!this._process) return;
    const proc = this._process;
    this._process = null;
    this._pausePollingActive = false;

    // 1. Graceful shutdown via HTTP
    try { await this._httpGet("/debugger/shutdown"); } catch {}
    await sleep(300);

    // 2. SIGTERM directly to the child pid
    if (!proc.killed && proc.pid) {
      try { process.kill(proc.pid, "SIGTERM"); } catch {}
      await sleep(1500);
    }

    // 3. SIGKILL if still alive
    if (!proc.killed && proc.pid) {
      try { process.kill(proc.pid, "SIGKILL"); } catch {}
    }
  }

  private _httpGet(path: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const req = http.request(
        { hostname: "localhost", port: this._port, path, method: "GET", timeout: 3000 },
        (res) => {
          let data = "";
          res.on("data", (chunk) => (data += chunk));
          res.on("end", () => resolve(data));
        }
      );
      req.on("error", reject);
      req.end();
    });
  }

  private _qmlTreeToVariables(nodes: any[], prefix = ""): DebugProtocol.Variable[] {
    const vars: DebugProtocol.Variable[] = [];
    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i];
      const label = prefix ? `${prefix} > ${node.type}` : node.type;
      const propCount = node.properties ? Object.keys(node.properties).length : 0;
      const childCount = node.children?.length || 0;
      vars.push({
        name: label,
        value: `${propCount} props` + (childCount > 0 ? `, ${childCount} children` : ""),
        variablesReference: 0,
      });
      if (node.children?.length > 0) {
        vars.push(...this._qmlTreeToVariables(node.children, label));
      }
    }
    return vars;
  }

  private async _waitForServer(retries = 30, delay = 500, shouldAbort?: () => boolean): Promise<boolean> {
    for (let i = 0; i < retries; i++) {
      if (shouldAbort?.()) return false;
      try {
        await this._fetchState();
        return true;
      } catch {
        await new Promise((r) => setTimeout(r, delay));
      }
    }
    return false;
  }

  private _fetchState(): Promise<any> {
    return new Promise((resolve, reject) => {
      const req = http.request(
        { hostname: "localhost", port: this._port, path: "/state", method: "GET" },
        (res) => {
          let data = "";
          res.on("data", (chunk) => (data += chunk));
          res.on("end", () => {
            try { resolve(JSON.parse(data)); } catch { reject(new Error("Invalid JSON")); }
          });
        }
      );
      req.on("error", reject);
      req.end();
    });
  }

  private _setProperty(objectId: number, property: string, value: unknown): Promise<boolean> {
    return new Promise((resolve) => {
      const body = JSON.stringify({ objectId, property, value });
      const req = http.request(
        {
          hostname: "localhost",
          port: this._port,
          path: "/property",
          method: "POST",
          headers: { "Content-Type": "application/json", "Content-Length": Buffer.byteLength(body) },
        },
        (res) => {
          let data = "";
          res.on("data", (chunk) => (data += chunk));
          res.on("end", () => {
            try { resolve(JSON.parse(data).ok === true); } catch { resolve(false); }
          });
        }
      );
      req.on("error", () => resolve(false));
      req.write(body);
      req.end();
    });
  }

  private _debuggerAction(action: string): void {
    const req = http.request({
      hostname: "localhost",
      port: this._port,
      path: `/debugger/${action}`,
      method: "GET",
    });
    req.on("error", () => {});
    req.end();
  }

  private _httpPost(path: string, body: unknown): Promise<string> {
    return new Promise((resolve, reject) => {
      const data = JSON.stringify(body);
      const req = http.request(
        { hostname: "localhost", port: this._port, path, method: "POST", headers: { "Content-Type": "application/json", "Content-Length": Buffer.byteLength(data) } },
        (res) => {
          let responseData = "";
          res.on("data", (chunk) => (responseData += chunk));
          res.on("end", () => resolve(responseData));
        }
      );
      req.on("error", reject);
      req.write(data);
      req.end();
    });
  }

  private _pausePollingActive = false;

  private _startPausePolling(): void {
    if (this._pausePollingActive) return;
    this._pausePollingActive = true;
    const poll = async () => {
      if (!this._process) { this._pausePollingActive = false; return; }
      try {
        const state = await this._fetchState();
        if (state?.debuggerState?.paused) {
          this.sendEvent(new StoppedEvent("breakpoint", THREAD_V8));
          // Wait for resume before resuming poll
          const waitForResume = async () => {
            await sleep(500);
            if (!this._process) { this._pausePollingActive = false; return; }
            try {
              const s = await this._fetchState();
              if (s?.debuggerState?.paused) { waitForResume(); return; }
            } catch {}
            setTimeout(poll, 500);
          };
          waitForResume();
          return;
        }
      } catch {}
      setTimeout(poll, 500);
    };
    setTimeout(poll, 1000);
  }
}

DebugSession.run(MochaDebugSession);
