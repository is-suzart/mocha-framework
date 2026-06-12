import QtQuick 2.15

Item {
    id: iconRoot

    // ==========================================
    // Public API (Properties)
    // ==========================================
    
    // The name of the icon (e.g., "home", "settings") or a direct path/url to an SVG
    property string name: ""

    // The size of the icon (both width and height)
    property real size: 24

    // Color to apply to the icon
    property color color: Theme.colors.text

    // Stroke width (thickness) of the icon paths (default is 2)
    property real strokeWidth: 2

    // Implicit sizes for layouts
    implicitWidth: size
    implicitHeight: size
    width: size
    height: size

    // ==========================================
    // Internal Logic
    // ==========================================

    // Internal cache for raw SVG text
    property string _rawSvgText: ""

    readonly property url resolvedSource: {
        if (!name) return ""
        if (name.indexOf("/") !== -1 || name.indexOf(":") !== -1) return name
        return Qt.resolvedUrl("assets/icons/" + name + ".svg")
    }

    Image {
        id: svgImage
        anchors.fill: parent
        fillMode: Image.PreserveAspectFit
        sourceSize.width: iconRoot.size
        sourceSize.height: iconRoot.size
        antialiasing: true
        smooth: true
    }

    onResolvedSourceChanged: {
        _rawSvgText = "";
        colorize();
    }
    onColorChanged: colorize()
    onStrokeWidthChanged: colorize()

    function colorize() {
        var path = resolvedSource.toString();
        if (!path) {
            svgImage.source = "";
            _rawSvgText = "";
            return;
        }

        var svgText = _rawSvgText;
        if (!svgText) {
            var xhr = new XMLHttpRequest();
            xhr.open("GET", path, false);
            xhr.send();

            if (xhr.status === 200 || xhr.status === 0) {
                svgText = xhr.responseText;
                _rawSvgText = svgText;
            } else {
                console.warn("LucideIcon: Failed to load icon " + name + " from " + path + " (Status: " + xhr.status + ")");
                svgImage.source = "";
                return;
            }
        }

        if (!svgText) return;

        // Prepare color string (handle ARGB #AARRGGBB -> #RRGGBB for SVG)
        var rawColor = iconRoot.color.toString();
        var hexColor = rawColor;
        if (rawColor.indexOf("#") === 0 && rawColor.length === 9) {
            hexColor = "#" + rawColor.substring(3);
        }

        // More flexible regex to handle ' or " and whitespace
        var coloredSvg = svgText
            .replace(/stroke\s*=\s*["']currentColor["']/g, 'stroke="' + hexColor + '"')
            .replace(/fill\s*=\s*["']currentColor["']/g, 'fill="' + hexColor + '"')
            .replace(/stroke-width\s*=\s*["'][^"']*["']/g, 'stroke-width="' + iconRoot.strokeWidth + '"');
        
        try {
            // Use base64 encoding which is more widely supported in QML Image component
            // We use encodeURIComponent + unescape to safely handle any UTF-8 characters before btoa
            var base64Svg = Qt.btoa(unescape(encodeURIComponent(coloredSvg)));
            svgImage.source = "data:image/svg+xml;base64," + base64Svg;
        } catch (e) {
            console.error("LucideIcon: Failed to encode SVG for " + name + ": " + e);
            // Fallback to direct source if colorization fails
            svgImage.source = path;
        }
    }
    
    Component.onCompleted: colorize()
}
