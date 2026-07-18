import { QObject } from "@mocha/core";
import { QMLComponent, qml } from "@mocha/qml";

@QMLComponent({
  autoBind: true,
  hotReload: true,
  qml: qml`
    import QtQuick 2.15
    import MochaDS

    Item {
      id: view
      anchors.fill: parent

      VStack {
        anchors.centerIn: parent
        spacing: 16

        Text {
          text: "About Page"
          font.pixelSize: 24
          font.bold: true
          color: Theme.colors.text
          anchors.horizontalCenter: parent.horizontalCenter
        }

        Text {
          text: "Built with Mocha-DS — a QML design system with "
              + "TypeScript framework integration."
          font.pixelSize: 16
          color: Theme.colors.subtext1
          anchors.horizontalCenter: parent.horizontalCenter
          wrapMode: Text.WordWrap
          width: parent.width - 32
        }
      }
    }
  `,
})
export class AboutController extends QObject {
  constructor(parent: QObject | null = null) {
    super(parent);
  }
}
