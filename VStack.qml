import QtQuick

Item {
    id: root

    property real spacing: Theme.spacing.md
    property string justifyContent: "start"
    property string alignItems: "stretch"

    default property alias data: childrenContainer.data

    implicitWidth: _calcImplicitWidth()
    implicitHeight: _calcImplicitHeight()

    function _calcImplicitWidth() {
        var maxW = 0
        for (var i = 0; i < childrenContainer.children.length; i++) {
            var c = childrenContainer.children[i]
            if (c.visible) {
                var w = c.implicitWidth || c.width || 0
                if (w > maxW) maxW = w
            }
        }
        return maxW
    }

    function _calcImplicitHeight() {
        var total = 0
        for (var i = 0; i < childrenContainer.children.length; i++) {
            var c = childrenContainer.children[i]
            if (c.visible) total += c.implicitHeight || c.height || 0
        }
        if (childrenContainer.children.length > 1)
            total += root.spacing * (Math.max(0, childrenContainer.children.length - 1))
        return total
    }

    function relayout() {
        var items = []
        for (var i = 0; i < childrenContainer.children.length; i++) {
            var c = childrenContainer.children[i]
            if (c.visible) items.push(c)
        }

        var n = items.length
        if (n === 0) return

        var totalH = 0
        for (var i = 0; i < n; i++)
            totalH += items[i].implicitHeight || items[i].height || 0

        var totalGap = root.spacing * (n - 1)
        var available = root.height > 0 ? root.height : implicitHeight
        var freeSpace = Math.max(0, available - totalH - totalGap)

        var betweenExtra = 0
        var startY = 0

        if (root.justifyContent === "center") {
            startY = freeSpace / 2
        } else if (root.justifyContent === "end") {
            startY = freeSpace
        } else if (root.justifyContent === "between") {
            betweenExtra = n > 1 ? freeSpace / (n - 1) : 0
        } else if (root.justifyContent === "around") {
            var gap = freeSpace / n
            betweenExtra = gap
            startY = gap / 2
        } else if (root.justifyContent === "evenly") {
            var gap2 = freeSpace / (n + 1)
            betweenExtra = gap2
            startY = gap2
        }

        for (var i = 0; i < n; i++) {
            items[i].y = startY
            var ih = items[i].implicitHeight || items[i].height || 0
            var iw = items[i].implicitWidth || items[i].width || 0

            if (root.alignItems === "center") {
                items[i].x = (root.width - iw) / 2
            } else if (root.alignItems === "end") {
                items[i].x = root.width - iw
            } else if (root.alignItems === "stretch") {
                items[i].x = 0
                items[i].width = root.width
            } else {
                items[i].x = 0
            }

            startY += ih + root.spacing + betweenExtra
        }
    }

    onWidthChanged: Qt.callLater(relayout)
    onHeightChanged: Qt.callLater(relayout)
    onJustifyContentChanged: Qt.callLater(relayout)
    onAlignItemsChanged: Qt.callLater(relayout)
    onSpacingChanged: Qt.callLater(relayout)

    Item {
        id: childrenContainer
        anchors.fill: parent
        onChildrenChanged: Qt.callLater(root.relayout)
    }

    Component.onCompleted: Qt.callLater(relayout)
}
