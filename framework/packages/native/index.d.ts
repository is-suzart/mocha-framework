export function nativeAppCreate(): void;
export function nativeEngineCreate(): number;
export function nativeEngineLoad(engineId: number, qmlData: string, basePath: string, importPath: string): void;
export function nativeEngineRootObject(engineId: number): number;
export function nativeObjectSetProperty(objId: number, name: string, value: string): void;
export function nativeObjectGetProperty(objId: number, name: string): string;
export function nativeObjectSetInt(objId: number, name: string, value: number): void;
export function nativeObjectGetInt(objId: number, name: string): number;
export function nativeObjectSetBool(objId: number, name: string, value: boolean): void;
export function nativeProcessEvents(): void;
export function nativeAppExec(): number;
export function nativeAppQuit(): void;
export function nativeEngineCreateProxy(engineId: number): number;
export function nativeProxySetValue(proxyId: number, name: string, value: string): void;
export function nativeProxySetInt(proxyId: number, name: string, value: number): void;
export function nativeProxySetBool(proxyId: number, name: string, value: boolean): void;
export function nativeProxyGetValue(proxyId: number, name: string): string;
export function nativeProxyHasPendingCalls(proxyId: number): boolean;
export function nativeProxyDrainPendingCalls(proxyId: number): string[];
export function nativeEngineSetContext(engineId: number, name: string, proxyId: number): void;
export function nativeFindChildByName(parentId: number, name: string): number;

export class NativeApp {
  init(): void;
  loadQML(qml: string, basePath?: string): void;
  setProperty(property: string, value: string | number | boolean): void;
  getProperty(property: string): string;
  createProxy(): number;
  proxySetValue(proxyId: number, name: string, value: string | number | boolean): void;
  proxyGetValue(proxyId: number, name: string): string;
  proxyHasPendingCalls(proxyId: number): boolean;
  proxyDrainPendingCalls(proxyId: number): string[];
  setContextProperty(name: string, proxyId: number): void;
  findChild(name: string): number;
  getObjectProperty(objId: number, name: string): string;
  setObjectProperty(objId: number, name: string, value: string | number | boolean): void;
  processEvents(): void;
  exec(): number;
  quit(): void;
}

export function createNativeApp(): Promise<NativeApp>;
export function getNativeApp(): NativeApp | null;
