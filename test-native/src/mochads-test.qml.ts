import { QObject } from "@mocha/core";
import { QMLComponent, qml, runApp, switchTheme } from "@mocha/qml";
import { santanderDark, santanderLight } from "./theme.santander.js";

@QMLComponent({
  autoBind: true,
  qml: qml`
    import QtQuick 2.15
    import MochaDS
    import QtQuick.Window 2.15

    ApplicationWindow {
      id: root
      width: 500
      height: 700
      visible: true
      title: "MochaDS Test"
      color: Theme.scheme.background

      Column {
        anchors.fill: parent
        anchors.margins: 24
        spacing: 16

        H1 { text: "Santander Brand (H1)" }
        H2 { text: "Theme Switch Test (H2)" }
        Span { text: "mode=" + controller.currentTheme + " isDark=" + Theme.isDark }

        // Direct proxy
        Rectangle {
          width: parent.width - 40; height: 60
          color: _brandTheme.schemePrimary
          radius: 12
          Span {
            anchors.centerIn: parent
            text: "Direct: " + _brandTheme.schemePrimary + " / " + _brandTheme.schemeOnPrimary
            colorName: "crust"
          }
        }

        // Flat root property
        Rectangle {
          width: parent.width - 40; height: 60
          color: Theme.schemePrimary
          radius: 12
          Span {
            anchors.centerIn: parent
            text: "flat schemePrimary: " + Theme.schemePrimary
            customColor: Theme.schemeOnPrimary
          }
        }

        // Alias via QtObject
        Rectangle {
          width: parent.width - 40; height: 60
          color: Theme.scheme.primary
          radius: 12
          Span {
            anchors.centerIn: parent
            text: "scheme.primary: " + Theme.scheme.primary
            customColor: Theme.scheme.onPrimary
          }
        }

        Button {
          text: "Toggle Dark / Light"
          variant: "primary"
          onClicked: controller.bridgeCall("toggleTheme")
        }

        // Native Text (plain QtQuick, NOT Span) — vive com themer
        Text {
          text: "Text nativo: scheme.onBackground = " + Theme.scheme.onBackground
          color: Theme.scheme.onBackground
          font.pixelSize: 14
        }
        Text {
          text: "Text nativo: scheme.onSurface = " + Theme.scheme.onSurface
          color: Theme.scheme.onSurface
          font.pixelSize: 14
        }
        Text {
          text: "Text nativo: colors.text = " + Theme.colors.text
          color: Theme.colors.text
          font.pixelSize: 14
        }
        Text {
          text: "Text nativo: colors.primary = " + Theme.colors.primary
          color: Theme.colors.primary
          font.pixelSize: 14
        }
        Text {
          text: "Texto fixo branco (referencia)"
          color: "#ffffff"
          font.pixelSize: 14
        }
      }
    }
  `,
})
export class MochaDSElementsController extends QObject {
  currentTheme = "Dark";

  toggleTheme() {
    if (this.currentTheme === "Dark") {
      this.currentTheme = "Light";
      switchTheme(santanderLight);
    } else {
      this.currentTheme = "Dark";
      switchTheme(santanderDark);
    }
  }
}

runApp(MochaDSElementsController, { theme: santanderDark });
