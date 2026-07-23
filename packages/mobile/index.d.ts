// @mocha/mobile type declarations
// Implements IBridgeApp from @mocha/bridge-api
export type {
  IBridgeApp,
  IBridgeFFI,
  QmlNode,
  QmlProperty,
  ShellWindowProps,
} from "@mocha/bridge-api";

export declare function nativeAppCreate(): void;
export declare function nativeEngineCreate(): number;
export declare function nativeEngineLoad(engine: number, qml: string, basePath: string, importPath?: string): void;
export declare function nativeEngineReload(engine: number, qml: string, basePath: string, importPath?: string): number;
export declare function nativeEngineLoadShell(engine: number, importPath?: string): void;
export declare function nativeEngineSetShellSource(engine: number, qml: string): void;
export declare function nativeEngineSetShellWindowProps(engine: number, title: string | null, width: number | null, height: number | null): void;
export declare function nativeEngineRootObject(engine: number): number;
export declare function nativeObjectSetProperty(obj: number, prop: string, value: string): void;
export declare function nativeObjectGetProperty(obj: number, prop: string): string;
export declare function nativeObjectSetInt(obj: number, prop: string, value: number): void;
export declare function nativeObjectGetInt(obj: number, prop: string): number;
export declare function nativeObjectSetBool(obj: number, prop: string, value: boolean): void;
export declare function nativeProcessEvents(): void;
export declare function nativeAppExec(): number;
export declare function nativeAppQuit(): void;
export declare function nativeEngineCreateProxy(engine: number): number;
export declare function nativeProxySetValue(proxyId: number, name: string, value: string): void;
export declare function nativeProxySetInt(proxyId: number, name: string, value: number): void;
export declare function nativeProxySetBool(proxyId: number, name: string, value: boolean): void;
export declare function nativeProxyGetValue(proxyId: number, name: string): string;
export declare function nativeProxyHasPendingCalls(proxyId: number): boolean;
export declare function nativeProxyDrainPendingCalls(proxyId: number): string[];
export declare function nativeProxySetQobject(proxyId: number, name: string, qobjId: number): void;
export declare function nativeEngineSetContext(engine: number, name: string, proxyId: number): void;
export declare function nativeCreateListModel(): number;
export declare function nativeDestroyListModel(modelId: number): void;
export declare function nativeModelSetRows(modelId: number, json: string): void;
export declare function nativeModelClear(modelId: number): void;
export declare function nativeFindChildByName(parentId: number, name: string): number;
export declare function qmlRegisterAppObjects(engine: number): void;
export declare function qmlListRootObjects(): number[];
export declare function qmlListChildren(objId: number): number[];
export declare function qmlGetProperty(objId: number, name: string): string | null;
export declare function qmlGetTypeName(objId: number): string;
export declare function qmlGetObjectName(objId: number): string;
export declare function qmlSetProperty(objId: number, name: string, value: string): void;
export declare function qmlGetAllProperties(objId: number): string;
export declare function nativeWindowSetDarkTitleBar(objId: number, dark: boolean): void;
export declare function nativeWindowStartSystemMove(objId: number): void;

export declare class NativeApp {
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
  registerAppObjects(): void;
  listRootObjects(): QmlNode[];
  listChildren(objId: number): QmlNode[];
  getQmlProperty(objId: number, name: string): string;
  getQmlProperties(objId: number): QmlProperty[];
  setQmlProperty(objId: number, name: string, value: string): void;
}

export declare function createNativeApp(): NativeApp;
export declare function createMobileApp(): NativeApp;
export declare function getNativeApp(): NativeApp | null;
