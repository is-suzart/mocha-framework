import { QObject, QProperty, effect, globalContainer } from "@mocha/core";
import { getQMLComponentMetadata, getAllQMLComponents, generateQMLSource, type ProxyEntry } from "./qml-component.js";

export interface RunAppOptions {
  basePath?: string;
  onReady?: () => void;
}

export async function runApp<T extends QObject>(
  componentClass: new (...args: any[]) => T,
  options?: RunAppOptions
): Promise<void> {
  const meta = getQMLComponentMetadata(componentClass);
  if (!meta) {
    throw new Error(
      `No QML metadata found for "${componentClass.name}". ` +
      "Did you forget the @QMLComponent decorator?"
    );
  }

  let nativeApp: any = null;
  try {
    const { createNativeApp } = await import("@mocha/native");
    nativeApp = await createNativeApp();
  } catch {
    nativeApp = createMockNativeApp();
  }

  // ── Scan & instantiate root services ──
  const rootServices = scanRootServices();
  const proxyEntries: ProxyEntry[] = [];

  for (const service of rootServices) {
    const proxyId = nativeApp.createProxy();
    proxyEntries.push({
      proxyId,
      instance: service.instance,
      componentName: service.componentName,
    });

    const props = scanProperties(service.instance);
    for (const { name, qp } of props) {
      effect(() => {
        const val = qp.value;
        nativeApp.proxySetValue(proxyId, name, val);
      });
    }

    nativeApp.setContextProperty(service.componentName, proxyId);
  }

  // ── Create main controller and register as context property ──
  const controller = new componentClass();
  const CONTEXT_NAME = "controller";
  const mainProxyId = nativeApp.createProxy();
  proxyEntries.push({
    proxyId: mainProxyId,
    instance: controller,
    componentName: CONTEXT_NAME,
  });

  const mainProps = scanProperties(controller);
  for (const { name, qp } of mainProps) {
    effect(() => {
      const val = qp.value;
      nativeApp.proxySetValue(mainProxyId, name, val);
    });
  }
  nativeApp.setContextProperty(CONTEXT_NAME, mainProxyId);

  // ── Generate and load QML ──
  const qmlSource = generateQMLSource(controller, meta, proxyEntries);
  nativeApp.loadQML(qmlSource, options?.basePath || process.cwd());

  options?.onReady?.();

  // ── Event loop: interleave Qt events + Node.js event loop ──
  await runEventLoop(nativeApp, proxyEntries);
}

function drainPendingCalls(nativeApp: any, entries: ProxyEntry[]): void {
  for (const entry of entries) {
    const method = nativeApp.proxyDrainPendingCall(entry.proxyId);
    if (method) {
      const fn = (entry.instance as any)[method];
      if (typeof fn === "function") {
        fn.call(entry.instance);
      }
    }
  }
}

function runEventLoop(nativeApp: any, entries: ProxyEntry[]): Promise<void> {
  return new Promise((resolve) => {
    let running = true;

    const tick = () => {
      if (!running) {
        resolve();
        return;
      }

      try {
        nativeApp.processEvents();
      } catch {
        running = false;
        resolve();
        return;
      }

      drainPendingCalls(nativeApp, entries);

      if (running) {
        setTimeout(tick, 8);
      }
    };

    // Hook window close to stop the loop
    process.once("SIGINT", () => { running = false; });
    process.once("SIGTERM", () => { running = false; });

    tick();
  });
}

function scanRootServices(): Array<{ instance: QObject; componentName: string }> {
  const results: Array<{ instance: QObject; componentName: string }> = [];
  const all = getAllQMLComponents();

  for (const [cls, meta] of all.entries()) {
    if (meta.providedIn === "root") {
      const name = meta.componentName;
      let instance: QObject;

      if (globalContainer.has(cls as any)) {
        instance = globalContainer.resolve(cls as any);
      } else {
        instance = new (cls as any)();
      }

      results.push({ instance, componentName: name });
    }
  }

  return results;
}

function scanProperties(instance: QObject): Array<{ name: string; qp: QProperty }> {
  const props: Array<{ name: string; qp: QProperty }> = [];
  const visited = new Set<string>();

  let proto = Object.getPrototypeOf(instance);
  while (proto && proto !== Object.prototype) {
    const ownKeys = Object.getOwnPropertyNames(proto);
    for (const key of ownKeys) {
      if (key.startsWith("__qproperty_")) {
        const propName = key.replace("__qproperty_", "");
        if (visited.has(propName)) continue;
        visited.add(propName);

        const val = (instance as any)[propName];
        if (val instanceof QProperty) {
          props.push({ name: propName, qp: val });
        }
      }
    }
    proto = Object.getPrototypeOf(proto);
  }

  return props;
}

function createMockNativeApp() {
  return {
    loadQML: () => {},
    setProperty: () => {},
    getProperty: () => "",
    createProxy: () => 0,
    proxySetValue: () => {},
    proxyGetValue: () => "",
    proxyDrainPendingCall: () => null,
    setContextProperty: () => {},
    processEvents: () => {},
    exec: () => 0,
    quit: () => {},
  };
}
