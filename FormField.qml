import QtQuick

Item {
    id: root

    // ==========================================
    // Public API (Properties)
    // ==========================================
    property string label: ""
    property string description: ""
    property string errorMessage: ""
    property bool required: false
    
    // Status: "normal" | "success" | "error"
    property string status: "normal"

    // Allows embedding the input field directly inside this wrapper
    default property alias content: contentContainer.data

    // ==========================================
    // Layout Dimensions
    // ==========================================
    implicitWidth: 280
    implicitHeight: layoutColumn.implicitHeight
    width: implicitWidth
    height: implicitHeight

    // Stacking order: raise z-index when child input (like Select) is expanded
    z: {
        if (contentContainer.children.length > 0) {
            var child = contentContainer.children[0];
            if (child) {
                if (child.item !== undefined && child.item !== null) {
                    if (child.item.expanded !== undefined && child.item.expanded) {
                        return 100;
                    }
                } else if (child.expanded !== undefined && child.expanded) {
                    return 100;
                }
            }
        }
        return 0;
    }

    // ==========================================
    // Visual Tree
    // ==========================================
    Column {
        id: layoutColumn
        width: parent.width
        spacing: Theme.spacing.xs

        // Label and Required mark
        Row {
            spacing: Theme.spacing.xs
            visible: root.label !== ""
            width: parent.width

            Text {
                text: root.label
                font.family: Theme.typography.familyBold
                font.pixelSize: Theme.typography.sizeSm
                color: Theme.colors.subtext1
                antialiasing: true
            }

            Text {
                text: "*"
                font.family: Theme.typography.familyBold
                font.pixelSize: Theme.typography.sizeSm
                color: Theme.colors.red
                visible: root.required
                antialiasing: true
            }
        }

        // Optional helper description
        Text {
            text: root.description
            font.family: Theme.typography.family
            font.pixelSize: Theme.typography.sizeXs
            color: Theme.colors.overlay1
            visible: root.description !== ""
            width: parent.width
            wrapMode: Text.WordWrap
            antialiasing: true
        }

        // Input control slot container
        Item {
            id: contentContainer
            width: parent.width
            // Calculate height based on child input
            height: children.length > 0 ? children[0].height : 0

        // Forward the width to the child to fill the form field
            onChildrenChanged: {
                if (children.length > 0) {
                    var child = children[0];
                    child.width = Qt.binding(function() { return contentContainer.width; });
                    if (child && child.hasOwnProperty("item") && child.hasOwnProperty("loaded")) {
                        try {
                            child.loaded.disconnect(root.syncChildStatus);
                        } catch (e) {}
                        child.loaded.connect(root.syncChildStatus);
                    }
                    syncChildStatus();
                }
            }
        }

        // Error message row
        Row {
            spacing: Theme.spacing.xs
            visible: root.status === "error" && root.errorMessage !== ""
            width: parent.width

            LucideIcon {
                name: "alert-circle"
                size: 12
                color: Theme.colors.red
                anchors.verticalCenter: parent.verticalCenter
            }

            Text {
                text: root.errorMessage
                font.family: Theme.typography.family
                font.pixelSize: Theme.typography.sizeXs
                color: Theme.colors.red
                width: parent.width - 16
                wrapMode: Text.WordWrap
                verticalAlignment: Text.AlignVCenter
                antialiasing: true
            }
        }
    }

    // ==========================================
    // Status syncing logic
    // ==========================================
    onStatusChanged: {
        syncChildStatus();
    }

    Component.onCompleted: {
        syncChildStatus();
    }

    function syncChildStatus() {
        if (contentContainer.children.length > 0) {
            var child = contentContainer.children[0];
            // If the child is a Loader, target its loaded item
            if (child && child.hasOwnProperty("item")) {
                child = child.item;
            }
            if (child && child.hasOwnProperty("status")) {
                try {
                    child.status = root.status;
                } catch (e) {
                    // Ignore assignment errors
                }
            }
        }
    }
}
