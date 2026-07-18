/**
 * Test the @mocha/native Qt bindings with a minimal QML window.
 * 
 * Requirements:
 * - Qt6 dev libraries installed
 * - @mocha/native built (index.js + .node binary)
 * - Display server (X11/Wayland) running
 */

import { createNativeApp } from "./src/native.js";

async function main() {
  console.log("Creating native Qt application...");
  const app = await createNativeApp();
  console.log("Native app created.");

  const qml = `
    import QtQuick 2.15

    Rectangle {
      width: 400
      height: 300
      color: "#1e1e2e"

      Column {
        anchors.centerIn: parent
        spacing: 16

        Text {
          text: "Mocha Native Test"
          font.pixelSize: 24
          font.bold: true
          color: "#cdd6f4"
          anchors.horizontalCenter: parent.horizontalCenter
        }

        Text {
          text: "TypeScript + Qt via napi-rs"
          font.pixelSize: 14
          color: "#a6adc8"
          anchors.horizontalCenter: parent.horizontalCenter
        }

        Rectangle {
          width: 120
          height: 40
          radius: 8
          color: "#cba6f7"
          anchors.horizontalCenter: parent.horizontalCenter

          Text {
            text: "It works!"
            font.pixelSize: 14
            font.bold: true
            color: "#1e1e2e"
            anchors.centerIn: parent
          }

          MouseArea {
            anchors.fill: parent
            onClicked: {
              console.log("Button clicked!")
            }
          }
        }
      }
    }
  `;

  console.log("Loading QML...");
  app.loadQML(qml);

  console.log("Starting Qt event loop...");
  const exitCode = app.exec();
  console.log(`Qt event loop exited with code ${exitCode}`);
}

main().catch((err) => {
  console.error("Error:", err);
  process.exit(1);
});
