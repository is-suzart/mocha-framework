import { createMobileApp } from "@mocha/mobile";

(function () {
  "use strict";
  console.log("[test-qml] Starting MochaDS + QuickJS test...");

  const app = createMobileApp();

  const proxyId = app.createProxy();
  console.log("[test-qml] proxyId = " + proxyId);

  app.proxySetValue(proxyId, "title", "MochaDS + QuickJS");
  app.proxySetValue(proxyId, "count", 0);

  app.setContextProperty("controller", proxyId);

  const qml = [
    'import QtQuick',
    'import QtQuick.Controls',
    '',
    'ApplicationWindow {',
    '  visible: true; width: 480; height: 320',
    '  title: controller.title',
    '  color: "#1e1e2e"',
    '',
    '  Column {',
    '    anchors.centerIn: parent',
    '    spacing: 16',
    '',
    '    Text {',
    '      anchors.horizontalCenter: parent.horizontalCenter',
    '      text: controller.title',
    '      font.pixelSize: 24; font.bold: true',
    '      color: "#cba6f7"',
    '    }',
    '',
    '    Text {',
    '      anchors.horizontalCenter: parent.horizontalCenter',
    '      text: "Running on QuickJS — zero Node.js"',
    '      color: "#a6adc8"',
    '    }',
    '',
    '    Text {',
    '      anchors.horizontalCenter: parent.horizontalCenter',
    '      text: "Count: " + controller.count',
    '      font.pixelSize: 20',
    '      color: "#cba6f7"',
    '    }',
    '',
    '    Row {',
    '      anchors.horizontalCenter: parent.horizontalCenter',
    '      spacing: 12',
    '',
    '      Button {',
    '        text: "+"',
    '        onClicked: controller.bridgeCall("increment")',
    '      }',
    '',
    '      Button {',
    '        text: "-"',
    '        onClicked: controller.bridgeCall("decrement")',
    '      }',
    '    }',
    '  }',
    '}',
  ].join("\n");

  console.log("[test-qml] Loading QML (" + qml.length + " bytes)...");

  var g = globalThis;
  g.__mocha_nativeEngineLoad(app._engine, qml, ".", "");

  var count = 0;
  function tick() {
    app.processEvents();
    var calls = app.proxyDrainPendingCalls(proxyId);
    for (var i = 0; i < calls.length; i++) {
      if (calls[i] === "increment") {
        count++;
        app.proxySetValue(proxyId, "count", count);
      } else if (calls[i] === "decrement") {
        count--;
        app.proxySetValue(proxyId, "count", count);
      }
    }
    setTimeout(tick, 8);
  }

  console.log("[test-qml] Event loop started");
  tick();
})();
