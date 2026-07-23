// ── QML Node Tree ──
export interface QmlNode {
  id: number;
  className: string;
  objectName: string;
  children: QmlNode[];
}

export interface QmlProperty {
  name: string;
  type: string;
  value: string;
  readable: boolean;
  writable: boolean;
}

// ── Shell window options ──
export interface ShellWindowProps {
  title?: string | null;
  width?: number | null;
  height?: number | null;
}

// ── High-level Bridge App ──
export interface IBridgeApp {
  init(): void;
  loadQML(qml: string, basePath?: string): void;
  reloadQML(qml: string, basePath?: string): number;
  loadShell(basePath?: string): void;
  setShellSource(qml: string): void;
  setShellWindowProps(opts: ShellWindowProps): void;

  setProperty(property: string, value: string | number | boolean): void;
  getProperty(property: string): string;

  createProxy(): number;
  destroyProxy(proxyId: number): void;
  proxySetValue(proxyId: number, name: string, value: unknown): void;
  proxyGetValue(proxyId: number, name: string): string;
  proxyHasPendingCalls(proxyId: number): boolean;
  proxyDrainPendingCalls(proxyId: number): string[];
  setContextProperty(name: string, proxyId: number): void;

  findChild(name: string): number | null;
  getRootObject(): number | null;

  getObjectProperty(objId: number, name: string): string;
  setObjectProperty(objId: number, name: string, value: string | number | boolean): void;

  setDarkTitleBar(dark: boolean): void;
  startSystemMove(objId: number): void;

  processEvents(): void;
  exec(): number;
  quit(): void;

  // QML Inspector
  registerAppObjects(): void;
  listRootObjects(): QmlNode[];
  listChildren(objId: number): QmlNode[];
  getQmlProperty(objId: number, name: string): string;
  getQmlProperties(objId: number): QmlProperty[];
  setQmlProperty(objId: number, name: string, value: string): void;
}

// ── Low-level bridge FFI type ──
export interface IBridgeFFI {
  nativeAppCreate(): void;
  nativeEngineCreate(): number;
  nativeEngineLoad(engine: number, qml: string, basePath: string, importPath?: string): void;
  nativeEngineReload(engine: number, qml: string, basePath: string, importPath?: string): number;
  nativeEngineLoadShell(engine: number, importPath?: string): void;
  nativeEngineSetShellSource(engine: number, qml: string): void;
  nativeEngineSetShellWindowProps(engine: number, title: string | null, width: number | null, height: number | null): void;
  nativeEngineRootObject(engine: number): number;

  nativeObjectSetProperty(obj: number, prop: string, value: string): void;
  nativeObjectGetProperty(obj: number, prop: string): string;
  nativeObjectSetInt(obj: number, prop: string, value: number): void;
  nativeObjectGetInt(obj: number, prop: string): number;
  nativeObjectSetBool(obj: number, prop: string, value: boolean): void;

  nativeProcessEvents(): void;
  nativeAppExec(): number;
  nativeAppQuit(): void;

  nativeEngineCreateProxy(engine: number): number;
  nativeProxySetValue(proxyId: number, name: string, value: string): void;
  nativeProxySetInt(proxyId: number, name: string, value: number): void;
  nativeProxySetBool(proxyId: number, name: string, value: boolean): void;
  nativeProxyGetValue(proxyId: number, name: string): string;
  nativeProxyHasPendingCalls(proxyId: number): boolean;
  nativeProxyDrainPendingCalls(proxyId: number): string[];
  nativeProxySetQobject(proxyId: number, name: string, qobjId: number): void;
  nativeEngineSetContext(engine: number, name: string, proxyId: number): void;

  nativeCreateListModel(): number;
  nativeDestroyListModel(modelId: number): void;
  nativeModelSetRows(modelId: number, json: string): void;
  nativeModelClear(modelId: number): void;

  nativeFindChildByName(parentId: number, name: string): number;

  qmlRegisterAppObjects(engine: number): void;
  qmlListRootObjects(): number[];
  qmlListChildren(objId: number): number[];
  qmlGetProperty(objId: number, name: string): string | null;
  qmlGetTypeName(objId: number): string;
  qmlGetObjectName(objId: number): string;
  qmlSetProperty(objId: number, name: string, value: string): void;
  qmlGetAllProperties(objId: number): string;

  nativeWindowSetDarkTitleBar(objId: number, dark: boolean): void;
  nativeWindowStartSystemMove(objId: number): void;
}

// ── Factory ──
export interface IBridgeFactory {
  createNativeApp(): Promise<IBridgeApp>;
  getNativeApp(): IBridgeApp | null;
}

// ── Runtime selection ──
export type BridgeRuntime = 'node' | 'quickjs' | 'hermes';
