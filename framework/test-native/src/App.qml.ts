import {
  QObject,
  QProperty,
  qproperty,
} from "@mocha/core";
import { QMLComponent, qml } from "@mocha/qml";

// Try to import native Qt bindings, fallback to mock for development/testing
let nativeApp: any = null;
async function getNativeApp() {
  if (nativeApp) return nativeApp;
  try {
    const { createNativeApp } = await import("@mocha/native");
    nativeApp = await createNativeApp();
    console.log("[Mocha] Native Qt backend loaded");
  } catch {
    console.warn("[Mocha] Native backend unavailable, using mock (no window)");
    nativeApp = {
      loadQML: () => {},
      setProperty: () => {},
      exec: () => 0,
      quit: () => {},
    };
  }
  return nativeApp;
}

@QMLComponent({
  autoBind: true,
  hotReload: true,
  qml: qml`
    import QtQuick 2.15
    import MochaDS

    Item {
      id: root
      anchors.fill: parent

      Component.onCompleted: {
        MochaI18n.basePath = Qt.resolvedUrl("i18n").toString()
        MochaI18n.locale = Qt.locale().name.substring(0, 2) === "pt" ? "pt" : "en"
      }

      VStack {
        anchors.fill: parent
        spacing: 0

        HStack {
          width: parent.width
          height: 64
          padding: 16
          spacing: 24

          Text {
            text: controller.title.value
            font.pixelSize: 22
            font.bold: true
            color: Theme.colors.text
            anchors.verticalCenter: parent.verticalCenter
          }

          HStack {
            spacing: 16
            anchors.verticalCenter: parent.verticalCenter

            RouterLink {
              to: "/home"
              text: "Home"
              router: mainRouter
              activeColor: Theme.colors.primary
            }

            RouterLink {
              to: "/about"
              text: "About"
              router: mainRouter
              activeColor: Theme.colors.primary
            }
          }
        }

        Router {
          id: mainRouter
          width: parent.width
          height: parent.height - 64
          initialRoute: "/home"

          Route {
            path: "/home"
            source: Qt.resolvedUrl("views/Home.qml")
          }

          Route {
            path: "/about"
            source: Qt.resolvedUrl("views/About.qml")
          }
        }
      }
    }
  `,
})
export class AppController extends QObject {
  @qproperty title = new QProperty("test-native");
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

async function main() {
  const app = await getNativeApp();

  const controller = new AppController();

  // Generate QML source from the component
  const { generateQMLSource, getQMLComponentMetadata } = await import("@mocha/qml");
  const meta = getQMLComponentMetadata(AppController);
  if (meta) {
    const qmlSource = generateQMLSource(controller, meta);
    app.loadQML(qmlSource, process.cwd());
  }

  console.log(`[Mocha] test-native v0.1.0 starting...`);
  const exitCode = app.exec();
  console.log(`[Mocha] exited with code ${exitCode}`);
}

main().catch((err) => {
  console.error("[Mocha] Fatal error:", err);
  process.exit(1);
});
