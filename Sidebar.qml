import QtQuick

Item {
    id: root

    // ==========================================
    // Public API (Properties)
    // ==========================================
    
    // Layout variant: "fixed" | "floated"
    property string variant: "fixed"

    // Collapse state
    property bool isCollapsed: false

    // Expand on hover when collapsed
    property bool expandOnHover: false

    // Dimensions
    property real collapsedWidth: 68
    property real expandedWidth: 260

    // List of children components (Header, Section, Footer)
    default property list<Item> content

    // ==========================================
    // Internal State and Animation
    // ==========================================
    
    // Expose layout parameters to children
    readonly property bool isHovered: hoverHandler.hovered
    readonly property bool isFullyExpanded: !isCollapsed || (expandOnHover && isHovered)
    readonly property real targetWidth: isFullyExpanded ? expandedWidth : collapsedWidth
    
    // Expose the current animated visual width for children to bind to
    property real currentWidth: targetWidth
    Behavior on currentWidth {
        NumberAnimation { duration: 250; easing.type: Easing.InOutQuad }
    }

    // Set implicit sizes
    implicitWidth: isCollapsed ? collapsedWidth : expandedWidth
    implicitHeight: 600

    // Root logical width is fixed to layout state to prevent pushing siblings on hover
    width: isCollapsed ? collapsedWidth : expandedWidth
    height: implicitHeight

    // Hover handler to detect hover expansion
    HoverHandler {
        id: hoverHandler
        enabled: root.isCollapsed && root.expandOnHover
    }

    // ==========================================
    // Visual Tree
    // ==========================================

    // Shadow Layer (only for floated variant)
    Rectangle {
        id: shadowEffect
        anchors.fill: bgRect
        anchors.margins: -4
        radius: bgRect.radius + 4
        color: "transparent"
        border.color: Qt.rgba(0, 0, 0, 0.15)
        border.width: 4
        visible: root.variant === "floated"
        z: -1
    }

    // Background and container Panel
    Rectangle {
        id: bgRect
        
        // Match the animated visual width
        width: root.currentWidth
        
        // Height adjustments based on variant
        height: root.variant === "floated" ? root.height - Theme.spacing.md * 2 : root.height
        
        anchors.left: parent.left
        anchors.leftMargin: root.variant === "floated" ? Theme.spacing.md : 0
        anchors.verticalCenter: parent.verticalCenter
        
        // Colors & Border based on variant
        color: root.variant === "fixed" ? Theme.colors.crust : Theme.colors.mantle
        
        border.color: Theme.colors.surface0
        border.width: root.variant === "fixed" ? Theme.geometry.borderSm : 0
        
        // Border Radius
        radius: root.variant === "floated" ? Theme.geometry.radiusLg : 0
        
        // Clip content if it is very narrow or during transitions
        clip: true
        z: 10

        // Custom borders layout
        // For fixed layout, we only want the right border, not top/bottom/left.
        // QML's border draws on all sides. We can override by placing a 1px line on the right edge.
        Rectangle {
            id: rightBorder
            width: Theme.geometry.borderSm
            anchors.right: parent.right
            anchors.top: parent.top
            anchors.bottom: parent.bottom
            color: Theme.colors.surface0
            visible: root.variant === "fixed"
        }

        // Layout Containers
        
        // 1. Header Container (Pushed to the top)
        Item {
            id: headerContainer
            width: parent.width
            height: childrenRect.height
            anchors.top: parent.top
            anchors.topMargin: root.variant === "floated" ? Theme.spacing.sm : 0
        }

        // 3. Footer Container (Pushed to the bottom)
        Item {
            id: footerContainer
            width: parent.width
            height: childrenRect.height
            anchors.bottom: parent.bottom
            anchors.bottomMargin: root.variant === "floated" ? Theme.spacing.sm : 0
        }

        // 2. Sections/Scroll Container (Takes remaining space)
        Item {
            id: sectionContainer
            width: parent.width
            anchors.top: headerContainer.bottom
            anchors.bottom: footerContainer.top
            clip: true
        }
    }

    // Dynamic Reparenting of Children
    Component.onCompleted: {
        for (var i = 0; i < content.length; i++) {
            var child = content[i];
            if (child.isSidebarHeader === true) {
                child.parent = headerContainer;
            } else if (child.isSidebarFooter === true) {
                child.parent = footerContainer;
            } else {
                child.parent = sectionContainer;
                // Make sections fill the container width
                child.anchors.left = sectionContainer.left;
                child.anchors.right = sectionContainer.right;
                child.anchors.top = sectionContainer.top;
                child.anchors.bottom = sectionContainer.bottom;
            }
        }
    }
}
