import {
  QObject,
  QProperty,
  qproperty,
} from "@mocha/core";
import { QMLComponent, qml, runApp, switchTheme } from "@mocha/qml";
import { santanderDark, santanderLight } from "./theme.santander.js";

@QMLComponent({
  autoBind: true,
  qml: qml`
    import QtQuick 2.15
    import MochaDS
    import QtQuick.Window 2.15
    import QtQuick.Controls 2.15

    ApplicationWindow {
      id: root
      width: 800
      height: 980
      visible: true
      title: "Theme Switcher — Santander Brand"
      color: Theme.scheme.background
      Component.onCompleted: console.log("[QML] root.color (Theme.scheme.background) =", color)
      onColorChanged: console.log("[QML] root.color CHANGED →", color)

      Flickable {
        anchors.fill: parent
        contentHeight: contentColumn.implicitHeight + 48
        clip: true

        Column {
          id: contentColumn
          anchors.fill: parent
          anchors.margins: 24
          spacing: Theme.spacing.xl

          // ── Header (background → primaryContainer gradient) ──
          Rectangle {
            width: parent.width
            height: 140
            radius: Theme.geometry.radiusLg
            color: Theme.scheme.primaryContainer
            border.width: 1
            border.color: Theme.scheme.outlineVariant

            Row {
              anchors.fill: parent
              anchors.margins: 24
              spacing: Theme.spacing.lg

              Column {
                anchors.verticalCenter: parent.verticalCenter
                width: parent.width - 220
                spacing: Theme.spacing.xs

                Text {
                  text: "Santander Brand Theme"
                  font.pixelSize: Theme.typography.sizeH2
                  font.bold: true
                  color: Theme.scheme.onPrimaryContainer
                }
                Text {
                  text: "Mode: " + controller.currentTheme.value +
                        "  •  isDark=" + Theme.isDark +
                        "  •  flavor=" + Theme.flavor
                  font.pixelSize: Theme.typography.sizeSm
                  color: Theme.scheme.onPrimaryContainer
                  opacity: 0.75
                }
                Text {
                  text: "Font: " + Theme.typography.family + " / " + Theme.typography.familyBold
                  font.pixelSize: Theme.typography.sizeXs
                  color: Theme.scheme.onPrimaryContainer
                  opacity: 0.6
                }
                Text {
                  text: "DEBUG scheme.bg=" + Theme.scheme.background +
                        "  scheme.onBg=" + Theme.scheme.onBackground +
                        "  scheme.onPrim=" + Theme.scheme.onPrimary +
                        "  colors.bg=" + Theme.colors.background +
                        "  colors.primary=" + Theme.colors.primary
                  font.pixelSize: 9
                  color: Theme.scheme.onPrimaryContainer
                  opacity: 0.5
                }
              }

              Button {
                anchors.verticalCenter: parent.verticalCenter
                width: 180
                height: 44
                text: controller.currentTheme.value === "Dark" ? "☀  Switch to Light" : "☾  Switch to Dark"
                variant: "primary"
                onClicked: controller.bridgeCall("toggleTheme")
              }
            }
          }

          // Auto-toggle kickoff (controlled by MOCHA_NO_AUTO_TOGGLE env)
          Item {
            Component.onCompleted: controller.bridgeCall("startAutoToggle")
          }

          // ── Tier cards: primary / secondary / tertiary ──
          Row {
            width: parent.width
            spacing: Theme.spacing.lg

            // Primary
            Rectangle {
              width: (parent.width - Theme.spacing.lg * 2) / 3
              height: 120
              radius: Theme.geometry.radiusMd
              color: Theme.scheme.primary
              Column {
                anchors.fill: parent
                anchors.margins: 16
                spacing: 4
                Text {
                  text: "PRIMARY"
                  font.pixelSize: Theme.typography.sizeXs
                  font.bold: true
                  color: Theme.scheme.onPrimary
                  opacity: 0.7
                }
                Text {
                  text: Theme.scheme.primary
                  font.pixelSize: Theme.typography.sizeH1
                  font.bold: true
                  color: Theme.scheme.onPrimary
                }
                Text {
                  text: "onPrimary"
                  font.pixelSize: Theme.typography.sizeSm
                  color: Theme.scheme.onPrimary
                  opacity: 0.8
                }
              }
            }

            // Secondary
            Rectangle {
              width: (parent.width - Theme.spacing.lg * 2) / 3
              height: 120
              radius: Theme.geometry.radiusMd
              color: Theme.scheme.secondary
              Column {
                anchors.fill: parent
                anchors.margins: 16
                spacing: 4
                Text {
                  text: "SECONDARY"
                  font.pixelSize: Theme.typography.sizeXs
                  font.bold: true
                  color: Theme.scheme.onSecondary
                  opacity: 0.7
                }
                Text {
                  text: Theme.scheme.secondary
                  font.pixelSize: Theme.typography.sizeH1
                  font.bold: true
                  color: Theme.scheme.onSecondary
                }
                Text {
                  text: "onSecondary"
                  font.pixelSize: Theme.typography.sizeSm
                  color: Theme.scheme.onSecondary
                  opacity: 0.8
                }
              }
            }

            // Tertiary
            Rectangle {
              width: (parent.width - Theme.spacing.lg * 2) / 3
              height: 120
              radius: Theme.geometry.radiusMd
              color: Theme.scheme.tertiary
              Column {
                anchors.fill: parent
                anchors.margins: 16
                spacing: 4
                Text {
                  text: "TERTIARY"
                  font.pixelSize: Theme.typography.sizeXs
                  font.bold: true
                  color: Theme.scheme.onTertiary
                  opacity: 0.7
                }
                Text {
                  text: Theme.scheme.tertiary
                  font.pixelSize: Theme.typography.sizeH1
                  font.bold: true
                  color: Theme.scheme.onTertiary
                }
                Text {
                  text: "onTertiary"
                  font.pixelSize: Theme.typography.sizeSm
                  color: Theme.scheme.onTertiary
                  opacity: 0.8
                }
              }
            }
          }

          // ── Surface & onSurface panel ──
          Rectangle {
            width: parent.width
            height: 130
            radius: Theme.geometry.radiusMd
            color: Theme.scheme.surface
            border.width: 1
            border.color: Theme.scheme.outlineVariant

            Row {
              anchors.fill: parent
              anchors.margins: 20
              spacing: Theme.spacing.xl

              Column {
                anchors.verticalCenter: parent.verticalCenter
                spacing: 4
                Text {
                  text: "SURFACE"
                  font.pixelSize: Theme.typography.sizeXs
                  font.bold: true
                  color: Theme.scheme.onSurfaceVariant
                }
                Text {
                  text: "background: " + Theme.scheme.background
                  font.pixelSize: Theme.typography.sizeMd
                  color: Theme.scheme.onBackground
                }
                Text {
                  text: "surface:    " + Theme.scheme.surface
                  font.pixelSize: Theme.typography.sizeMd
                  color: Theme.scheme.onSurface
                }
                Text {
                  text: "surfaceVariant: " + Theme.scheme.surfaceVariant
                  font.pixelSize: Theme.typography.sizeMd
                  color: Theme.scheme.onSurfaceVariant
                }
                Text {
                  text: "onSurface:  " + Theme.scheme.onSurface
                  font.pixelSize: Theme.typography.sizeMd
                  color: Theme.scheme.onSurface
                }
              }

              Item { width: 1; height: 1 }

              Rectangle {
                anchors.verticalCenter: parent.verticalCenter
                width: 240
                height: 70
                radius: Theme.geometry.radiusSm
                color: Theme.scheme.surfaceVariant
                Text {
                  anchors.centerIn: parent
                  text: "surfaceVariant box"
                  font.pixelSize: Theme.typography.sizeSm
                  color: Theme.scheme.onSurfaceVariant
                }
              }
            }
          }

          // ── Outline swatches ──
          Row {
            width: parent.width
            spacing: Theme.spacing.md

            Repeater {
              model: [
                { label: "outline",        color: Theme.scheme.outline },
                { label: "outlineVariant", color: Theme.scheme.outlineVariant },
                { label: "error",          color: Theme.scheme.error },
                { label: "onError",        color: Theme.scheme.onError },
              ]
              delegate: Rectangle {
                width: (parent.width - Theme.spacing.md * 3) / 4
                height: 90
                radius: Theme.geometry.radiusSm
                color: modelData.color
                border.width: 1
                border.color: Theme.scheme.outline
                Column {
                  anchors.fill: parent
                  anchors.margins: 12
                  spacing: 4
                  Text {
                    text: modelData.label
                    font.pixelSize: Theme.typography.sizeXs
                    font.bold: true
                    color: Theme.scheme.onSurface
                  }
                  Text {
                    text: modelData.color
                    font.pixelSize: Theme.typography.sizeSm
                    color: Theme.scheme.onSurface
                    opacity: 0.8
                  }
                }
              }
            }
          }

          // ── Buttons across all variants ──
          VStack {
            width: parent.width
            spacing: Theme.spacing.md

            Text {
              text: "Button variants"
              font.pixelSize: Theme.typography.sizeMd
              font.bold: true
              color: Theme.scheme.onBackground
            }

            HStack {
              width: parent.width
              spacing: Theme.spacing.sm
              Button { text: "primary";   variant: "primary" }
              Button { text: "secondary"; variant: "secondary" }
              Button { text: "success";   variant: "success" }
              Button { text: "warning";   variant: "warning" }
              Button { text: "danger";    variant: "danger" }
              Button { text: "info";      variant: "info" }
            }
          }

          // ── Input showcase ──
          VStack {
            width: parent.width
            spacing: Theme.spacing.sm

            Text {
              text: "Inputs"
              font.pixelSize: Theme.typography.sizeMd
              font.bold: true
              color: Theme.scheme.onBackground
            }

            TextField {
              width: parent.width
              placeholder: "Type here — should follow scheme colors"
            }

            HStack {
              width: parent.width
              spacing: Theme.spacing.sm
              CheckBox { text: "Subscribe to updates" }
              CheckBox { text: "Enable analytics" }
            }
          }

          // ── Accent palette (Catppuccin when no brand override) ──
          VStack {
            width: parent.width
            spacing: Theme.spacing.sm

            Text {
              text: "Accent palette (raw)"
              font.pixelSize: Theme.typography.sizeMd
              font.bold: true
              color: Theme.scheme.onBackground
            }

            Row {
              width: parent.width
              spacing: 4
              Repeater {
                model: ["red","maroon","peach","yellow","green","teal","sky","sapphire","blue","lavender","mauve","pink","flamingo","rosewater"]
                delegate: Rectangle {
                  width: (parent.width - 4 * 13) / 14
                  height: 48
                  radius: 4
                  color: Theme.colors[modelData]
                  Text {
                    anchors.centerIn: parent
                    text: modelData
                    font.pixelSize: 9
                    color: "white"
                    style: Text.Outline
                    styleColor: "black"
                  }
                }
              }
            }
          }
        }
      }
    }
  `,
})
export class ThemeSwitchController extends QObject {
  @qproperty currentTheme = new QProperty("Dark");

  toggleTheme() {
    if (this.currentTheme.value === "Dark") {
      this.currentTheme.value = "Light";
      switchTheme(santanderLight);
    } else {
      this.currentTheme.value = "Dark";
      switchTheme(santanderDark);
    }
  }

  // Debug: print current theme values via getQmlProperty
  inspect(label: string = "manual") {
    const app: any = (globalThis as any).__mochaNative;
    if (!app) {
      console.log(`[INSPECT ${label}] no __mochaNative`);
      return;
    }
    try {
      const rootId = app.getRootObject();
      const rootProps = app.getQmlProperties(rootId);
      const rootColorProp = rootProps.find((p: any) => p.name === "color");
      console.log(`[INSPECT ${label}] rootId=${rootId} color=${rootColorProp?.value}`);

      const allRoots = app.listRootObjects();
      console.log(`[INSPECT ${label}] allRoots=${allRoots.length}`);
      const seen = new Set<number>();
      const walk = (id: number, depth: number) => {
        if (seen.has(id) || depth > 6) return;
        seen.add(id);
        const props = app.getQmlProperties(id);
        const cp = props.find((p: any) => p.name === "color");
        if (cp && cp.value && String(cp.value).startsWith("#")) {
          console.log(`  ${" ".repeat(depth * 2)}id=${id} color=${cp.value}`);
        }
        const kids = app.listChildren(id);
        for (const k of kids) walk(k.id, depth + 1);
      };
      for (const r of allRoots) walk(r.id, 0);
    } catch (e) {
      console.log(`[INSPECT ${label}] failed:`, (e as Error).message);
    }
  }

  // Direct QML-side log via Component.onCompleted hooks
  logQmlState(label: string) {
    // No-op placeholder — actual QML log is via Component.onCompleted
    // (the Text widgets with `Component.onCompleted: console.log(...)`)
    console.log(`[QML ${label}] (see Component.onCompleted hooks)`);
  }

  // Auto-toggle + auto-inspect for verification
  startAutoToggle() {
    if (process.env.MOCHA_NO_AUTO_TOGGLE) return;
    setTimeout(() => this.inspect("initial"), 500);
    setInterval(() => {
      this.toggleTheme();
      setTimeout(() => this.inspect("after-toggle"), 200);
    }, 1500);
  }
}

runApp(ThemeSwitchController, { theme: santanderDark });
