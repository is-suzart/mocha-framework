pragma Singleton
import QtQuick 2.15

Item {
    id: root

    // ==========================================
    // Universal Overlay Stacking Order Manager
    // ==========================================
    property int currentMaxZ: 10000

    function getNextMaxZ() {
        currentMaxZ = currentMaxZ + 1;
        return currentMaxZ;
    }

    // ==========================================
    // Font Loaders
    // ==========================================
    FontLoader {
        id: outfitRegularLoader
        source: "assets/fonts/Outfit-Regular.ttf"
    }

    FontLoader {
        id: outfitMediumLoader
        source: "assets/fonts/Outfit-Medium.ttf"
    }

    FontLoader {
        id: outfitBoldLoader
        source: "assets/fonts/Outfit-Bold.ttf"
    }

    // Expose loaded font names
    readonly property string fontFamily: outfitRegularLoader.name
    readonly property string fontFamilyMedium: outfitMediumLoader.name
    readonly property string fontFamilyBold: outfitBoldLoader.name

    // ==========================================
    // Visual Tokens
    // ==========================================

    // Spacing Tokens
    readonly property QtObject spacing: QtObject {
        readonly property real xs: 4
        readonly property real sm: 8
        readonly property real md: 12
        readonly property real lg: 16
        readonly property real xl: 24
        readonly property real xxl: 32
    }

    // Geometry Tokens (Cozy, soft corners)
    readonly property QtObject geometry: QtObject {
        readonly property real radiusSm: 6
        readonly property real radiusMd: 12
        readonly property real radiusLg: 18
        readonly property real radiusPill: 9999
        
        readonly property real borderSm: 1
        readonly property real borderMd: 2
    }

    // ==========================================
    // Theme & Palette Setup
    // ==========================================
    property string flavor: "mocha" // "mocha" | "macchiato" | "frappe" | "latte"

    function getColor(name) {
        var palette = palettes[flavor];
        if (!palette) palette = palettes["mocha"];
        return palette[name] || "#000000";
    }

    readonly property var palettes: {
        return {
            "macchiato": {
                "rosewater": "#f4dbd6",
                "flamingo": "#f0c6c6",
                "pink": "#f5bde6",
                "mauve": "#c6a0f6",
                "red": "#ed8796",
                "maroon": "#ee99a0",
                "peach": "#f5a97f",
                "yellow": "#eed49f",
                "green": "#a6da95",
                "teal": "#8bd5ca",
                "sky": "#91d7e3",
                "sapphire": "#7dc4e4",
                "blue": "#8aadf4",
                "lavender": "#b7bdf8",
                "text": "#cad3f5",
                "subtext1": "#b8c0e0",
                "subtext0": "#a5adcb",
                "overlay2": "#939ab7",
                "overlay1": "#8087a2",
                "overlay0": "#6e738d",
                "surface2": "#5b6078",
                "surface1": "#494d64",
                "surface0": "#363a4f",
                "base": "#24273a",
                "mantle": "#1e2030",
                "crust": "#181926",
                "contrastDark": "#1e2030",
                "contrastLight": "#eff1f5"
            },
            "mocha": {
                "rosewater": "#f5e0dc",
                "flamingo": "#f2cdcd",
                "pink": "#f5c2e7",
                "mauve": "#cba6f7",
                "red": "#f38ba8",
                "maroon": "#eba0ac",
                "peach": "#fab387",
                "yellow": "#f9e2af",
                "green": "#a6e3a1",
                "teal": "#94e2d5",
                "sky": "#89dceb",
                "sapphire": "#74c7ec",
                "blue": "#89b4fa",
                "lavender": "#b4befe",
                "text": "#cdd6f4",
                "subtext1": "#bac2de",
                "subtext0": "#a6adc8",
                "overlay2": "#585b70",
                "overlay1": "#7f849c",
                "overlay0": "#6c7086",
                "surface2": "#585b70",
                "surface1": "#45475a",
                "surface0": "#313244",
                "base": "#1e1e2e",
                "mantle": "#181825",
                "crust": "#11111b",
                "contrastDark": "#11111b",
                "contrastLight": "#eff1f5"
            },
            "frappe": {
                "rosewater": "#f2d5cf",
                "flamingo": "#eebebe",
                "pink": "#f4b8e4",
                "mauve": "#ca9ee6",
                "red": "#e78284",
                "maroon": "#ea999c",
                "peach": "#ef9f76",
                "yellow": "#e5c890",
                "green": "#a6d189",
                "teal": "#81c8be",
                "sky": "#99d1db",
                "sapphire": "#85c1dc",
                "blue": "#8caaee",
                "lavender": "#babbf1",
                "text": "#c6d0f5",
                "subtext1": "#b5bfe2",
                "subtext0": "#a5adce",
                "overlay2": "#949cbb",
                "overlay1": "#838ba7",
                "overlay0": "#737994",
                "surface2": "#626880",
                "surface1": "#51576d",
                "surface0": "#414559",
                "base": "#303446",
                "mantle": "#292c3c",
                "crust": "#232634",
                "contrastDark": "#292c3c",
                "contrastLight": "#eff1f5"
            },
            "latte": {
                "rosewater": "#dc8a78",
                "flamingo": "#dd7878",
                "pink": "#ea76cb",
                "mauve": "#8839ef",
                "red": "#d20f39",
                "maroon": "#e64553",
                "peach": "#fe640b",
                "yellow": "#df8e1d",
                "green": "#40a02b",
                "teal": "#179287",
                "sky": "#04a5e5",
                "sapphire": "#209fb5",
                "blue": "#1e66f5",
                "lavender": "#7287fd",
                "text": "#4c4f69",
                "subtext1": "#5c5f77",
                "subtext0": "#6c6f85",
                "overlay2": "#7c7f93",
                "overlay1": "#8c8fa1",
                "overlay0": "#9ca0b0",
                "surface2": "#acb0be",
                "surface1": "#bcc0cc",
                "surface0": "#ccd0da",
                "base": "#eff1f5",
                "mantle": "#e6e9ef",
                "crust": "#dce0e8",
                "contrastDark": "#4c4f69",
                "contrastLight": "#eff1f5"
            }
        };
    }

    // Colors
    readonly property QtObject colors: QtObject {
        // Theme Colors
        readonly property color base: root.getColor("base")
        readonly property color mantle: root.getColor("mantle")
        readonly property color crust: root.getColor("crust")

        readonly property color text: root.getColor("text")
        readonly property color subtext1: root.getColor("subtext1")
        readonly property color subtext0: root.getColor("subtext0")

        readonly property color overlay2: root.getColor("overlay2")
        readonly property color overlay1: root.getColor("overlay1")
        readonly property color overlay0: root.getColor("overlay0")

        readonly property color surface2: root.getColor("surface2")
        readonly property color surface1: root.getColor("surface1")
        readonly property color surface0: root.getColor("surface0")

        // Accent Colors
        readonly property color lavender: root.getColor("lavender")
        readonly property color blue: root.getColor("blue")
        readonly property color sapphire: root.getColor("sapphire")
        readonly property color sky: root.getColor("sky")
        readonly property color teal: root.getColor("teal")
        readonly property color green: root.getColor("green")
        readonly property color yellow: root.getColor("yellow")
        readonly property color peach: root.getColor("peach")
        readonly property color maroon: root.getColor("maroon")
        readonly property color red: root.getColor("red")
        readonly property color mauve: root.getColor("mauve")
        readonly property color pink: root.getColor("pink")
        readonly property color flamingo: root.getColor("flamingo")
        readonly property color rosewater: root.getColor("rosewater")
        
        readonly property color contrastDark: root.getColor("contrastDark")
        readonly property color contrastLight: root.getColor("contrastLight")

        // Semantic Colors
        readonly property color background: base
        readonly property color primary: mauve
        readonly property color secondary: blue
        readonly property color success: green
        readonly property color warning: yellow
        readonly property color danger: red
        readonly property color info: sky
    }

    // Typography Config
    readonly property QtObject typography: QtObject {
        // Font Families
        readonly property string family: root.fontFamily
        readonly property string familyMedium: root.fontFamilyMedium
        readonly property string familyBold: root.fontFamilyBold

        // Font Sizes
        readonly property real sizeXs: 10
        readonly property real sizeSm: 12
        readonly property real sizeMd: 14 // Body text
        readonly property real sizeLg: 16 // Large text
        readonly property real sizeXl: 20 // Subheadings
        readonly property real sizeH2: 24 // Medium headings
        readonly property real sizeH1: 32 // Large headings
    }
}
