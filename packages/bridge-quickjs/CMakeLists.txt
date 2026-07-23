cmake_minimum_required(VERSION 3.22)
project(mocha-quickjs LANGUAGES C CXX)

set(CMAKE_C_STANDARD 17)
set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

# ── QuickJS static library ──
set(QUICKJS_DIR "${CMAKE_CURRENT_SOURCE_DIR}/quickjs")
set(QUICKJS_INCLUDE "${CMAKE_CURRENT_SOURCE_DIR}/quickjs")
set(QUICKJS_LIB "${QUICKJS_DIR}/libquickjs.a")

if(NOT EXISTS "${QUICKJS_LIB}")
  message(FATAL_ERROR "libquickjs.a not found. Run: bash scripts/build-quickjs.sh")
endif()

# ── Qt6 ──
find_package(Qt6 REQUIRED COMPONENTS Core Gui Qml Quick)

set(MOCHA_SRC_DIR "${CMAKE_CURRENT_SOURCE_DIR}/../bridge-qt/src")

# ── Manual MOC (same approach as build.rs) ──
set(QT_BRIDGE_MOC "${MOCHA_SRC_DIR}/qt_bridge.moc")
add_custom_command(
  OUTPUT "${QT_BRIDGE_MOC}"
  COMMAND ${Qt6Core_MOC_EXECUTABLE}
    -I "${MOCHA_SRC_DIR}"
    $<TARGET_PROPERTY:Qt6::Core,INTERFACE_INCLUDE_DIRECTORIES>
    $<TARGET_PROPERTY:Qt6::Gui,INTERFACE_INCLUDE_DIRECTORIES>
    $<TARGET_PROPERTY:Qt6::Qml,INTERFACE_INCLUDE_DIRECTORIES>
    $<TARGET_PROPERTY:Qt6::Quick,INTERFACE_INCLUDE_DIRECTORIES>
    -o "${QT_BRIDGE_MOC}"
    "${MOCHA_SRC_DIR}/qt_bridge.cpp"
  DEPENDS "${MOCHA_SRC_DIR}/qt_bridge.cpp"
  COMMENT "Running moc on qt_bridge.cpp"
)

set(MOCHA_LIST_MOC "${MOCHA_SRC_DIR}/mocha_list_model.moc")
add_custom_command(
  OUTPUT "${MOCHA_LIST_MOC}"
  COMMAND ${Qt6Core_MOC_EXECUTABLE}
    -I "${MOCHA_SRC_DIR}"
    $<TARGET_PROPERTY:Qt6::Core,INTERFACE_INCLUDE_DIRECTORIES>
    $<TARGET_PROPERTY:Qt6::Gui,INTERFACE_INCLUDE_DIRECTORIES>
    $<TARGET_PROPERTY:Qt6::Qml,INTERFACE_INCLUDE_DIRECTORIES>
    $<TARGET_PROPERTY:Qt6::Quick,INTERFACE_INCLUDE_DIRECTORIES>
    -o "${MOCHA_LIST_MOC}"
    "${MOCHA_SRC_DIR}/mocha_list_model.h"
  DEPENDS "${MOCHA_SRC_DIR}/mocha_list_model.h"
  COMMENT "Running moc on mocha_list_model.h"
)

# ── Sources ──
set(SOURCES
  "${CMAKE_CURRENT_SOURCE_DIR}/src/quickjs_glue.cpp"
  "${MOCHA_SRC_DIR}/qt_bridge.cpp"
  "${MOCHA_SRC_DIR}/mocha_list_model.cpp"
  "${QT_BRIDGE_MOC}"
  "${MOCHA_LIST_MOC}"
)

# ── Executable ──
add_executable(mocha-quickjs ${SOURCES})

target_include_directories(mocha-quickjs PRIVATE
  "${CMAKE_CURRENT_SOURCE_DIR}/quickjs"
  "${MOCHA_SRC_DIR}"
  ${Qt6Core_INCLUDE_DIRS}
  ${Qt6Gui_INCLUDE_DIRS}
  ${Qt6Qml_INCLUDE_DIRS}
  ${Qt6Quick_INCLUDE_DIRS}
)

target_link_libraries(mocha-quickjs PRIVATE
  "${QUICKJS_LIB}"
  Qt6::Core
  Qt6::Gui
  Qt6::Qml
  Qt6::Quick
)

# Platform-specific
if(APPLE)
  target_link_libraries(mocha-quickjs PRIVATE "-framework Cocoa" "-framework Carbon")
endif()
if(WIN32)
  target_link_libraries(mocha-quickjs PRIVATE dwmapi user32 gdi32)
endif()
if(UNIX AND NOT APPLE)
  target_link_libraries(mocha-quickjs PRIVATE pthread dl m)
endif()

# Embedded bundle (optional)
if(DEFINED MOCHA_BUNDLE_FILE)
  file(READ "${MOCHA_BUNDLE_FILE}" MOCHA_BUNDLE_CONTENT)
  string(REPLACE "\"" "\\\"" MOCHA_BUNDLE_CONTENT "${MOCHA_BUNDLE_CONTENT}")
  string(REPLACE "\n" "\\n" MOCHA_BUNDLE_CONTENT "${MOCHA_BUNDLE_CONTENT}")
  target_compile_definitions(mocha-quickjs PRIVATE "MOCHA_BUNDLE=\"${MOCHA_BUNDLE_CONTENT}\"")
endif()

message(STATUS "mocha-quickjs: Qt6 at ${Qt6_DIR}")
message(STATUS "mocha-quickjs: QuickJS lib at ${QUICKJS_LIB}")
message(STATUS "mocha-quickjs: MOC output → ${MOCHA_SRC_DIR}")
