extern crate napi_build;

use std::process::Command;

fn main() {
    napi_build::setup();

    // Get all Qt includes
    let qt_includes = pkg_config("Qt6Core Qt6Gui Qt6Qml Qt6Quick", "--cflags-only-I");
    let qt_libs = pkg_config("Qt6Core Qt6Gui Qt6Qml Qt6Quick", "--libs");

    cc::Build::new()
        .cpp(true)
        .file("src/qt_bridge.cpp")
        .flag("-std=c++17")
        .flag("-fPIC")
        .includes(&qt_include_dirs(&qt_includes))
        .compile("qt_bridge");

    // Pass Qt libs to the linker
    for lib in qt_libs.split_whitespace() {
        if lib.starts_with("-l") {
            println!("cargo:rustc-link-lib={}", &lib[2..]);
        } else if lib.starts_with("-L") {
            println!("cargo:rustc-link-search=native={}", &lib[2..]);
        }
    }
}

fn pkg_config(packages: &str, flags: &str) -> String {
    let output = Command::new("pkg-config")
        .args(flags.split_whitespace())
        .args(packages.split_whitespace())
        .output()
        .expect("pkg-config failed - is Qt6 installed?");
    String::from_utf8_lossy(&output.stdout).trim().to_string()
}

fn qt_include_dirs(flags: &str) -> Vec<String> {
    flags
        .split_whitespace()
        .filter_map(|f| {
            if f.starts_with("-I") {
                Some(f[2..].to_string())
            } else {
                None
            }
        })
        .collect()
}
