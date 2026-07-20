import { Logger } from "@mocha/shared";
import { hotReload } from "@mocha/qml";
import * as fs from "node:fs";
import * as path from "node:path";
import { createServer, type IncomingMessage, type ServerResponse } from "node:http";

const logger = new Logger("dev");

interface DevServerOptions {
  entry: string;
  port: number;
  watch: boolean;
}

class DevServer {
  private options: DevServerOptions;
  private server: ReturnType<typeof createServer> | null = null;
  private watchers: fs.FSWatcher[] = [];
  private _childProcess: ReturnType<typeof import("child_process").spawn> | null = null;

  constructor(options: DevServerOptions) {
    this.options = options;
  }

  async start(): Promise<void> {
    const entryPath = path.resolve(process.cwd(), this.options.entry);

    if (!fs.existsSync(entryPath)) {
      logger.error(`Entry file not found: ${entryPath}`);
      process.exit(1);
    }

    hotReload.enable();

    this.server = createServer((req, res) => this._handleRequest(req, res));
    this.server.listen(this.options.port, () => {
      logger.info(`Dev server running at http://localhost:${this.options.port}`);
      logger.info(`Watching: ${this.options.entry}`);
      logger.info("Hot reload enabled - edit files and see changes instantly");
    });

    if (this.options.watch) {
      this._startWatcher();
    }

    await this._compileAndLaunch(entryPath);
  }

  async stop(): Promise<void> {
    this.watchers.forEach((w) => w.close());
    this.watchers = [];

    if (this._childProcess) {
      this._childProcess.kill();
      this._childProcess = null;
    }

    if (this.server) {
      this.server.close();
      this.server = null;
    }

    hotReload.disable();

    logger.info("Dev server stopped");
  }

  private async _compileAndLaunch(entryPath: string): Promise<void> {
    try {
      logger.info("Launching with tsx...");

      const { spawn } = await import("child_process");
      const tsxBin = path.resolve(process.cwd(), "node_modules", ".bin", "tsx");

      this._childProcess = spawn(
        tsxBin,
        [entryPath],
        {
          stdio: "inherit",
          cwd: process.cwd(),
          env: { ...process.env, MOCHA_ENV: "development" },
        }
      );

      this._childProcess.on("exit", (code) => {
        logger.info(`Application exited with code ${code}`);
        this._childProcess = null;
      });

      this._childProcess.on("error", (err) => {
        logger.error("Failed to spawn application:", err);
        this._childProcess = null;
      });

      logger.info("Application launched (tsx child process)");
    } catch (err) {
      logger.error("Failed to launch application:", err);
    }
  }

  private _startWatcher(): void {
    const srcDir = path.resolve(process.cwd(), "src");

    if (!fs.existsSync(srcDir)) return;

    const watchCallback = async (event: string, filename: string | null) => {
      if (!filename || !filename.endsWith(".qml.ts")) return;

      const fullPath = path.resolve(srcDir, filename);
      logger.info(`File changed: ${filename}`);

      try {
        const reloaded = await hotReload.reload(fullPath);
        if (reloaded) {
          logger.info(`Hot reload: ${filename}`);
        }
      } catch (err) {
        logger.error(`Reload failed: ${filename}`, err);
      }
    };

    const watcher = fs.watch(srcDir, { recursive: true }, watchCallback);
    this.watchers.push(watcher);
  }

  private _handleRequest(req: IncomingMessage, res: ServerResponse): void {
    const url = req.url ?? "/";

    if (url === "/__mocha__/status") {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({
          status: "running",
          hotReload: hotReload.isEnabled,
          entries: Array.from(hotReload.getAllEntries().keys()),
        })
      );
      return;
    }

    if (url === "/__mocha__/reload" && req.method === "POST") {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ reloaded: true }));
      return;
    }

    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(this._generateDevPage());
  }

  private _generateDevPage(): string {
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Mocha Dev Server</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: system-ui; background: #1a1a1a; color: #e0e0e0; padding: 32px; }
    h1 { font-size: 24px; margin-bottom: 16px; }
    .card { background: #2a2a2a; border-radius: 8px; padding: 16px; margin-bottom: 12px; }
    .status { display: inline-block; width: 8px; height: 8px; border-radius: 50%; background: #4ec9b0; margin-right: 8px; }
    code { background: #333; padding: 2px 6px; border-radius: 4px; font-size: 14px; }
  </style>
</head>
<body>
  <h1><span class="status"></span> Mocha Dev Server</h1>
  <div class="card">
    <p><strong>Status:</strong> Running</p>
    <p><strong>Entry:</strong> <code>${this.options.entry}</code></p>
    <p><strong>Port:</strong> ${this.options.port}</p>
    <p><strong>Hot Reload:</strong> Enabled</p>
  </div>
  <div class="card">
    <p>Edit <code>.qml.ts</code> files to see live changes.</p>
    <p>Debug server available on port <code>9229</code> (connect via VSCode extension)</p>
  </div>
</body>
</html>`;
  }
}

export async function run(args: string[]): Promise<void> {
  const entry = args[0] || findEntry();
  const portIndex = args.indexOf("--port") >= 0
    ? args.indexOf("--port")
    : args.indexOf("-p") >= 0
      ? args.indexOf("-p")
      : -1;
  const port = portIndex >= 0 ? parseInt(args[portIndex + 1], 10) : 8090;
  const watch = args.includes("--watch") || args.includes("-w") || args.length <= 1;

  if (!entry) {
    logger.error("No entry file specified");
    process.exit(1);
  }

  const server = new DevServer({ entry, port, watch });
  await server.start();

  process.on("SIGINT", async () => {
    logger.info("\nShutting down...");
    await server.stop();
    process.exit(0);
  });

  process.on("SIGTERM", async () => {
    await server.stop();
    process.exit(0);
  });
}

function findEntry(): string | null {
  const candidates = [
    "src/App.qml.ts",
    "src/app.qml.ts",
    "src/main.qml.ts",
    "src/index.qml.ts",
    "App.qml.ts",
    "index.qml.ts",
  ];
  for (const candidate of candidates) {
    if (fs.existsSync(path.resolve(process.cwd(), candidate))) {
      return candidate;
    }
  }
  return null;
}
