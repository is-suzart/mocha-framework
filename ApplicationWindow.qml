import QtQuick
import QtQuick.Controls
import MochaDS
import "." as DS

ApplicationWindow {
    id: windowRoot

    // Theme Mode: "catppuccin" | "system"
    property string themeMode: "catppuccin"

    // Catppuccin Flavor: "mocha" | "macchiato" | "frappe" | "latte"
    property string flavor: Theme.flavor

    onFlavorChanged: {
        if (Theme.flavor !== flavor) {
            Theme.flavor = flavor;
        }
    }

    Connections {
        target: Theme
        ignoreUnknownSignals: true
        function onFlavorChanged() {
            if (windowRoot.flavor !== Theme.flavor) {
                windowRoot.flavor = Theme.flavor;
            }
        }
    }

    // Update global Theme setting when mode changes
    onThemeModeChanged: {
        Theme.useSystemTheme = (themeMode === "system")
    }

    Component.onCompleted: {
        Theme.useSystemTheme = (themeMode === "system")
    }

    // Default window styling based on theme
    color: Theme.colors.background
    
    font.family: Theme.typography.family
    font.pixelSize: Theme.typography.sizeMd
}
