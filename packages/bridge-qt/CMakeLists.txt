cmake_minimum_required(VERSION 3.16)
project(mocha-qt-bridge VERSION 0.1.0 LANGUAGES CXX)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)
set(CMAKE_AUTOMOC ON)

find_package(Qt6 REQUIRED COMPONENTS Core Gui Qml Quick)

file(GLOB BRIDGE_SOURCES src/*.cpp)

add_library(mocha_qt STATIC ${BRIDGE_SOURCES})

target_include_directories(mocha_qt
  PUBLIC
    ${CMAKE_CURRENT_SOURCE_DIR}/src
    ${CMAKE_CURRENT_BINARY_DIR}  # for generated moc files
)

target_link_libraries(mocha_qt
  PUBLIC
    Qt6::Core
    Qt6::Gui
    Qt6::Qml
    Qt6::Quick
)

# Install
install(TARGETS mocha_qt
  LIBRARY DESTINATION lib
  ARCHIVE DESTINATION lib
)
install(FILES src/qt_bridge.h DESTINATION include)
