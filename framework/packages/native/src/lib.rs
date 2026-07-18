use napi::{Error, Result, Status};
use napi_derive::napi;
use std::collections::HashMap;
use std::ffi::{c_char, CStr, CString};
use std::os::raw::c_void;
use std::sync::{LazyLock, Mutex};

extern "C" {
    fn qt_app_create(argc: i32, argv: *const *const c_char) -> *mut c_void;
    fn qt_app_destroy(app: *mut c_void);
    fn qml_engine_create() -> *mut c_void;
    fn qml_engine_destroy(engine: *mut c_void);
    fn qml_engine_load_data(engine: *mut c_void, qml_data: *const c_char, base_path: *const c_char, import_path: *const c_char);
    fn qml_engine_root_objects(engine: *mut c_void) -> *mut c_void;
    fn qt_object_get_property(obj: *mut c_void, name: *const c_char) -> *const c_char;
    fn qt_object_set_property(obj: *mut c_void, name: *const c_char, value: *const c_char);
    fn qt_object_get_int_property(obj: *mut c_void, name: *const c_char) -> i32;
    fn qt_object_set_int_property(obj: *mut c_void, name: *const c_char, value: i32);
    fn qt_object_set_bool_property(obj: *mut c_void, name: *const c_char, value: i32);
    fn qt_app_process_events();
    fn qt_app_exec(app: *mut c_void) -> i32;
    fn qt_app_quit(app: *mut c_void);
}

struct NativeState {
    next_id: u32,
    app: *mut c_void,
    objects: HashMap<u32, *mut c_void>,
}

// SAFETY: All Qt objects are only accessed from the main thread (Node.js event loop).
// The Mutex is used for borrow-checking, not for actual multi-threading.
unsafe impl Send for NativeState {}
unsafe impl Sync for NativeState {}

impl NativeState {
    fn new() -> Self {
        NativeState {
            next_id: 1,
            app: std::ptr::null_mut(),
            objects: HashMap::new(),
        }
    }

    fn alloc_id(&mut self, ptr: *mut c_void) -> u32 {
        let id = self.next_id;
        self.next_id += 1;
        self.objects.insert(id, ptr);
        id
    }

    fn get_ptr(&self, id: u32) -> Option<*mut c_void> {
        self.objects.get(&id).copied()
    }
}

// LazyLock provides Sync automatically for the Mutex
static STATE: LazyLock<Mutex<NativeState>> = LazyLock::new(|| Mutex::new(NativeState {
    next_id: 1,
    app: std::ptr::null_mut(),
    objects: HashMap::new(),
}));

#[napi]
pub fn native_app_create() -> Result<()> {
    let c_name = CString::new("mocha-native").unwrap();
    let argv: [*const c_char; 1] = [c_name.as_ptr()];

    unsafe {
        let app = qt_app_create(1, argv.as_ptr());
        if app.is_null() {
            return Err(Error::new(Status::GenericFailure, "Failed to create QApplication"));
        }
        let mut state = STATE.lock().map_err(|e| Error::from_reason(e.to_string()))?;
        state.app = app;
    }
    Ok(())
}

#[napi]
pub fn native_engine_create() -> Result<u32> {
    unsafe {
        let engine = qml_engine_create();
        if engine.is_null() {
            return Err(Error::new(Status::GenericFailure, "Failed to create QQmlApplicationEngine"));
        }
        let mut state = STATE.lock().map_err(|e| Error::from_reason(e.to_string()))?;
        Ok(state.alloc_id(engine))
    }
}

#[napi]
pub fn native_engine_load(engine_id: u32, qml_data: String, base_path: String, import_path: Option<String>) -> Result<()> {
    let c_qml = CString::new(qml_data).map_err(|e| Error::from_reason(e.to_string()))?;
    let c_base = CString::new(base_path).map_err(|e| Error::from_reason(e.to_string()))?;
    let import_path_str = import_path.unwrap_or_default();
    let c_import = CString::new(import_path_str.clone()).map_err(|e| Error::from_reason(e.to_string()))?;

    let state = STATE.lock().map_err(|e| Error::from_reason(e.to_string()))?;
    let engine = state.get_ptr(engine_id)
        .ok_or_else(|| Error::new(Status::InvalidArg, "Invalid engine handle"))?;

    unsafe {
        qml_engine_load_data(engine, c_qml.as_ptr(), c_base.as_ptr(), c_import.as_ptr());
    }
    Ok(())
}

#[napi]
pub fn native_engine_root_object(engine_id: u32) -> Result<u32> {
    let mut state = STATE.lock().map_err(|e| Error::from_reason(e.to_string()))?;
    let engine = state.get_ptr(engine_id)
        .ok_or_else(|| Error::new(Status::InvalidArg, "Invalid engine handle"))?;

    unsafe {
        let obj = qml_engine_root_objects(engine);
        if obj.is_null() {
            return Err(Error::new(Status::GenericFailure, "QML failed to load or no root object"));
        }
        Ok(state.alloc_id(obj))
    }
}

#[napi]
pub fn native_object_set_property(obj_id: u32, name: String, value: String) -> Result<()> {
    let c_name = CString::new(name).map_err(|e| Error::from_reason(e.to_string()))?;
    let c_value = CString::new(value).map_err(|e| Error::from_reason(e.to_string()))?;
    let state = STATE.lock().map_err(|e| Error::from_reason(e.to_string()))?;
    let obj = state.get_ptr(obj_id)
        .ok_or_else(|| Error::new(Status::InvalidArg, "Invalid object handle"))?;
    unsafe {
        qt_object_set_property(obj, c_name.as_ptr(), c_value.as_ptr());
    }
    Ok(())
}

#[napi]
pub fn native_object_get_property(obj_id: u32, name: String) -> Result<String> {
    let c_name = CString::new(name).map_err(|e| Error::from_reason(e.to_string()))?;
    let state = STATE.lock().map_err(|e| Error::from_reason(e.to_string()))?;
    let obj = state.get_ptr(obj_id)
        .ok_or_else(|| Error::new(Status::InvalidArg, "Invalid object handle"))?;
    unsafe {
        let result = qt_object_get_property(obj, c_name.as_ptr());
        let c_str = CStr::from_ptr(result);
        Ok(c_str.to_string_lossy().into_owned())
    }
}

#[napi]
pub fn native_object_set_int(obj_id: u32, name: String, value: i32) -> Result<()> {
    let c_name = CString::new(name).map_err(|e| Error::from_reason(e.to_string()))?;
    let state = STATE.lock().map_err(|e| Error::from_reason(e.to_string()))?;
    let obj = state.get_ptr(obj_id)
        .ok_or_else(|| Error::new(Status::InvalidArg, "Invalid object handle"))?;
    unsafe {
        qt_object_set_int_property(obj, c_name.as_ptr(), value);
    }
    Ok(())
}

#[napi]
pub fn native_object_get_int(obj_id: u32, name: String) -> Result<i32> {
    let c_name = CString::new(name).map_err(|e| Error::from_reason(e.to_string()))?;
    let state = STATE.lock().map_err(|e| Error::from_reason(e.to_string()))?;
    let obj = state.get_ptr(obj_id)
        .ok_or_else(|| Error::new(Status::InvalidArg, "Invalid object handle"))?;
    unsafe {
        Ok(qt_object_get_int_property(obj, c_name.as_ptr()))
    }
}

#[napi]
pub fn native_object_set_bool(obj_id: u32, name: String, value: bool) -> Result<()> {
    let c_name = CString::new(name).map_err(|e| Error::from_reason(e.to_string()))?;
    let state = STATE.lock().map_err(|e| Error::from_reason(e.to_string()))?;
    let obj = state.get_ptr(obj_id)
        .ok_or_else(|| Error::new(Status::InvalidArg, "Invalid object handle"))?;
    unsafe {
        qt_object_set_bool_property(obj, c_name.as_ptr(), if value { 1 } else { 0 });
    }
    Ok(())
}

#[napi]
pub fn native_process_events() -> Result<()> {
    unsafe { qt_app_process_events(); }
    Ok(())
}

#[napi]
pub fn native_app_exec() -> Result<i32> {
    let state = STATE.lock().map_err(|e| Error::from_reason(e.to_string()))?;
    let app = state.app;
    drop(state);
    if app.is_null() {
        return Err(Error::new(Status::GenericFailure, "QApplication not created"));
    }
    unsafe { Ok(qt_app_exec(app)) }
}

#[napi]
pub fn native_app_quit() -> Result<()> {
    let state = STATE.lock().map_err(|e| Error::from_reason(e.to_string()))?;
    let app = state.app;
    if !app.is_null() {
        unsafe { qt_app_quit(app); }
    }
    Ok(())
}
