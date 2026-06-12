import QtQuick 2.15

Item {
    id: root

    // ==========================================
    // Public API (Properties)
    // ==========================================

    // Title of the card header (used in default header)
    property string title: ""

    // Subtitle of the card header (used in default header)
    property string subtitle: ""

    // Icon name for the card header (used in default header)
    property string icon: ""

    // Variant style: "default" | "accent" | "tonal" | "outline"
    property string variant: "default"

    // Accent line position: "left" | "top" | "none"
    property string accentPosition: "left"

    // Spacing padding inside the card body
    property real padding: Theme.spacing.lg

    // Visual customizations (Overrides)
    property string backgroundColor: ""
    property real customRadius: -1
    property color customColor: "transparent"
    property color customAccentColor: "transparent"
    property color customTextColor: "transparent"

    // Separator visibility switches
    property bool headerSeparator: true
    property bool footerSeparator: true

    // Slots
    property list<Item> header
    property list<Item> footer
    
    // Default property to catch children inside the body
    default property alias content: bodyContainer.data

    // ==========================================
    // Internal Style Tokens & Helpers
    // ==========================================

    readonly property real finalRadius: customRadius >= 0 ? customRadius : Theme.geometry.radiusMd

    readonly property bool hasCustomColor: customColor.toString() !== "#00000000" && customColor.toString() !== "transparent"
    readonly property bool hasCustomAccentColor: customAccentColor.toString() !== "#00000000" && customAccentColor.toString() !== "transparent"
    readonly property bool hasCustomTextColor: customTextColor.toString() !== "#00000000" && customTextColor.toString() !== "transparent"

    readonly property color finalBackgroundColor: {
        if (hasCustomColor) return customColor
        var themeColor = Theme.colors[backgroundColor]
        if (themeColor !== undefined) return themeColor
        if (variant === "tonal") return Theme.colors.surface0
        if (variant === "outline") return "transparent"
        return Theme.colors.base // default, accent
    }

    readonly property color finalBorderColor: {
        if (variant === "outline") return hasCustomAccentColor ? customAccentColor : Theme.colors.surface1
        return "transparent"
    }

    readonly property real finalBorderWidth: {
        if (variant === "outline") return Theme.geometry.borderSm
        return 0
    }

    readonly property color finalAccentColor: {
        if (hasCustomAccentColor) return customAccentColor
        return Theme.colors.primary // Mauve
    }

    readonly property color finalTextColor: {
        if (hasCustomTextColor) return customTextColor
        return Theme.colors.text
    }

    // Dynamic Sizing
    implicitWidth: 350
    implicitHeight: mainLayoutColumn.height + mainLayoutColumn.anchors.topMargin
    width: implicitWidth
    height: implicitHeight

    // ==========================================
    // Visual Tree
    // ==========================================

    // Background Rect
    Rectangle {
        id: bgRect
        anchors.fill: parent
        color: root.finalBackgroundColor
        radius: root.finalRadius
        border.color: root.finalBorderColor
        border.width: root.finalBorderWidth
        clip: true // Crucial to clip custom/accent lines at rounded corners

        // Accent indicator line (visible in accent variant)
        Rectangle {
            id: accentIndicator
            color: root.finalAccentColor
            visible: root.variant === "accent" && root.accentPosition !== "none"

            // Geometry based on position
            width: root.accentPosition === "left" ? 4 : parent.width
            height: root.accentPosition === "top" ? 4 : parent.height
            anchors.left: parent.left
            anchors.top: parent.top
        }

        // Layout Stacking
        Column {
            id: mainLayoutColumn
            anchors.left: parent.left
            anchors.right: parent.right
            anchors.top: parent.top

            // Shift layout margins so contents do not overlap with top/left accent lines
            anchors.leftMargin: (root.variant === "accent" && root.accentPosition === "left") ? 4 : 0
            anchors.topMargin: (root.variant === "accent" && root.accentPosition === "top") ? 4 : 0

            // 1. Header Block
            Item {
                id: headerWrapper
                width: parent.width
                height: root.header.length > 0 
                    ? customHeaderContainer.childrenRect.height 
                    : (root.title !== "" ? (defaultHeaderRow.implicitHeight + Theme.spacing.md * 2) : 0)
                visible: root.header.length > 0 || root.title !== ""

                // Custom Header Slot
                Item {
                    id: customHeaderContainer
                    width: parent.width
                    height: childrenRect.height
                    visible: root.header.length > 0

                    Component.onCompleted: {
                        for (var i = 0; i < root.header.length; i++) {
                            root.header[i].parent = customHeaderContainer;
                        }
                    }
                }

                // Default Header Layout
                Item {
                    id: defaultHeaderContainer
                    anchors.fill: parent
                    visible: root.header.length === 0

                    Row {
                        id: defaultHeaderRow
                        spacing: Theme.spacing.md
                        anchors.verticalCenter: parent.verticalCenter
                        anchors.left: parent.left
                        anchors.leftMargin: Theme.spacing.lg
                        anchors.right: parent.right
                        anchors.rightMargin: Theme.spacing.lg

                        LucideIcon {
                            name: root.icon
                            size: 24
                            color: root.finalAccentColor
                            visible: root.icon !== ""
                            anchors.verticalCenter: parent.verticalCenter
                        }

                        Column {
                            spacing: Theme.spacing.xs
                            anchors.verticalCenter: parent.verticalCenter

                            Text {
                                text: root.title
                                font.family: Theme.typography.familyBold
                                font.pixelSize: Theme.typography.sizeLg
                                color: root.finalTextColor
                                visible: root.title !== ""
                                antialiasing: true
                            }
                            Text {
                                text: root.subtitle
                                font.family: Theme.typography.family
                                font.pixelSize: Theme.typography.sizeSm
                                color: Theme.colors.subtext0
                                visible: root.subtitle !== ""
                                antialiasing: true
                            }
                        }
                    }
                }
            }

            // Header Separator Line
            Rectangle {
                width: parent.width
                height: 1
                color: Theme.colors.surface0
                visible: headerWrapper.visible && root.headerSeparator
            }

            // 2. Body Block
            Item {
                id: bodyWrapper
                width: parent.width
                height: bodyContainer.childrenRect.height + root.padding * 2

                Item {
                    id: bodyContainer
                    anchors.fill: parent
                    anchors.margins: root.padding
                }
            }

            // Footer Separator Line
            Rectangle {
                width: parent.width
                height: 1
                color: Theme.colors.surface0
                visible: footerWrapper.visible && root.footerSeparator
            }

            // 3. Footer Block
            Item {
                id: footerWrapper
                width: parent.width
                height: root.footer.length > 0 ? (customFooterContainer.childrenRect.height + Theme.spacing.md * 2) : 0
                visible: root.footer.length > 0

                Item {
                    id: customFooterContainer
                    anchors.left: parent.left
                    anchors.leftMargin: Theme.spacing.lg
                    anchors.right: parent.right
                    anchors.rightMargin: Theme.spacing.lg
                    anchors.top: parent.top
                    anchors.topMargin: Theme.spacing.md
                    height: childrenRect.height

                    Component.onCompleted: {
                        for (var i = 0; i < root.footer.length; i++) {
                            root.footer[i].parent = customFooterContainer;
                        }
                    }
                }
            }
        }
    }
}
