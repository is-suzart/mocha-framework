import QtQuick

Item {
    id: root

    // Identifier for NavigationBar child logic
    readonly property bool isNavigationItem: true

    // ==========================================
    // Public API (Properties)
    // ==========================================
    property string iconName: ""
    property string label: ""

    // ==========================================
    // Internal state & parent resolution
    // ==========================================
    readonly property Item navigationBar: {
        var p = parent;
        while (p && !p.isNavigationBar) {
            p = p.parent;
        }
        return p;
    }

    readonly property int index: navigationBar ? navigationBar.itemsList.indexOf(this) : -1
    readonly property bool isActive: navigationBar ? navigationBar.currentIndex === index : false
    readonly property string variant: navigationBar ? navigationBar.variant : "standard"
    readonly property color highlightColor: navigationBar ? navigationBar.highlightColor : Theme.colors.primary

    // Popout animation offset
    readonly property real activeY: (variant === "floating" && isActive) ? -28 : 0

    // ==========================================
    // Lifecycle
    // ==========================================
    Component.onCompleted: {
        if (navigationBar) {
            navigationBar.registerItem(this);
        }
    }

    Component.onDestruction: {
        if (navigationBar) {
            navigationBar.unregisterItem(this);
        }
    }

    // ==========================================
    // Dimensions
    // ==========================================
    implicitHeight: navigationBar ? (navigationBar.variant === "labeled" ? 56 : 40) : 40
    
    // Dynamic width with SpringAnimation Behavior
    width: {
        if (variant === "expanding") {
            return isActive ? (40 + horizontalText.width + (rowLayout.spacing > 0 ? 12 : 0)) : 40
        } else if (variant === "labeled") {
            return 72
        } else {
            return 40
        }
    }
    height: implicitHeight

    // Smooth spring animation on width for expanding pill
    Behavior on width {
        SpringAnimation { spring: 3; damping: 0.2 }
    }

    // Cozy scale micro-animation on hover + press
    scale: mouseArea.pressed ? 0.95 : (mouseArea.containsMouse ? 1.02 : 1.0)
    Behavior on scale { NumberAnimation { duration: 120; easing.type: Easing.OutBack; easing.overshoot: 1.2 } }

    // ==========================================
    // Visual Tree
    // ==========================================

    // 1. Horizontal Layout Container (standard, floating, expanding)
    Item {
        id: horizontalLayoutContainer
        anchors.fill: parent
        visible: root.variant !== "labeled"

        // Active container shifts up on Y (no anchors so Y animation works!)
        Item {
            id: activeContainer
            width: parent.width
            height: parent.height
            x: 0
            y: root.activeY
            
            Behavior on y {
                SpringAnimation { spring: 3.2; damping: 0.55 }
            }

            // Row containing the icon and the text
            Row {
                id: rowLayout
                anchors.centerIn: parent
                spacing: (root.variant === "expanding" && root.isActive) ? 8 : 0
                
                Behavior on spacing {
                    NumberAnimation { duration: 200; easing.type: Easing.InOutQuad }
                }

                LucideIcon {
                    id: horizontalIcon
                    name: root.iconName
                    size: 24
                    color: root.isActive 
                        ? Theme.colors.base 
                        : (mouseArea.containsMouse ? Theme.colors.text : Theme.colors.subtext0)
                    anchors.verticalCenter: parent.verticalCenter
                    
                    Behavior on color { ColorAnimation { duration: 200 } }
                }

                Text {
                    id: horizontalText
                    text: root.label
                    font.family: Theme.typography.familyMedium
                    font.pixelSize: Theme.typography.sizeMd
                    color: Theme.colors.base
                    
                    width: (root.variant === "expanding" && root.isActive) ? implicitWidth : 0
                    clip: true
                    opacity: (root.variant === "expanding" && root.isActive) ? 1.0 : 0.0
                    
                    Behavior on width {
                        NumberAnimation { duration: 200; easing.type: Easing.InOutQuad }
                    }
                    Behavior on opacity {
                        NumberAnimation { duration: 200; easing.type: Easing.InOutQuad }
                    }

                    anchors.verticalCenter: parent.verticalCenter
                    antialiasing: true
                }
            }
        }

        // Active label for floating variant fading in at the bottom
        Text {
            text: root.label
            font.family: Theme.typography.familyMedium
            font.pixelSize: 10
            color: root.highlightColor
            anchors.bottom: parent.bottom
            anchors.bottomMargin: 4
            anchors.horizontalCenter: parent.horizontalCenter
            opacity: (root.variant === "floating" && root.isActive) ? 1.0 : 0.0
            
            Behavior on opacity {
                NumberAnimation { duration: 200 }
            }
        }
    }

    // 2. Vertical Layout Container (labeled)
    Item {
        id: verticalLayoutContainer
        anchors.fill: parent
        visible: root.variant === "labeled"

        Item {
            id: verticalIconWrapper
            width: 40
            height: 40
            anchors.horizontalCenter: parent.horizontalCenter
            y: root.isActive ? 4 : 8

            Behavior on y {
                SpringAnimation { spring: 3; damping: 0.6 }
            }

            LucideIcon {
                id: verticalIcon
                name: root.iconName
                size: 24
                color: root.isActive 
                    ? Theme.colors.base 
                    : (mouseArea.containsMouse ? Theme.colors.text : Theme.colors.subtext0)
                anchors.centerIn: parent
                
                Behavior on color { ColorAnimation { duration: 200 } }
            }
        }

        Text {
            id: verticalText
            text: root.label
            font.family: Theme.typography.familyMedium
            font.pixelSize: 10
            y: root.isActive ? 42 : 48
            opacity: root.isActive ? 1.0 : 0.0
            
            color: root.isActive 
                ? root.highlightColor 
                : (mouseArea.containsMouse ? Theme.colors.text : Theme.colors.subtext0)
            anchors.horizontalCenter: parent.horizontalCenter
            antialiasing: true
            
            Behavior on y {
                SpringAnimation { spring: 3; damping: 0.6 }
            }
            Behavior on opacity {
                NumberAnimation { duration: 200 }
            }
        }
    }

    // ==========================================
    // Mouse Area
    // ==========================================
    MouseArea {
        id: mouseArea
        anchors.fill: parent
        hoverEnabled: true
        cursorShape: Qt.PointingHandCursor
        
        onClicked: {
            if (navigationBar) {
                navigationBar.currentIndex = root.index;
            }
        }
    }
}
