import QtQuick 2.15
import QtQuick.Layouts 1.15


Item {
    // ==========================================
    // Visual Tree
    // ==========================================

    id: root

    // ==========================================
    // Public API
    // ==========================================
    property var model: null
    property Component rowContent
    // List visual overrides
    property real spacing: Theme.spacing.sm
    property real paddingLeft: Theme.spacing.xs
    property real paddingRight: Theme.spacing.xs
    property real paddingTop: Theme.spacing.xs
    property real paddingBottom: Theme.spacing.xs
    // Empty State System configuration
    property string emptyStateIcon: "package-open"
    property string emptyStateTitle: "Nenhum item encontrado"
    property string emptyStateSubtitle: ""
    
    // Loading State
    property bool isLoading: false

    // Reactive empty check
    readonly property bool isEmpty: {
        if (root.model === null || root.model === undefined)
            return true;

        // Handle QML ListModels, Javascript arrays, and numeric models
        if (typeof root.model === "number")
            return root.model <= 0;

        if (typeof root.model.count === "number")
            return root.model.count === 0;

        if (typeof root.model.length === "number")
            return root.model.length === 0;

        // Fallback to ListView count check
        return listView.count === 0;
    }

    // Dimensions
    implicitWidth: 350
    implicitHeight: 400
    width: implicitWidth
    height: implicitHeight

    // The Wrapper: ListView
    ListView {
        // Developers can hook into lists or handle list actions

        id: listView

        anchors.fill: parent
        anchors.leftMargin: root.paddingLeft
        anchors.rightMargin: root.paddingRight
        anchors.topMargin: root.paddingTop
        anchors.bottomMargin: root.paddingBottom
        clip: true
        spacing: root.spacing
        model: root.model
        visible: !root.isEmpty && !root.isLoading
        // Performance features
        reuseItems: true

        delegate: InteractiveListCell {
            // Subtract space for the scrollbar if it is visible to prevent overlap
            width: listView.width - (scrollBar.shouldShow ? scrollBar.width : 0)
            rowContent: root.rowContent
            
            // Pass contexts down explicitly
            cellModelData: typeof modelData !== "undefined" ? modelData : (typeof model !== "undefined" ? model : null)
            cellIndex: index
            
            // Selection / Active handling
            isSelected: false
            onClicked: {
            }
        }

    }

    // Skeleton Shimmer Loading State Layout
    ColumnLayout {
        id: skeletonLayout
        anchors.left: parent.left
        anchors.right: parent.right
        anchors.top: parent.top
        anchors.leftMargin: root.paddingLeft
        anchors.rightMargin: root.paddingRight
        anchors.topMargin: root.paddingTop
        spacing: root.spacing
        visible: root.isLoading

        Repeater {
            model: 5
            delegate: Rectangle {
                Layout.fillWidth: true
                height: 56
                color: "transparent"
                radius: Theme.geometry.radiusMd
                border.width: Theme.geometry.borderSm
                border.color: Qt.rgba(Theme.colors.surface0.r, Theme.colors.surface0.g, Theme.colors.surface0.b, 0.2)

                RowLayout {
                    anchors.fill: parent
                    anchors.leftMargin: Theme.spacing.md
                    anchors.rightMargin: Theme.spacing.md
                    spacing: Theme.spacing.md

                    // Icon/Avatar skeleton
                    CozySkeleton {
                        variant: "circle"
                        width: 24
                        height: 24
                    }

                    // Main title skeleton text
                    ColumnLayout {
                        spacing: Theme.spacing.xs
                        Layout.fillWidth: true
                        Layout.alignment: Qt.AlignVCenter

                        CozySkeleton {
                            width: 140
                            height: 14
                        }
                    }

                    // Optional accessory badge/action skeleton
                    CozySkeleton {
                        variant: "circle"
                        width: 18
                        height: 18
                    }
                }
            }
        }
    }

    // ScrollBar
    ScrollBar {
        id: scrollBar

        flickable: listView
        orientation: "vertical"
        anchors.right: parent.right
        anchors.top: parent.top
        anchors.bottom: parent.bottom
        z: 2
        visible: !root.isLoading
    }

    // Empty State System Container
    ColumnLayout {
        id: emptyStateContainer

        anchors.centerIn: parent
        width: Math.min(parent.width - Theme.spacing.xl * 2, 320)
        spacing: Theme.spacing.md
        // Reactive opacity animation
        opacity: (root.isEmpty && !root.isLoading) ? 1 : 0
        visible: opacity > 0

        // Icon (Large, Theme.colors.subtext0)
        LucideIcon {
            name: root.emptyStateIcon
            size: 48
            color: Theme.colors.subtext0
            Layout.alignment: Qt.AlignHCenter
        }

        // Titles layout
        ColumnLayout {
            spacing: Theme.spacing.xs
            Layout.fillWidth: true

            Text {
                text: root.emptyStateTitle
                font.family: Theme.typography.familyBold
                font.pixelSize: Theme.typography.sizeLg
                color: Theme.colors.text
                horizontalAlignment: Text.AlignHCenter
                Layout.fillWidth: true
                wrapMode: Text.WordWrap
                antialiasing: true
            }

            Text {
                text: root.emptyStateSubtitle
                font.family: Theme.typography.family
                font.pixelSize: Theme.typography.sizeSm
                color: Theme.colors.subtext0
                horizontalAlignment: Text.AlignHCenter
                Layout.fillWidth: true
                wrapMode: Text.WordWrap
                visible: text !== ""
                antialiasing: true
            }

        }

        Behavior on opacity {
            NumberAnimation {
                duration: 250
                easing.type: Easing.OutQuad
            }

        }

    }

}
