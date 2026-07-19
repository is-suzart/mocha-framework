import { createRequire } from "node:module";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);

const platformTriples = {
  "linux-x64": "mocha-native.linux-x64-gnu.node",
  "linux-arm64": "mocha-native.linux-arm64-gnu.node",
  "darwin-x64": "mocha-native.darwin-x64.node",
  "darwin-arm64": "mocha-native.darwin-arm64.node",
  "win32-x64": "mocha-native.win32-x64-msvc.node",
};

function getPlatformKey() {
  const arch = process.arch === "x64" ? "x64" : process.arch === "arm64" ? "arm64" : process.arch;
  const platform = process.platform === "win32" ? "win32" : process.platform === "darwin" ? "darwin" : "linux";
  return `${platform}-${arch}`;
}

const key = getPlatformKey();
const binaryName = platformTriples[key] || platformTriples["linux-x64"];

let native;

try {
  native = require(`./${binaryName}`);
} catch {
  try {
    native = require(join(__dirname, binaryName));
  } catch (e) {
    throw new Error(
      `@mocha/native: Failed to load native binary for ${key}. ` +
      `Build with: cd node_modules/@mocha/native && npx napi build --platform --release`
    );
  }
}

export const {
  nativeAppCreate,
  nativeEngineCreate,
  nativeEngineLoad,
  nativeEngineRootObject,
  nativeObjectSetProperty,
  nativeObjectGetProperty,
  nativeObjectSetInt,
  nativeObjectGetInt,
  nativeObjectSetBool,
  nativeProcessEvents,
  nativeAppExec,
  nativeAppQuit,
  nativeEngineCreateProxy,
  nativeProxySetValue,
  nativeProxySetInt,
  nativeProxySetBool,
  nativeProxyGetValue,
  nativeProxyHasPendingCalls,
  nativeProxyDrainPendingCalls,
  nativeEngineSetContext,
  nativeFindChildByName,
} = native;

// High-level API
class NativeApp {
  _initialized = false;
  _engine = 0;
  _rootObject = 0;

  init() {
    if (this._initialized) return;
    nativeAppCreate();
    this._engine = nativeEngineCreate();
    this._initialized = true;
  }

  loadQML(qml, basePath) {
    if (!this._initialized) this.init();
    basePath = basePath || process.cwd();
    let importPath = "";
    // Auto-detect MochaDS import path based on CWD
    const { existsSync } = require("node:fs");
    const { join } = require("node:path");
    const candidates = [
      join(basePath, "ui"),
      join(basePath, "..", "ui"),
    ];
    for (const c of candidates) {
      if (existsSync(join(c, "MochaDS", "qmldir"))) {
        importPath = c;
        break;
      }
    }
    nativeEngineLoad(this._engine, qml, basePath, importPath);
    try {
      this._rootObject = nativeEngineRootObject(this._engine);
    } catch {
      console.warn("[Mocha] QML loaded but no root object (window may not be visible yet)");
    }
  }

  setProperty(property, value) {
    if (!this._rootObject) throw new Error("No root object. Call loadQML first.");
    if (typeof value === "number" && Number.isInteger(value)) {
      nativeObjectSetInt(this._rootObject, property, value);
    } else if (typeof value === "boolean") {
      nativeObjectSetBool(this._rootObject, property, value);
    } else {
      nativeObjectSetProperty(this._rootObject, property, String(value));
    }
  }

  getProperty(property) {
    if (!this._rootObject) throw new Error("No root object. Call loadQML first.");
    return nativeObjectGetProperty(this._rootObject, property);
  }

  createProxy() {
    return nativeEngineCreateProxy(this._engine);
  }

  proxySetValue(proxyId, name, value) {
    if (typeof value === "number" && Number.isInteger(value)) {
      nativeProxySetInt(proxyId, name, value);
    } else if (typeof value === "boolean") {
      nativeProxySetBool(proxyId, name, value);
    } else {
      nativeProxySetValue(proxyId, name, String(value));
    }
  }

  proxyGetValue(proxyId, name) {
    return nativeProxyGetValue(proxyId, name);
  }

  proxyHasPendingCalls(proxyId) {
    return nativeProxyHasPendingCalls(proxyId);
  }

  proxyDrainPendingCalls(proxyId) {
    return nativeProxyDrainPendingCalls(proxyId);
  }

  setContextProperty(name, proxyId) {
    nativeEngineSetContext(this._engine, name, proxyId);
  }

  findChild(name) {
    if (!this._rootObject) throw new Error("No root object. Call loadQML first.");
    return nativeFindChildByName(this._rootObject, name);
  }

  getObjectProperty(objId, name) {
    return nativeObjectGetProperty(objId, name);
  }

  setObjectProperty(objId, name, value) {
    if (typeof value === "number" && Number.isInteger(value)) {
      nativeObjectSetInt(objId, name, value);
    } else if (typeof value === "boolean") {
      nativeObjectSetBool(objId, name, value);
    } else {
      nativeObjectSetProperty(objId, name, String(value));
    }
  }

  processEvents() {
    nativeProcessEvents();
  }

  exec() {
    return nativeAppExec();
  }

  quit() {
    nativeAppQuit();
  }
}

let _cachedApp = null;

export async function createNativeApp() {
  if (_cachedApp) return _cachedApp;
  _cachedApp = new NativeApp();
  _cachedApp.init();
  return _cachedApp;
}

export function getNativeApp() {
  return _cachedApp;
}
