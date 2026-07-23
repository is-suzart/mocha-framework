// @mocha/mobile — NativeApp for QuickJS/Hermes runtimes
//
// Same API surface as @mocha/native, but native functions come from
// globalThis.__mocha_* host functions registered by quickjs_glue.cpp.
// Implements IBridgeApp from @mocha/bridge-api.
//
// This file is bundled with esbuild together with @mocha/core + @mocha/qml
// and loaded as a single JS file by the mocha-quickjs C++ runtime.

const g = globalThis;

if (typeof g.__mocha_nativeAppCreate !== "function") {
  throw new Error(
    "@mocha/mobile: native host functions not found. " +
    "This package must run inside the mocha-quickjs C++ runtime."
  );
}

const native = {
  nativeAppCreate:                 g.__mocha_nativeAppCreate,
  nativeEngineCreate:              g.__mocha_nativeEngineCreate,
  nativeEngineLoad:                g.__mocha_nativeEngineLoad,
  nativeEngineReload:              g.__mocha_nativeEngineReload,
  nativeEngineLoadShell:           g.__mocha_nativeEngineLoadShell,
  nativeEngineSetShellSource:      g.__mocha_nativeEngineSetShellSource,
  nativeEngineSetShellWindowProps: g.__mocha_nativeEngineSetShellWindowProps,
  nativeEngineRootObject:          g.__mocha_nativeEngineRootObject,
  nativeObjectSetProperty:         g.__mocha_nativeObjectSetProperty,
  nativeObjectGetProperty:         g.__mocha_nativeObjectGetProperty,
  nativeObjectSetInt:              g.__mocha_nativeObjectSetInt,
  nativeObjectGetInt:              g.__mocha_nativeObjectGetInt,
  nativeObjectSetBool:             g.__mocha_nativeObjectSetBool,
  nativeProcessEvents:             g.__mocha_nativeProcessEvents,
  nativeAppExec:                   g.__mocha_nativeAppExec,
  nativeAppQuit:                   g.__mocha_nativeAppQuit,
  nativeEngineCreateProxy:         g.__mocha_nativeEngineCreateProxy,
  nativeProxySetValue:             g.__mocha_nativeProxySetValue,
  nativeProxySetInt:               g.__mocha_nativeProxySetInt,
  nativeProxySetBool:              g.__mocha_nativeProxySetBool,
  nativeProxyGetValue:             g.__mocha_nativeProxyGetValue,
  nativeProxyHasPendingCalls:      g.__mocha_nativeProxyHasPendingCalls,
  nativeProxyDrainPendingCalls:    g.__mocha_nativeProxyDrainPendingCalls,
  nativeProxySetQobject:           g.__mocha_nativeProxySetQobject,
  nativeEngineSetContext:          g.__mocha_nativeEngineSetContext,
  nativeCreateListModel:           g.__mocha_nativeCreateListModel,
  nativeDestroyListModel:          g.__mocha_nativeDestroyListModel,
  nativeModelSetRows:              g.__mocha_nativeModelSetRows,
  nativeModelClear:                g.__mocha_nativeModelClear,
  nativeFindChildByName:           g.__mocha_nativeFindChildByName,
  qmlRegisterAppObjects:           g.__mocha_qmlRegisterAppObjects,
  qmlListRootObjects:              g.__mocha_qmlListRootObjects,
  qmlListChildren:                 g.__mocha_qmlListChildren,
  qmlGetProperty:                  g.__mocha_qmlGetProperty,
  qmlGetTypeName:                  g.__mocha_qmlGetTypeName,
  qmlGetObjectName:                g.__mocha_qmlGetObjectName,
  qmlSetProperty:                  g.__mocha_qmlSetProperty,
  qmlGetAllProperties:             g.__mocha_qmlGetAllProperties,
  nativeWindowSetDarkTitleBar:     g.__mocha_nativeWindowSetDarkTitleBar,
  nativeWindowStartSystemMove:     g.__mocha_nativeWindowStartSystemMove,
};

export const {
  nativeAppCreate,
  nativeEngineCreate,
  nativeEngineLoad,
  nativeEngineReload,
  nativeEngineLoadShell,
  nativeEngineSetShellSource,
  nativeEngineSetShellWindowProps,
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
  nativeProxySetQobject,
  nativeEngineSetContext,
  nativeCreateListModel,
  nativeDestroyListModel,
  nativeModelSetRows,
  nativeModelClear,
  nativeFindChildByName,
  qmlRegisterAppObjects,
  qmlListRootObjects,
  qmlListChildren,
  qmlGetProperty,
  qmlGetTypeName,
  qmlGetObjectName,
  qmlSetProperty,
  qmlGetAllProperties,
  nativeWindowSetDarkTitleBar,
  nativeWindowStartSystemMove,
} = native;

// ── High-level NativeApp ──

class NativeApp {
  _initialized = false;
  _engine = 0;
  _rootObject = 0;
  _listModels = new Map();

  init() {
    if (this._initialized) return;
    this._engine = nativeEngineCreate();
    this._initialized = true;
  }

  loadQML(qml, basePath) {
    if (!this._initialized) this.init();
    basePath = basePath || (g.process && g.process.cwd ? g.process.cwd() : "/");
    const importPath = this._findImportPath(basePath);
    nativeEngineLoad(this._engine, qml, basePath, importPath);
    try {
      this._rootObject = nativeEngineRootObject(this._engine);
    } catch {
      if (g.console && g.console.warn) {
        g.console.warn("[Mocha] QML loaded but no root object (window may not be visible yet)");
      }
    }
  }

  reloadQML(qml, basePath) {
    basePath = basePath || (g.process && g.process.cwd ? g.process.cwd() : "/");
    const importPath = this._findImportPath(basePath);
    this._rootObject = nativeEngineReload(this._engine, qml, basePath, importPath);
    return this._rootObject;
  }

  _findImportPath(_basePath) {
    return "";
  }

  loadShell(basePath) {
    if (!this._initialized) this.init();
    basePath = basePath || (g.process && g.process.cwd ? g.process.cwd() : "/");
    nativeEngineLoadShell(this._engine, this._findImportPath(basePath));
    this.processEvents();
    try {
      this._rootObject = nativeEngineRootObject(this._engine);
    } catch {}
  }

  setShellSource(qml) {
    nativeEngineSetShellSource(this._engine, qml);
  }

  setShellWindowProps(opts) {
    nativeEngineSetShellWindowProps(
      this._engine,
      opts.title || null,
      opts.width || null,
      opts.height || null
    );
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

  destroyProxy(proxyId) {
    const prefix = `${proxyId}:`;
    for (const [key, modelId] of this._listModels) {
      if (String(key).startsWith(prefix)) {
        nativeDestroyListModel(modelId);
        this._listModels.delete(key);
      }
    }
  }

  proxySetValue(proxyId, name, value) {
    if (typeof value === "number" && Number.isInteger(value)) {
      nativeProxySetInt(proxyId, name, value);
    } else if (typeof value === "boolean") {
      nativeProxySetBool(proxyId, name, value);
    } else if (typeof value === "string") {
      nativeProxySetValue(proxyId, name, value);
    } else if (value === null || value === undefined) {
      nativeProxySetValue(proxyId, name, "");
    } else if (Array.isArray(value)) {
      const key = `${proxyId}:${name}`;
      let modelId = this._listModels.get(key);
      if (!modelId) {
        modelId = nativeCreateListModel();
        this._listModels.set(key, modelId);
      }
      nativeModelSetRows(modelId, JSON.stringify(value));
      nativeProxySetQobject(proxyId, name, modelId);
    } else {
      nativeProxySetValue(proxyId, name, JSON.stringify(value));
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
    if (!this._rootObject) return null;
    return nativeFindChildByName(this._rootObject, name);
  }

  getRootObject() {
    return this._rootObject;
  }

  setDarkTitleBar(dark) {
    if (!this._rootObject) return;
    nativeWindowSetDarkTitleBar(this._rootObject, !!dark);
  }

  startSystemMove(objId) {
    if (!objId) return;
    nativeWindowStartSystemMove(objId);
  }

  getObjectProperty(objId, name) {
    return nativeObjectGetProperty(objId, name);
  }

  setObjectProperty(objId, name, value) {
    if (typeof value === "number" && Number.isInteger(value)) {
      nativeObjectSetInt(objId, name, value);
    } else if (typeof value === "boolean") {
      nativeObjectSetBool(objId, name, value);
    } else if (typeof value === "string") {
      nativeObjectSetProperty(objId, name, value);
    } else if (value === null || value === undefined) {
      nativeObjectSetProperty(objId, name, "");
    } else {
      nativeObjectSetProperty(objId, name, JSON.stringify(value));
    }
  }

  processEvents() {
    nativeProcessEvents();
  }

  registerAppObjects() {
    if (!this._engine || this._engine <= 0) return;
    try { qmlRegisterAppObjects(this._engine); } catch {}
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

export function createNativeApp() {
  if (_cachedApp) return _cachedApp;
  _cachedApp = new NativeApp();
  _cachedApp.init();
  return _cachedApp;
}

export function createMobileApp() {
  return createNativeApp();
}

export function getNativeApp() {
  return _cachedApp;
}
