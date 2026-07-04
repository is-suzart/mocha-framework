import QtQuick
import QtQuick.Layouts

GridLayout {
    id: root

    property string direction: "horizontal"
    property real spacing: Theme.spacing.md
    property string justifyContent: "start"
    property string alignItems: "center"

    property string horizontalBreakpoint: "md"

    readonly property bool useHorizontal: {
        if (root.direction === "horizontal") return true
        if (root.direction === "vertical") return false
        return false
    }

    columns: useHorizontal ? rowCount : 1
    rowCount: useHorizontal ? 1 : children.length
    columnSpacing: root.spacing
    rowSpacing: root.spacing
    flow: useHorizontal ? GridLayout.LeftToRight : GridLayout.TopToBottom

    Layout.fillWidth: true
    Layout.fillHeight: true

    onChildrenChanged: {
        for (var i = 0; i < children.length; i++) {
            var c = children[i]
            if (useHorizontal) {
                c.Layout.fillWidth = false
                c.Layout.fillHeight = true
            } else {
                c.Layout.fillWidth = true
                c.Layout.fillHeight = false
            }
        }
    }

    Component.onCompleted: {
        for (var i = 0; i < children.length; i++) {
            var c = children[i]
            if (useHorizontal) {
                c.Layout.fillWidth = false
                c.Layout.fillHeight = true
            } else {
                c.Layout.fillWidth = true
                c.Layout.fillHeight = false
            }
        }
    }
}
