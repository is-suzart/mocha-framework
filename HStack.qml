import QtQuick

Item {
    id: root

    property real spacing: Theme.spacing.md
    property string justifyContent: "start"
    property string alignItems: "center"

    default property alias data: childrenContainer.data

    implicitWidth: _calcImplicitWidth()
    implicitHeight: _calcImplicitHeight()

    function _calcImplicitWidth() {
        var total = 0
        for (var i = 0; i < childrenContainer.children.length; i++) {
            var c = childrenContainer.children[i]
            if (c.visible) total += c.implicitWidth || c.width || 0
        }
        if (childrenContainer.children.length > 1)
            total += root.spacing * (Math.max(0, childrenContainer.children.length - 1))
        return total
    }

    function _calcImplicitHeight() {
        var maxH = 0
        for (var i = 0; i < childrenContainer.children.length; i++) {
            var c = childrenContainer.children[i]
            if (c.visible) {
                var h = c.implicitHeight || c.height || 0
                if (h > maxH) maxH = h
            }
        }
        return maxH
    }

    function relayout() {
        var items = []
        for (var i = 0; i < childrenContainer.children.length; i++) {
            var c = childrenContainer.children[i]
            if (c.visible) items.push(c)
        }

        var n = items.length
        if (n === 0) return

        var totalW = 0
        for (var i = 0; i < n; i++)
            totalW += items[i].implicitWidth || items[i].width || 0

        var totalGap = root.spacing * (n - 1)
        var available = root.width > 0 ? root.width : implicitWidth
        var freeSpace = Math.max(0, available - totalW - totalGap)

        var betweenExtra = 0
        var startX = 0

        if (root.justifyContent === "center") {
            startX = freeSpace / 2
        } else if (root.justifyContent === "end") {
            startX = freeSpace
        } else if (root.justifyContent === "between") {
            betweenExtra = n > 1 ? freeSpace / (n - 1) : 0
        } else if (root.justifyContent === "around") {
            var gap = freeSpace / n
            betweenExtra = gap
            startX = gap / 2
        } else if (root.justifyContent === "evenly") {
            var gap2 = freeSpace / (n + 1)
            betweenExtra = gap2
            startX = gap2
        }

        for (var i = 0; i < n; i++) {
            items[i].x = startX
            var iw = items[i].implicitWidth || items[i].width || 0
            var ih = items[i].implicitHeight || items[i].height || 0

            if (root.alignItems === "center") {
                items[i].y = (root.height - ih) / 2
            } else if (root.alignItems === "end") {
                items[i].y = root.height - ih
            } else if (root.alignItems === "stretch") {
                items[i].y = 0
                items[i].height = root.height
            } else {
                items[i].y = 0
            }

            startX += iw + root.spacing + betweenExtra
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
