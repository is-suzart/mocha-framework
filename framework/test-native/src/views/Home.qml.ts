import {
  QObject,
  QProperty,
  qproperty,
} from "@mocha/core";
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
        spacing: 20

        Text {
          text: "Home Page"
          font.pixelSize: 24
          font.bold: true
          color: Theme.colors.text
          anchors.horizontalCenter: parent.horizontalCenter
        }

        Text {
          text: MochaI18n.t("count", { count: controller.count.value })
          font.pixelSize: 18
          color: Theme.colors.subtext1
          anchors.horizontalCenter: parent.horizontalCenter
        }

        HStack {
          spacing: 12
          anchors.horizontalCenter: parent.horizontalCenter

          Button {
            text: MochaI18n.t("increment")
            onClicked: controller.increment()
          }

          Button {
            text: MochaI18n.t("reset")
            variant: "outline"
            onClicked: controller.reset()
          }
        }
      }
    }
  `,
})
export class HomeController extends QObject {
  @qproperty count = new QProperty(0);

  constructor(parent: QObject | null = null) {
    super(parent);
  }

  increment(): void {
    this.count.value += 1;
  }

  reset(): void {
    this.count.value = 0;
  }
}
