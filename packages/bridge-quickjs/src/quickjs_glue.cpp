// quickjs_glue.cpp — QuickJS ↔ C++ Qt bridge
//
// Replaces the Rust/napi-rs layer with direct QuickJS FFI.
// Registers every extern "C" function from qt_bridge.cpp as a QuickJS
// host function so JS code can call them via globalThis.__mocha_<name>.
//
// Architecture:
//   JS bundle → QuickJS host functions → extern "C" → qt_bridge.cpp → Qt/QML
//
// Build: CMake links quickjs_glue.cpp + qt_bridge.cpp + mocha_list_model.cpp
//        + libquickjs.a + Qt6 → standalone binary "mocha-quickjs"

#include <QString>
#include <QByteArray>
#include <QCoreApplication>
#include <QTimer>
#include <QThread>
#include <QDebug>
#include <QVariant>
#include <cstdio>
#include <cstdlib>
#include <cstring>
#include <unordered_map>
#include <mutex>

// QuickJS includes (headers at packages/native/quickjs/)
#include "quickjs.h"

// ── extern "C" declarations from qt_bridge.cpp ──
extern "C" {
// QApplication
void* qt_app_create(int, char**);
void  qt_app_destroy(void*);

// QML Engine
void* qml_engine_create();
void  qml_engine_destroy(void*);
void  qml_engine_close_all_windows(void*);
void  qml_engine_clear_cache(void*);
void  qml_engine_load_data(void*, const char*, const char*, const char*);
void  qml_engine_load_shell(void*, const char*);
void  qml_engine_set_shell_source(void*, const char*);
void  qml_engine_set_shell_window_props(void*, const char*, int, int);
void* qml_engine_root_objects(void*);

// QObject properties
const char* qt_object_get_property(void*, const char*);
void qt_object_set_property(void*, const char*, const char*);
int  qt_object_get_int_property(void*, const char*);
void qt_object_set_int_property(void*, const char*, int);
int  qt_object_get_bool_property(void*, const char*);
void qt_object_set_bool_property(void*, const char*, int);

// Event loop
void qt_app_process_events();
int  qt_app_exec(void*);
void qt_app_quit(void*);

// MochaPropertyMap
void* mocha_object_create(int);
void  mocha_object_destroy(void*);
void  mocha_object_set_value(void*, const char*, const char*);
void  mocha_object_set_int(void*, const char*, int);
void  mocha_object_set_bool(void*, const char*, int);
const char* mocha_object_get_value(void*, const char*);
int  mocha_object_has_pending_calls(void*);
int  mocha_object_drain_pending_calls(void*, char*, int);
void qml_engine_set_context_property(void*, const char*, void*);
void* qml_find_child_by_name(void*, const char*);

// QML Tree Inspector
void  native_qml_register_app_objects(void*);
int   native_qml_list_root_objects(int*, int);
int   native_qml_list_children(int, int*, int);
const char* native_qml_get_property(int, const char*);
const char* native_qml_get_type_name(int);
const char* native_qml_get_object_name(int);
void  native_qml_set_property(int, const char*, const char*);
void  native_qml_get_all_properties(int, char*, int);

// Window management
void mocha_window_set_dark_title_bar(void*, int);
void mocha_window_start_system_move(void*);

// MochaPropertyMap set QObject
void mocha_property_map_set_qobject(void*, const char*, void*);

// MochaListModel
void* mocha_list_model_create();
void  mocha_list_model_destroy(void*);
void  mocha_list_model_set_rows(void*, const char*);
void  mocha_list_model_clear(void*);
}

// ── Handle Registry ──
// Maps JS-visible integer IDs to C++ void* pointers.
// Thread-safe via std::mutex.

static std::mutex g_handleMutex;
static int g_nextHandle = 1;
static std::unordered_map<int, void*> g_handles;

static int handle_put(void* ptr) {
  if (!ptr) return 0;
  std::lock_guard<std::mutex> lock(g_handleMutex);
  int id = g_nextHandle++;
  g_handles[id] = ptr;
  return id;
}

static void* handle_get(int id) {
  std::lock_guard<std::mutex> lock(g_handleMutex);
  auto it = g_handles.find(id);
  return (it != g_handles.end()) ? it->second : nullptr;
}

static void handle_remove(int id) {
  std::lock_guard<std::mutex> lock(g_handleMutex);
  g_handles.erase(id);
}

// ── QuickJS Helpers ──

static JSContext* g_jsCtx = nullptr;

static JSValue qjs_throw(JSContext* ctx, const char* msg) {
  return JS_ThrowInternalError(ctx, "%s", msg);
}

static JSValue qjs_new_string(JSContext* ctx, const char* s) {
  if (!s) return JS_NewString(ctx, "");
  return JS_NewString(ctx, s);
}

static const char* qjs_to_cstr(JSContext* ctx, JSValueConst val, const char** holder) {
  *holder = JS_ToCString(ctx, val);
  return *holder;
}

static void qjs_free_cstr(JSContext* ctx, const char* str) {
  if (str) JS_FreeCString(ctx, str);
}

// ── QuickJS Wrapper: each extern "C" function gets a JS wrapper ──

// 1. nativeAppCreate — creates QGuiApplication, returns handle
static JSValue js_native_app_create(JSContext* ctx, JSValueConst, int, JSValueConst*) {
  void* app = qt_app_create(1, nullptr);
  if (!app) return qjs_throw(ctx, "Failed to create QGuiApplication");
  int id = handle_put(app);
  fprintf(stderr, "[quickjs] nativeAppCreate → handle %d, ptr=%p\n", id, app);
  return JS_NewInt32(ctx, id);
}

// 2. nativeEngineCreate — creates QQmlApplicationEngine, returns handle
static JSValue js_native_engine_create(JSContext* ctx, JSValueConst, int, JSValueConst*) {
  void* engine = qml_engine_create();
  if (!engine) return qjs_throw(ctx, "Failed to create QQmlApplicationEngine");
  int id = handle_put(engine);
  return JS_NewInt32(ctx, id);
}

// 3. nativeEngineLoad(engineId, qml, basePath, importPath?)
static JSValue js_native_engine_load(JSContext* ctx, JSValueConst, int argc, JSValueConst* argv) {
  if (argc < 3) return qjs_throw(ctx, "nativeEngineLoad: expected (engineId, qml, basePath, importPath?)");
  int engineId; JS_ToInt32(ctx, &engineId, argv[0]);
  void* engine = handle_get(engineId);
  if (!engine) return qjs_throw(ctx, "nativeEngineLoad: invalid engine handle");

  const char *qml_str, *base_path, *import_path = "";
  qjs_to_cstr(ctx, argv[1], &qml_str);
  qjs_to_cstr(ctx, argv[2], &base_path);
  if (argc >= 4 && !JS_IsUndefined(argv[3])) {
    qjs_to_cstr(ctx, argv[3], &import_path);
  }

  qml_engine_load_data(engine, qml_str, base_path, import_path);

  qjs_free_cstr(ctx, import_path);
  qjs_free_cstr(ctx, base_path);
  qjs_free_cstr(ctx, qml_str);
  return JS_UNDEFINED;
}

// 4. nativeEngineReload(engineId, qml, basePath, importPath?)
static JSValue js_native_engine_reload(JSContext* ctx, JSValueConst, int argc, JSValueConst* argv) {
  if (argc < 3) return qjs_throw(ctx, "nativeEngineReload: expected (engineId, qml, basePath, importPath?)");
  int engineId; JS_ToInt32(ctx, &engineId, argv[0]);
  void* engine = handle_get(engineId);
  if (!engine) return qjs_throw(ctx, "nativeEngineReload: invalid engine handle");

  const char *qml_str, *base_path, *import_path = "";
  qjs_to_cstr(ctx, argv[1], &qml_str);
  qjs_to_cstr(ctx, argv[2], &base_path);
  if (argc >= 4 && !JS_IsUndefined(argv[3])) {
    qjs_to_cstr(ctx, argv[3], &import_path);
  }

  qml_engine_close_all_windows(engine);
  qt_app_process_events();
  QThread::msleep(50);
  qml_engine_clear_cache(engine);
  qml_engine_load_data(engine, qml_str, base_path, import_path);

  qjs_free_cstr(ctx, import_path);
  qjs_free_cstr(ctx, base_path);
  qjs_free_cstr(ctx, qml_str);

  void* root = qml_engine_root_objects(engine);
  int id = root ? handle_put(root) : 0;
  return JS_NewInt32(ctx, id);
}

// 5. nativeEngineLoadShell(engineId, importPath?)
static JSValue js_native_engine_load_shell(JSContext* ctx, JSValueConst, int argc, JSValueConst* argv) {
  if (argc < 1) return qjs_throw(ctx, "nativeEngineLoadShell: expected (engineId, importPath?)");
  int engineId; JS_ToInt32(ctx, &engineId, argv[0]);
  void* engine = handle_get(engineId);
  if (!engine) return qjs_throw(ctx, "nativeEngineLoadShell: invalid engine handle");

  const char* import_path = "";
  if (argc >= 2 && !JS_IsUndefined(argv[1])) {
    qjs_to_cstr(ctx, argv[1], &import_path);
  }
  qml_engine_load_shell(engine, import_path);
  if (import_path[0]) qjs_free_cstr(ctx, import_path);
  return JS_UNDEFINED;
}

// 6. nativeEngineSetShellSource(engineId, qml)
static JSValue js_native_engine_set_shell_source(JSContext* ctx, JSValueConst, int argc, JSValueConst* argv) {
  if (argc < 2) return qjs_throw(ctx, "nativeEngineSetShellSource: expected (engineId, qml)");
  int engineId; JS_ToInt32(ctx, &engineId, argv[0]);
  void* engine = handle_get(engineId);
  if (!engine) return qjs_throw(ctx, "nativeEngineSetShellSource: invalid engine handle");

  const char* qml_str = nullptr;
  qjs_to_cstr(ctx, argv[1], &qml_str);
  qml_engine_set_shell_source(engine, qml_str);
  qjs_free_cstr(ctx, qml_str);
  return JS_UNDEFINED;
}

// 7. nativeEngineSetShellWindowProps(engineId, title?, width?, height?)
static JSValue js_native_engine_set_shell_window_props(JSContext* ctx, JSValueConst, int argc, JSValueConst* argv) {
  if (argc < 1) return qjs_throw(ctx, "nativeEngineSetShellWindowProps: expected (engineId, title?, width?, height?)");
  int engineId; JS_ToInt32(ctx, &engineId, argv[0]);
  void* engine = handle_get(engineId);
  if (!engine) return qjs_throw(ctx, "nativeEngineSetShellWindowProps: invalid engine handle");

  const char* title = nullptr;
  int width = 0, height = 0;

  if (argc >= 2 && JS_IsString(argv[1])) {
    qjs_to_cstr(ctx, argv[1], &title);
  }
  if (argc >= 3 && JS_IsNumber(argv[2])) {
    JS_ToInt32(ctx, &width, argv[2]);
  }
  if (argc >= 4 && JS_IsNumber(argv[3])) {
    JS_ToInt32(ctx, &height, argv[3]);
  }

  qml_engine_set_shell_window_props(engine, title ? title : "", width, height);
  if (title) qjs_free_cstr(ctx, title);
  return JS_UNDEFINED;
}

// 8. nativeEngineRootObject(engineId) → handle
static JSValue js_native_engine_root_object(JSContext* ctx, JSValueConst, int argc, JSValueConst* argv) {
  if (argc < 1) return qjs_throw(ctx, "nativeEngineRootObject: expected (engineId)");
  int engineId; JS_ToInt32(ctx, &engineId, argv[0]);
  void* engine = handle_get(engineId);
  if (!engine) return qjs_throw(ctx, "nativeEngineRootObject: invalid engine handle");

  void* root = qml_engine_root_objects(engine);
  if (!root) return JS_NewInt32(ctx, 0);
  int id = handle_put(root);
  return JS_NewInt32(ctx, id);
}

// 9. nativeObjectSetProperty(objId, name, value)
static JSValue js_native_object_set_property(JSContext* ctx, JSValueConst, int argc, JSValueConst* argv) {
  if (argc < 3) return JS_ThrowTypeError(ctx, "nativeObjectSetProperty(objId, name, value)");
  int objId; JS_ToInt32(ctx, &objId, argv[0]);
  void* obj = handle_get(objId);
  if (!obj) return qjs_throw(ctx, "Invalid object handle");
  const char *name = nullptr, *value = nullptr;
  qjs_to_cstr(ctx, argv[1], &name);
  qjs_to_cstr(ctx, argv[2], &value);
  qt_object_set_property(obj, name, value);
  qjs_free_cstr(ctx, value);
  qjs_free_cstr(ctx, name);
  return JS_UNDEFINED;
}

// 10. nativeObjectGetProperty(objId, name) → string
static JSValue js_native_object_get_property(JSContext* ctx, JSValueConst, int argc, JSValueConst* argv) {
  if (argc < 2) return JS_ThrowTypeError(ctx, "nativeObjectGetProperty(objId, name)");
  int objId; JS_ToInt32(ctx, &objId, argv[0]);
  void* obj = handle_get(objId);
  if (!obj) return qjs_throw(ctx, "Invalid object handle");
  const char* name = nullptr;
  qjs_to_cstr(ctx, argv[1], &name);
  const char* result = qt_object_get_property(obj, name);
  JSValue ret = qjs_new_string(ctx, result);
  qjs_free_cstr(ctx, name);
  return ret;
}

// 11. nativeObjectSetInt(objId, name, value)
static JSValue js_native_object_set_int(JSContext* ctx, JSValueConst, int argc, JSValueConst* argv) {
  if (argc < 3) return JS_ThrowTypeError(ctx, "nativeObjectSetInt(objId, name, value)");
  int objId, val; JS_ToInt32(ctx, &objId, argv[0]); JS_ToInt32(ctx, &val, argv[2]);
  void* obj = handle_get(objId);
  if (!obj) return qjs_throw(ctx, "Invalid object handle");
  const char* name = nullptr; qjs_to_cstr(ctx, argv[1], &name);
  qt_object_set_int_property(obj, name, val);
  qjs_free_cstr(ctx, name);
  return JS_UNDEFINED;
}

// 12. nativeObjectGetInt(objId, name) → int
static JSValue js_native_object_get_int(JSContext* ctx, JSValueConst, int argc, JSValueConst* argv) {
  if (argc < 2) return JS_ThrowTypeError(ctx, "nativeObjectGetInt(objId, name)");
  int objId; JS_ToInt32(ctx, &objId, argv[0]);
  void* obj = handle_get(objId);
  if (!obj) return qjs_throw(ctx, "Invalid object handle");
  const char* name = nullptr; qjs_to_cstr(ctx, argv[1], &name);
  int result = qt_object_get_int_property(obj, name);
  qjs_free_cstr(ctx, name);
  return JS_NewInt32(ctx, result);
}

// 13. nativeObjectSetBool(objId, name, value)
static JSValue js_native_object_set_bool(JSContext* ctx, JSValueConst, int argc, JSValueConst* argv) {
  if (argc < 3) return JS_ThrowTypeError(ctx, "nativeObjectSetBool(objId, name, value)");
  int objId, val; JS_ToInt32(ctx, &objId, argv[0]); val = JS_ToBool(ctx, argv[2]);
  void* obj = handle_get(objId);
  if (!obj) return qjs_throw(ctx, "Invalid object handle");
  const char* name = nullptr; qjs_to_cstr(ctx, argv[1], &name);
  qt_object_set_bool_property(obj, name, val);
  qjs_free_cstr(ctx, name);
  return JS_UNDEFINED;
}

// 14. nativeProcessEvents()
static JSValue js_native_process_events(JSContext*, JSValueConst, int, JSValueConst*) {
  qt_app_process_events();
  return JS_UNDEFINED;
}

// 15. nativeAppExec() → int
static JSValue js_native_app_exec(JSContext* ctx, JSValueConst, int argc, JSValueConst* argv) {
  void* app = nullptr;
  if (argc >= 1) {
    int appId; JS_ToInt32(ctx, &appId, argv[0]);
    app = handle_get(appId);
    if (!app) return qjs_throw(ctx, "nativeAppExec: invalid app handle");
  } else {
    app = handle_get(1); // fallback: first created app
  }
  int ret = qt_app_exec(app);
  return JS_NewInt32(ctx, ret);
}

// 16. nativeAppQuit()
static JSValue js_native_app_quit(JSContext* ctx, JSValueConst, int argc, JSValueConst* argv) {
  void* app = nullptr;
  if (argc >= 1) {
    int appId; JS_ToInt32(ctx, &appId, argv[0]);
    app = handle_get(appId);
  } else {
    app = handle_get(1);
  }
  if (app) qt_app_quit(app);
  return JS_UNDEFINED;
}

// 17. nativeEngineCreateProxy(engineId) → proxy handle
static JSValue js_native_engine_create_proxy(JSContext* ctx, JSValueConst, int, JSValueConst* argv) {
  void* proxy = mocha_object_create(0);
  if (!proxy) return qjs_throw(ctx, "Failed to create MochaPropertyMap proxy");
  int id = handle_put(proxy);
  return JS_NewInt32(ctx, id);
}

// 18. nativeProxySetValue(proxyId, name, value)
static JSValue js_native_proxy_set_value(JSContext* ctx, JSValueConst, int argc, JSValueConst* argv) {
  if (argc < 3) return JS_ThrowTypeError(ctx, "nativeProxySetValue(proxyId, name, value)");
  int proxyId; JS_ToInt32(ctx, &proxyId, argv[0]);
  void* proxy = handle_get(proxyId);
  if (!proxy) return qjs_throw(ctx, "Invalid proxy handle");
  const char *name = nullptr, *value = nullptr;
  qjs_to_cstr(ctx, argv[1], &name);
  qjs_to_cstr(ctx, argv[2], &value);
  mocha_object_set_value(proxy, name, value);
  qjs_free_cstr(ctx, value);
  qjs_free_cstr(ctx, name);
  return JS_UNDEFINED;
}

// 19. nativeProxySetInt(proxyId, name, value)
static JSValue js_native_proxy_set_int(JSContext* ctx, JSValueConst, int argc, JSValueConst* argv) {
  if (argc < 3) return JS_ThrowTypeError(ctx, "nativeProxySetInt(proxyId, name, value)");
  int proxyId, val; JS_ToInt32(ctx, &proxyId, argv[0]); JS_ToInt32(ctx, &val, argv[2]);
  void* proxy = handle_get(proxyId);
  if (!proxy) return qjs_throw(ctx, "Invalid proxy handle");
  const char* name = nullptr; qjs_to_cstr(ctx, argv[1], &name);
  mocha_object_set_int(proxy, name, val);
  qjs_free_cstr(ctx, name);
  return JS_UNDEFINED;
}

// 20. nativeProxySetBool(proxyId, name, value)
static JSValue js_native_proxy_set_bool(JSContext* ctx, JSValueConst, int argc, JSValueConst* argv) {
  if (argc < 3) return JS_ThrowTypeError(ctx, "nativeProxySetBool(proxyId, name, value)");
  int proxyId, val; JS_ToInt32(ctx, &proxyId, argv[0]); val = JS_ToBool(ctx, argv[2]);
  void* proxy = handle_get(proxyId);
  if (!proxy) return qjs_throw(ctx, "Invalid proxy handle");
  const char* name = nullptr; qjs_to_cstr(ctx, argv[1], &name);
  mocha_object_set_bool(proxy, name, val);
  qjs_free_cstr(ctx, name);
  return JS_UNDEFINED;
}

// 21. nativeProxyGetValue(proxyId, name) → string
static JSValue js_native_proxy_get_value(JSContext* ctx, JSValueConst, int argc, JSValueConst* argv) {
  if (argc < 2) return JS_ThrowTypeError(ctx, "nativeProxyGetValue(proxyId, name)");
  int proxyId; JS_ToInt32(ctx, &proxyId, argv[0]);
  void* proxy = handle_get(proxyId);
  if (!proxy) return qjs_throw(ctx, "Invalid proxy handle");
  const char* name = nullptr; qjs_to_cstr(ctx, argv[1], &name);
  const char* result = mocha_object_get_value(proxy, name);
  JSValue ret = qjs_new_string(ctx, result);
  qjs_free_cstr(ctx, name);
  return ret;
}

// 22. nativeProxyHasPendingCalls(proxyId) → bool
static JSValue js_native_proxy_has_pending_calls(JSContext* ctx, JSValueConst, int argc, JSValueConst* argv) {
  if (argc < 1) return JS_FALSE;
  int proxyId; JS_ToInt32(ctx, &proxyId, argv[0]);
  void* proxy = handle_get(proxyId);
  if (!proxy) return JS_FALSE;
  return JS_NewBool(ctx, mocha_object_has_pending_calls(proxy));
}

// 23. nativeProxyDrainPendingCalls(proxyId) → string[] (JSON array)
static JSValue js_native_proxy_drain_pending_calls(JSContext* ctx, JSValueConst, int argc, JSValueConst* argv) {
  if (argc < 1) return JS_NewArray(ctx);
  int proxyId; JS_ToInt32(ctx, &proxyId, argv[0]);
  void* proxy = handle_get(proxyId);
  if (!proxy) return JS_NewArray(ctx);

  JSValue arr = JS_NewArray(ctx);
  int idx = 0;
  while (true) {
    char buf[4096];
    int len = mocha_object_drain_pending_calls(proxy, buf, sizeof(buf));
    if (len <= 0) break;
    JS_SetPropertyUint32(ctx, arr, idx++, JS_NewStringLen(ctx, buf, len));
  }
  return arr;
}

// 24. nativeProxySetQobject(proxyId, name, qobjId)
static JSValue js_native_proxy_set_qobject(JSContext* ctx, JSValueConst, int argc, JSValueConst* argv) {
  if (argc < 3) return JS_ThrowTypeError(ctx, "nativeProxySetQobject(proxyId, name, qobjId)");
  int proxyId, qobjId; JS_ToInt32(ctx, &proxyId, argv[0]); JS_ToInt32(ctx, &qobjId, argv[2]);
  void* proxy = handle_get(proxyId);
  void* qobj = handle_get(qobjId);
  if (!proxy || !qobj) return qjs_throw(ctx, "Invalid handle");
  const char* name = nullptr; qjs_to_cstr(ctx, argv[1], &name);
  mocha_property_map_set_qobject(proxy, name, qobj);
  qjs_free_cstr(ctx, name);
  return JS_UNDEFINED;
}

// 25. nativeEngineSetContext(engineId, name, proxyId)
static JSValue js_native_engine_set_context(JSContext* ctx, JSValueConst, int argc, JSValueConst* argv) {
  if (argc < 3) return JS_ThrowTypeError(ctx, "nativeEngineSetContext(engineId, name, proxyId)");
  int engineId, proxyId; JS_ToInt32(ctx, &engineId, argv[0]); JS_ToInt32(ctx, &proxyId, argv[2]);
  void* engine = handle_get(engineId);
  void* proxy = handle_get(proxyId);
  if (!engine || !proxy) return qjs_throw(ctx, "Invalid handle");
  const char* name = nullptr; qjs_to_cstr(ctx, argv[1], &name);
  qml_engine_set_context_property(engine, name, proxy);
  qjs_free_cstr(ctx, name);
  return JS_UNDEFINED;
}

// 26. nativeCreateListModel() → model handle
static JSValue js_native_create_list_model(JSContext* ctx, JSValueConst, int, JSValueConst*) {
  void* model = mocha_list_model_create();
  if (!model) return qjs_throw(ctx, "Failed to create MochaListModel");
  int id = handle_put(model);
  return JS_NewInt32(ctx, id);
}

// 27. nativeDestroyListModel(modelId)
static JSValue js_native_destroy_list_model(JSContext* ctx, JSValueConst, int argc, JSValueConst* argv) {
  if (argc < 1) return JS_UNDEFINED;
  int modelId; JS_ToInt32(ctx, &modelId, argv[0]);
  void* model = handle_get(modelId);
  if (model) { mocha_list_model_destroy(model); handle_remove(modelId); }
  return JS_UNDEFINED;
}

// 28. nativeModelSetRows(modelId, json)
static JSValue js_native_model_set_rows(JSContext* ctx, JSValueConst, int argc, JSValueConst* argv) {
  if (argc < 2) return JS_ThrowTypeError(ctx, "nativeModelSetRows(modelId, json)");
  int modelId; JS_ToInt32(ctx, &modelId, argv[0]);
  void* model = handle_get(modelId);
  if (!model) return qjs_throw(ctx, "Invalid model handle");
  const char* json = nullptr; qjs_to_cstr(ctx, argv[1], &json);
  mocha_list_model_set_rows(model, json);
  qjs_free_cstr(ctx, json);
  return JS_UNDEFINED;
}

// 29. nativeModelClear(modelId)
static JSValue js_native_model_clear(JSContext* ctx, JSValueConst, int argc, JSValueConst* argv) {
  if (argc < 1) return JS_UNDEFINED;
  int modelId; JS_ToInt32(ctx, &modelId, argv[0]);
  void* model = handle_get(modelId);
  if (model) mocha_list_model_clear(model);
  return JS_UNDEFINED;
}

// 30. nativeFindChildByName(parentId, name) → handle
static JSValue js_native_find_child_by_name(JSContext* ctx, JSValueConst, int argc, JSValueConst* argv) {
  if (argc < 2) return JS_ThrowTypeError(ctx, "nativeFindChildByName(parentId, name)");
  int parentId; JS_ToInt32(ctx, &parentId, argv[0]);
  void* parent = handle_get(parentId);
  if (!parent) return JS_NewInt32(ctx, 0);
  const char* name = nullptr; qjs_to_cstr(ctx, argv[1], &name);
  void* child = qml_find_child_by_name(parent, name);
  qjs_free_cstr(ctx, name);
  if (!child) return JS_NewInt32(ctx, 0);
  int id = handle_put(child);
  return JS_NewInt32(ctx, id);
}

// 31. qmlRegisterAppObjects(engineId)
static JSValue js_qml_register_app_objects(JSContext* ctx, JSValueConst, int argc, JSValueConst* argv) {
  if (argc < 1) return JS_UNDEFINED;
  int engineId; JS_ToInt32(ctx, &engineId, argv[0]);
  void* engine = handle_get(engineId);
  if (engine) native_qml_register_app_objects(engine);
  return JS_UNDEFINED;
}

// 32. qmlListRootObjects() → number[]
static JSValue js_qml_list_root_objects(JSContext* ctx, JSValueConst, int, JSValueConst*) {
  int ids[1024];
  int count = native_qml_list_root_objects(ids, 1024);
  JSValue arr = JS_NewArray(ctx);
  for (int i = 0; i < count; i++) {
    JS_SetPropertyUint32(ctx, arr, i, JS_NewInt32(ctx, ids[i]));
  }
  return arr;
}

// 33. qmlListChildren(objId) → number[]
static JSValue js_qml_list_children(JSContext* ctx, JSValueConst, int argc, JSValueConst* argv) {
  if (argc < 1) return JS_NewArray(ctx);
  int objId; JS_ToInt32(ctx, &objId, argv[0]);
  int ids[1024];
  int count = native_qml_list_children(objId, ids, 1024);
  JSValue arr = JS_NewArray(ctx);
  for (int i = 0; i < count; i++) {
    JS_SetPropertyUint32(ctx, arr, i, JS_NewInt32(ctx, ids[i]));
  }
  return arr;
}

// 34. qmlGetProperty(objId, name) → string
static JSValue js_qml_get_property(JSContext* ctx, JSValueConst, int argc, JSValueConst* argv) {
  if (argc < 2) return qjs_new_string(ctx, "");
  int objId; JS_ToInt32(ctx, &objId, argv[0]);
  const char* name = nullptr; qjs_to_cstr(ctx, argv[1], &name);
  const char* result = native_qml_get_property(objId, name);
  JSValue ret = qjs_new_string(ctx, result);
  qjs_free_cstr(ctx, name);
  return ret;
}

// 35. qmlGetTypeName(objId) → string
static JSValue js_qml_get_type_name(JSContext* ctx, JSValueConst, int argc, JSValueConst* argv) {
  if (argc < 1) return qjs_new_string(ctx, "");
  int objId; JS_ToInt32(ctx, &objId, argv[0]);
  return qjs_new_string(ctx, native_qml_get_type_name(objId));
}

// 36. qmlGetObjectName(objId) → string
static JSValue js_qml_get_object_name(JSContext* ctx, JSValueConst, int argc, JSValueConst* argv) {
  if (argc < 1) return qjs_new_string(ctx, "");
  int objId; JS_ToInt32(ctx, &objId, argv[0]);
  return qjs_new_string(ctx, native_qml_get_object_name(objId));
}

// 37. qmlSetProperty(objId, name, value)
static JSValue js_qml_set_property(JSContext* ctx, JSValueConst, int argc, JSValueConst* argv) {
  if (argc < 3) return JS_ThrowTypeError(ctx, "qmlSetProperty(objId, name, value)");
  int objId; JS_ToInt32(ctx, &objId, argv[0]);
  const char *name = nullptr, *value = nullptr;
  qjs_to_cstr(ctx, argv[1], &name);
  qjs_to_cstr(ctx, argv[2], &value);
  native_qml_set_property(objId, name, value);
  qjs_free_cstr(ctx, value);
  qjs_free_cstr(ctx, name);
  return JS_UNDEFINED;
}

// 38. qmlGetAllProperties(objId) → JSON string
static JSValue js_qml_get_all_properties(JSContext* ctx, JSValueConst, int argc, JSValueConst* argv) {
  if (argc < 1) return qjs_new_string(ctx, "[]");
  int objId; JS_ToInt32(ctx, &objId, argv[0]);
  char buf[65536];
  native_qml_get_all_properties(objId, buf, sizeof(buf));
  return qjs_new_string(ctx, buf);
}

// 39. nativeWindowSetDarkTitleBar(objId, dark)
static JSValue js_native_window_set_dark_title_bar(JSContext* ctx, JSValueConst, int argc, JSValueConst* argv) {
  if (argc < 2) return JS_UNDEFINED;
  int objId, dark; JS_ToInt32(ctx, &objId, argv[0]); dark = JS_ToBool(ctx, argv[1]);
  void* obj = handle_get(objId);
  if (obj) mocha_window_set_dark_title_bar(obj, dark);
  return JS_UNDEFINED;
}

// 40. nativeWindowStartSystemMove(objId)
static JSValue js_native_window_start_system_move(JSContext* ctx, JSValueConst, int argc, JSValueConst* argv) {
  if (argc < 1) return JS_UNDEFINED;
  int objId; JS_ToInt32(ctx, &objId, argv[0]);
  void* obj = handle_get(objId);
  if (obj) mocha_window_start_system_move(obj);
  return JS_UNDEFINED;
}

// ── Additional host functions for polyfills ──

// __mocha_print(msg) — outputs to stderr
static JSValue js_mocha_print(JSContext* ctx, JSValueConst, int argc, JSValueConst* argv) {
  if (argc >= 1) {
    const char* msg = nullptr; qjs_to_cstr(ctx, argv[0], &msg);
    if (msg) { fprintf(stderr, "%s", msg); fflush(stderr); qjs_free_cstr(ctx, msg); }
  }
  return JS_UNDEFINED;
}

// __mocha_exit(code) — exits application
static JSValue js_mocha_exit(JSContext*, JSValueConst, int argc, JSValueConst* argv) {
  int code = 0;
  if (argc >= 1) JS_ToInt32(g_jsCtx, &code, argv[0]);
  QCoreApplication::quit();
  return JS_UNDEFINED;
}

// __mocha_cwd — returns working directory
static JSValue js_mocha_cwd_get(JSContext* ctx, JSValueConst, int, JSValueConst*) {
  return JS_NewString(ctx, getenv("PWD") ? getenv("PWD") : "/");
}

// ── Register all host functions on the global object ──

static void register_host_functions(JSContext* ctx) {
  #define REG(name, fn, nargs) JS_SetPropertyStr(ctx, JS_GetGlobalObject(ctx), "__mocha_" #name, JS_NewCFunction(ctx, fn, "__mocha_" #name, nargs))

  REG(nativeAppCreate,                  js_native_app_create,                  0);
  REG(nativeEngineCreate,               js_native_engine_create,               0);
  REG(nativeEngineLoad,                 js_native_engine_load,                 4);
  REG(nativeEngineReload,               js_native_engine_reload,               4);
  REG(nativeEngineLoadShell,            js_native_engine_load_shell,           2);
  REG(nativeEngineSetShellSource,       js_native_engine_set_shell_source,     2);
  REG(nativeEngineSetShellWindowProps,  js_native_engine_set_shell_window_props, 4);
  REG(nativeEngineRootObject,           js_native_engine_root_object,          1);
  REG(nativeObjectSetProperty,          js_native_object_set_property,         3);
  REG(nativeObjectGetProperty,          js_native_object_get_property,         2);
  REG(nativeObjectSetInt,               js_native_object_set_int,              3);
  REG(nativeObjectGetInt,               js_native_object_get_int,              2);
  REG(nativeObjectSetBool,              js_native_object_set_bool,             3);
  REG(nativeProcessEvents,              js_native_process_events,              0);
  REG(nativeAppExec,                    js_native_app_exec,                    1);
  REG(nativeAppQuit,                    js_native_app_quit,                    1);
  REG(nativeEngineCreateProxy,          js_native_engine_create_proxy,         0);
  REG(nativeProxySetValue,              js_native_proxy_set_value,             3);
  REG(nativeProxySetInt,                js_native_proxy_set_int,               3);
  REG(nativeProxySetBool,               js_native_proxy_set_bool,              3);
  REG(nativeProxyGetValue,              js_native_proxy_get_value,             2);
  REG(nativeProxyHasPendingCalls,       js_native_proxy_has_pending_calls,     1);
  REG(nativeProxyDrainPendingCalls,     js_native_proxy_drain_pending_calls,   1);
  REG(nativeProxySetQobject,            js_native_proxy_set_qobject,           3);
  REG(nativeEngineSetContext,           js_native_engine_set_context,          3);
  REG(nativeCreateListModel,            js_native_create_list_model,           0);
  REG(nativeDestroyListModel,           js_native_destroy_list_model,          1);
  REG(nativeModelSetRows,               js_native_model_set_rows,              2);
  REG(nativeModelClear,                 js_native_model_clear,                 1);
  REG(nativeFindChildByName,            js_native_find_child_by_name,          2);
  REG(qmlRegisterAppObjects,            js_qml_register_app_objects,           1);
  REG(qmlListRootObjects,               js_qml_list_root_objects,              0);
  REG(qmlListChildren,                  js_qml_list_children,                  1);
  REG(qmlGetProperty,                   js_qml_get_property,                   2);
  REG(qmlGetTypeName,                   js_qml_get_type_name,                  1);
  REG(qmlGetObjectName,                 js_qml_get_object_name,                1);
  REG(qmlSetProperty,                   js_qml_set_property,                   3);
  REG(qmlGetAllProperties,              js_qml_get_all_properties,             1);
  REG(nativeWindowSetDarkTitleBar,      js_native_window_set_dark_title_bar,   2);
  REG(nativeWindowStartSystemMove,      js_native_window_start_system_move,    1);

  // Polyfill support
  JS_SetPropertyStr(ctx, JS_GetGlobalObject(ctx), "__mocha_print",
    JS_NewCFunction(ctx, js_mocha_print, "__mocha_print", 1));
  JS_SetPropertyStr(ctx, JS_GetGlobalObject(ctx), "__mocha_exit",
    JS_NewCFunction(ctx, js_mocha_exit, "__mocha_exit", 1));
  JS_SetPropertyStr(ctx, JS_GetGlobalObject(ctx), "__mocha_cwd",
    JS_NewCFunction(ctx, js_mocha_cwd_get, "__mocha_cwd", 0));
}

// ── JS evaluation helper ──

static JSValue eval_file_or_string(JSContext* ctx, const char* code, const char* filename) {
  return JS_Eval(ctx, code, strlen(code), filename, JS_EVAL_TYPE_GLOBAL);
}

static int load_js_file(JSContext* ctx, const char* path, const char* label) {
  FILE* f = fopen(path, "rb");
  if (!f) {
    fprintf(stderr, "[mocha-quickjs] Could not open %s: %s\n", label, path);
    return -1;
  }
  fseek(f, 0, SEEK_END);
  long size = ftell(f);
  fseek(f, 0, SEEK_SET);
  char* code = (char*)malloc(size + 1);
  if (!code) { fclose(f); return -1; }
  fread(code, 1, size, f);
  code[size] = '\0';
  fclose(f);

  fprintf(stderr, "[mocha-quickjs] Loading %s from %s (%ld bytes)...\n", label, path, size);
  JSValue result = eval_file_or_string(ctx, code, path);
  free(code);

  if (JS_IsException(result)) {
    JSValue exc = JS_GetException(ctx);
    const char* excStr = JS_ToCString(ctx, exc);
    fprintf(stderr, "[mocha-quickjs] %s error: %s\n", label, excStr ? excStr : "unknown");
    if (excStr) JS_FreeCString(ctx, excStr);
    JS_FreeValue(ctx, exc);
    JS_FreeValue(ctx, result);
    return -1;
  }
  JS_FreeValue(ctx, result);
  return 0;
}

// ── Main entry point ──

int main(int argc, char** argv) {
  fprintf(stderr, "[mocha-quickjs] Starting Mocha Framework with QuickJS runtime...\n");

  // 1. Create QGuiApplication (must be first for Qt)
  void* app = qt_app_create(argc, argv);
  if (!app) {
    fprintf(stderr, "[mocha-quickjs] FATAL: Failed to create QGuiApplication\n");
    return 1;
  }
  handle_put(app);
  fprintf(stderr, "[mocha-quickjs] QGuiApplication created (handle 1)\n");

  // 2. Initialize QuickJS
  JSRuntime* rt = JS_NewRuntime();
  if (!rt) {
    fprintf(stderr, "[mocha-quickjs] FATAL: Failed to create JSRuntime\n");
    return 1;
  }
  JSContext* ctx = JS_NewContext(rt);
  if (!ctx) {
    fprintf(stderr, "[mocha-quickjs] FATAL: Failed to create JSContext\n");
    JS_FreeRuntime(rt);
    return 1;
  }
  g_jsCtx = ctx;
  fprintf(stderr, "[mocha-quickjs] QuickJS runtime initialized\n");

  // 3. Register host functions as globals
  register_host_functions(ctx);

  // 4. Parse CLI args
  const char* polyfillsPath = nullptr;
  const char* bundlePath = nullptr;
  const char* evalCode = nullptr;
  for (int i = 1; i < argc; i++) {
    if (strcmp(argv[i], "--polyfills") == 0 && i + 1 < argc) {
      polyfillsPath = argv[++i];
    } else if (strcmp(argv[i], "--bundle") == 0 && i + 1 < argc) {
      bundlePath = argv[++i];
    } else if (strcmp(argv[i], "--eval") == 0 && i + 1 < argc) {
      evalCode = argv[++i];
    }
  }

  // 5. Load polyfills (must be before eval/bundle)
  // Try default polyfills path relative to binary
  if (!polyfillsPath) {
    static const char* candidates[] = {
      "mocha_polyfills.js",
      "packages/bridge-quickjs/mocha_polyfills.js",
      "../mocha_polyfills.js",
      nullptr
    };
    for (int i = 0; candidates[i]; i++) {
      FILE* test = fopen(candidates[i], "r");
      if (test) { fclose(test); polyfillsPath = candidates[i]; break; }
    }
  }
  if (polyfillsPath) {
    load_js_file(ctx, polyfillsPath, "polyfills");
  } else {
    fprintf(stderr, "[mocha-quickjs] WARNING: mocha_polyfills.js not found\n");
  }

  // 6. Load/eval JS code
  if (evalCode) {
    fprintf(stderr, "[mocha-quickjs] Evaluating: %s\n", evalCode);
    JSValue result = eval_file_or_string(ctx, evalCode, "<eval>");
    if (JS_IsException(result)) {
      JSValue exc = JS_GetException(ctx);
      const char* excStr = JS_ToCString(ctx, exc);
      fprintf(stderr, "[mocha-quickjs] Eval error: %s\n", excStr ? excStr : "unknown");
      if (excStr) JS_FreeCString(ctx, excStr);
      JS_FreeValue(ctx, exc);
    }
    JS_FreeValue(ctx, result);
  }

  #ifdef MOCHA_BUNDLE
  if (!bundlePath) {
    fprintf(stderr, "[mocha-quickjs] Loading embedded bundle (%zu bytes)...\n", sizeof(MOCHA_BUNDLE));
    JSValue bundleResult = eval_file_or_string(ctx, MOCHA_BUNDLE, "bundle.js");
    if (JS_IsException(bundleResult)) {
      JSValue exc = JS_GetException(ctx);
      const char* excStr = JS_ToCString(ctx, exc);
      if (excStr) JS_FreeCString(ctx, excStr);
      JS_FreeValue(ctx, exc);
    }
    JS_FreeValue(ctx, bundleResult);
  }
  #endif

  if (bundlePath) {
    load_js_file(ctx, bundlePath, "bundle");
  }

  // 7. Event loop via QTimer (replaces Node.js setTimeout(8))
  QTimer* tickTimer = new QTimer();
  tickTimer->setObjectName("mochaEventLoop");
  QObject::connect(tickTimer, &QTimer::timeout, []() {
    // Process Qt events
    QCoreApplication::processEvents();

    // Flush microtasks (queueMicrotask polyfill)
    if (g_jsCtx) {
      // Drain JS microtasks
      JSContext* ctx = g_jsCtx;
      // queueMicrotask polyfill — calls __mochaFlushMicrotasks
      JSValue global = JS_GetGlobalObject(ctx);
      JSValue flushFn = JS_GetPropertyStr(ctx, global, "__mochaFlushMicrotasks");
      if (JS_IsFunction(ctx, flushFn)) {
        JSValue ret = JS_Call(ctx, flushFn, global, 0, nullptr);
        if (JS_IsException(ret)) {
          JSValue exc = JS_GetException(ctx);
          const char* excStr = JS_ToCString(ctx, exc);
          if (excStr) { fprintf(stderr, "[mocha-quickjs] Microtask error: %s\n", excStr); JS_FreeCString(ctx, excStr); }
          JS_FreeValue(ctx, exc);
        }
        JS_FreeValue(ctx, ret);
      }
      JS_FreeValue(ctx, flushFn);

      // Drain timers (setTimeout polyfill)
      JSValue drainTimersFn = JS_GetPropertyStr(ctx, global, "__mochaDrainTimers");
      if (JS_IsFunction(ctx, drainTimersFn)) {
        JSValue ret = JS_Call(ctx, drainTimersFn, global, 0, nullptr);
        JS_FreeValue(ctx, ret);
      }
      JS_FreeValue(ctx, drainTimersFn);
      JS_FreeValue(ctx, global);

      // QuickJS GC hint — run periodically
      JS_RunGC(JS_GetRuntime(ctx));
    }
  });

  fprintf(stderr, "[mocha-quickjs] Starting event loop (QTimer, 8ms interval)...\n");
  tickTimer->start(8);

  // 8. Run Qt event loop (blocking)
  int exitCode = qt_app_exec(app);

  // 9. Cleanup
  fprintf(stderr, "[mocha-quickjs] Event loop exited (code %d), cleaning up...\n", exitCode);
  delete tickTimer;
  JS_FreeContext(ctx);
  JS_FreeRuntime(rt);
  qt_app_destroy(app);

  return exitCode;
}
