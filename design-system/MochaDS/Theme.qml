pragma Singleton
import QtQuick

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
        source: "../assets/fonts/Outfit-Regular.ttf"
    }

    FontLoader {
        id: outfitMediumLoader
        source: "../assets/fonts/Outfit-Medium.ttf"
    }

    FontLoader {
        id: outfitBoldLoader
        source: "../assets/fonts/Outfit-Bold.ttf"
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
    property string flavor: "mocha" // "mocha" | "macchiato" | "frappe" | "latte" | "vercel" | "vercel-light"
    property bool useSystemTheme: false

    SystemPalette {
        id: sysPalette
        colorGroup: SystemPalette.Active
    }

    function isDarkColor(color) {
        var luminance = (0.2126 * color.r) + (0.7152 * color.g) + (0.0722 * color.b);
        return luminance < 0.5;
    }

    readonly property bool isDark: {
        if (useSystemTheme) {
            return isDarkColor(sysPalette.window)
        }
        return flavor !== "latte" && flavor !== "vercel-light"
    }

    function getColor(name) {
        if (useSystemTheme) {
            var systemDark = isDarkColor(sysPalette.window)

            // Base and surface layout structure always respects native light/dark theme
            if (name === "base" || name === "background") return sysPalette.window
            // Rule 2: Integrate sysPalette.base for input fields (mantle) to separate them from buttons
            if (name === "mantle") return sysPalette.base
            if (name === "crust") return Qt.darker(sysPalette.window, 1.1)
            
            if (name === "text") return sysPalette.windowText
            // Rule 4: Opaque solid colors to preserve subpixel antialiasing
            if (name === "subtext1") return Qt.tint(sysPalette.window, Qt.rgba(sysPalette.windowText.r, sysPalette.windowText.g, sysPalette.windowText.b, 0.8))
            if (name === "subtext0") return Qt.tint(sysPalette.window, Qt.rgba(sysPalette.windowText.r, sysPalette.windowText.g, sysPalette.windowText.b, 0.6))
            
            if (name === "surface0") return sysPalette.button
            if (name === "surface1") return Qt.darker(sysPalette.button, 1.05)
            if (name === "surface2") return Qt.darker(sysPalette.button, 1.1)
            
            if (name === "overlay0") return sysPalette.mid
            if (name === "overlay1") return sysPalette.dark
            if (name === "overlay2") return sysPalette.shadow
            
            // Rule 1: Correct Light Mode fallback using the latte palette
            if (!systemDark) {
                return ThemeGenerated.resolveColor("latte", name);
            }

            // Rule 3: Programmatic variations for semantic and accent colors to prevent pointing to the same highlight color
            if (name === "red" || name === "danger") return Qt.tint(sysPalette.window, Qt.rgba(0.9, 0.15, 0.15, 0.8))
            if (name === "green" || name === "success") return Qt.tint(sysPalette.window, Qt.rgba(0.15, 0.75, 0.15, 0.8))
            if (name === "yellow" || name === "warning") return Qt.tint(sysPalette.window, Qt.rgba(0.9, 0.65, 0.15, 0.8))

            // Primary accents
            if (name === "mauve" || name === "primary" || name === "accent") return sysPalette.highlight
            
            // Differentiated accents
            if (name === "blue" || name === "secondary") {
                return systemDark ? Qt.darker(sysPalette.highlight, 1.1) : Qt.lighter(sysPalette.highlight, 1.1)
            }
            if (name === "sky" || name === "info") {
                return systemDark ? Qt.lighter(sysPalette.highlight, 1.2) : Qt.darker(sysPalette.highlight, 1.2)
            }
            
            // Other accents mapped programmatically to be distinct from highlight
            if (name === "rosewater") return Qt.tint(sysPalette.highlight, Qt.rgba(0.95, 0.85, 0.85, 0.4))
            if (name === "flamingo") return Qt.tint(sysPalette.highlight, Qt.rgba(0.95, 0.75, 0.75, 0.4))
            if (name === "pink") return Qt.tint(sysPalette.highlight, Qt.rgba(0.95, 0.6, 0.85, 0.4))
            if (name === "maroon") return Qt.tint(sysPalette.highlight, Qt.rgba(0.85, 0.4, 0.4, 0.4))
            if (name === "peach") return Qt.tint(sysPalette.highlight, Qt.rgba(0.95, 0.65, 0.4, 0.4))
            if (name === "teal") return Qt.tint(sysPalette.highlight, Qt.rgba(0.2, 0.75, 0.65, 0.4))
            if (name === "sapphire") return Qt.tint(sysPalette.highlight, Qt.rgba(0.2, 0.6, 0.85, 0.4))
            if (name === "lavender") return Qt.tint(sysPalette.highlight, Qt.rgba(0.7, 0.65, 0.95, 0.4))

            return sysPalette.window
        }

        return ThemeGenerated.resolveColor(flavor, name);
    }

    // Brand theme overrides — set via bridge context property _brandTheme
    function _resolveScheme(name) {
        var _brand = _brandTheme !== undefined ? _brandTheme : null
        if (_brand && _brand[name] !== undefined) return _brand[name]
        return root.getColor(_schemeFallback(name))
    }

    function _resolveTypeOverride(name, fallback) {
        var _brand = _brandTheme !== undefined ? _brandTheme : null
        if (_brand && _brand[name] !== undefined) return _brand[name]
        return fallback
    }

    function _schemeFallback(schemeKey) {
        switch (schemeKey) {
            case "schemePrimary": return "mauve"
            case "schemeOnPrimary": return root.isDark ? "crust" : "base"
            case "schemePrimaryContainer": return root.isDark ? "surface2" : "surface0"
            case "schemeOnPrimaryContainer": return root.isDark ? "text" : "text"
            case "schemeSecondary": return "blue"
            case "schemeOnSecondary": return root.isDark ? "crust" : "base"
            case "schemeSecondaryContainer": return root.isDark ? "surface1" : "surface0"
            case "schemeOnSecondaryContainer": return root.isDark ? "text" : "text"
            case "schemeTertiary": return "teal"
            case "schemeOnTertiary": return root.isDark ? "crust" : "base"
            case "schemeSurface": return "surface0"
            case "schemeOnSurface": return "text"
            case "schemeSurfaceVariant": return "surface1"
            case "schemeOnSurfaceVariant": return "subtext0"
            case "schemeBackground": return "base"
            case "schemeOnBackground": return "text"
            case "schemeError": return "red"
            case "schemeOnError": return root.isDark ? "crust" : "base"
            case "schemeOutline": return "overlay0"
            case "schemeOutlineVariant": return "overlay1"
        }
        return "text"
    }

    // ── Semantic Color Scheme (Material-like API) ──
    readonly property QtObject scheme: QtObject {
        readonly property color primary: root._resolveScheme("schemePrimary")
        readonly property color onPrimary: root._resolveScheme("schemeOnPrimary")
        readonly property color primaryContainer: root._resolveScheme("schemePrimaryContainer")
        readonly property color onPrimaryContainer: root._resolveScheme("schemeOnPrimaryContainer")
        readonly property color secondary: root._resolveScheme("schemeSecondary")
        readonly property color onSecondary: root._resolveScheme("schemeOnSecondary")
        readonly property color secondaryContainer: root._resolveScheme("schemeSecondaryContainer")
        readonly property color onSecondaryContainer: root._resolveScheme("schemeOnSecondaryContainer")
        readonly property color tertiary: root._resolveScheme("schemeTertiary")
        readonly property color onTertiary: root._resolveScheme("schemeOnTertiary")
        readonly property color surface: root._resolveScheme("schemeSurface")
        readonly property color onSurface: root._resolveScheme("schemeOnSurface")
        readonly property color surfaceVariant: root._resolveScheme("schemeSurfaceVariant")
        readonly property color onSurfaceVariant: root._resolveScheme("schemeOnSurfaceVariant")
        readonly property color background: root._resolveScheme("schemeBackground")
        readonly property color onBackground: root._resolveScheme("schemeOnBackground")
        readonly property color error: root._resolveScheme("schemeError")
        readonly property color onError: root._resolveScheme("schemeOnError")
        readonly property color outline: root._resolveScheme("schemeOutline")
        readonly property color outlineVariant: root._resolveScheme("schemeOutlineVariant")
    }

    // Colors (retrocompatível — raw palette)
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

    // Breakpoints (Tailwind-inspired)
    readonly property QtObject breakpoints: QtObject {
        readonly property real xs: 0
        readonly property real sm: 640
        readonly property real md: 768
        readonly property real lg: 1024
        readonly property real xl: 1280
    }

    // Typography Config
    readonly property QtObject typography: QtObject {
        // Font Families (overridable via _brandTheme)
        readonly property string family: root._resolveTypeOverride("typeFamily", root.fontFamily)
        readonly property string familyMedium: root._resolveTypeOverride("typeFamilyMedium", root.fontFamilyMedium)
        readonly property string familyBold: root._resolveTypeOverride("typeFamilyBold", root.fontFamilyBold)
        readonly property string familyDisplay: root._resolveTypeOverride("typeFamilyDisplay", "Geist")
        readonly property string familyMono: root._resolveTypeOverride("typeFamilyMono", "Geist Mono")

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
