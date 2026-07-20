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

if (process.platform === "win32") {
  const qtDir = process.env.QT6_DIR || "C:\\Qt\\6.8.2\\msvc2022_64";
  const qtBin = join(qtDir, "bin");
  process.env.PATH = `${qtBin};${process.env.PATH}`;
}

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
  qmlRegisterAppObjects,
  qmlListRootObjects,
  qmlListChildren,
  qmlGetProperty,
  qmlGetTypeName,
  qmlGetObjectName,
  qmlSetProperty,
  qmlGetAllProperties,
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
      join(basePath, "design-system"),
      join(basePath, "..", "design-system"),
      join(basePath, "..", "..", "design-system"),
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
    console.log(`[native] proxySetValue(${proxyId}, ${name}, ${JSON.stringify(value)}) typeof=${typeof value}`);
    if (typeof value === "number" && Number.isInteger(value)) {
      console.log(`  → nativeProxySetInt`);
      nativeProxySetInt(proxyId, name, value);
    } else if (typeof value === "boolean") {
      console.log(`  → nativeProxySetBool`);
      nativeProxySetBool(proxyId, name, value);
    } else {
      console.log(`  → nativeProxySetValue`);
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

  registerAppObjects() {
    if (!this._engine || this._engine <= 0) return;
    try { qmlRegisterAppObjects(this._engine); } catch(e) { /* Qt objects may not be available */ }
  }

  listRootObjects() {
    const ids = qmlListRootObjects();
    return ids.map((id) => this._buildQmlNode(id));
  }

  listChildren(objId) {
    const ids = qmlListChildren(objId);
    return ids.map((id) => this._buildQmlNode(id));
  }

  getQmlProperty(objId, name) {
    return qmlGetProperty(objId, name) ?? "";
  }

  getQmlProperties(objId) {
    const json = qmlGetAllProperties(objId);
    try { return JSON.parse(json); } catch { return []; }
  }

  setQmlProperty(objId, name, value) {
    qmlSetProperty(objId, name, String(value));
  }

  _buildQmlNode(id) {
    const className = qmlGetTypeName(id) ?? "Unknown";
    const objectName = qmlGetObjectName(id) ?? "";
    const childIds = qmlListChildren(id) ?? [];
    return {
      id,
      className,
      objectName,
      children: childIds.map((cid) => this._buildQmlNode(cid)),
    };
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
