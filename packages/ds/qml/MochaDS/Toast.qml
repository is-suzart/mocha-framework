import QtQuick 2.15

Item {
    id: root

    // ==========================================
    // Public API (Properties)
    // ==========================================
    property string title: ""
    property string message: ""
    property string type: "info" // "info" | "success" | "warning" | "error"
    property int duration: 3000  // Auto-dismiss timeout (ms)
    property bool showClose: true

    // Signals
    signal dismissed()

    // =============================q=============
    // Internal States & Helpers
    // ==========================================
    property int remainingTime: duration

    readonly property color accentColor: {
        if (type === "success") return Theme.colors.green;
        if (type === "error") return Theme.colors.danger;
        if (type === "warning") return Theme.colors.yellow;
        return Theme.colors.info;
    }

    readonly property string typeIcon: {
        if (type === "success") return "check-circle";
        if (type === "error") return "alert-circle";
        if (type === "warning") return "alert-triangle";
        return "info";
    }

    // Layout Dimensions
    width: 320
    height: bgRect.implicitHeight
    implicitWidth: width
    implicitHeight: height

    // Start invisible for entry animation
    opacity: 0.0
    scale: hoverHandler.hovered ? 1.01 : 1.0

    Behavior on scale {
        NumberAnimation { duration: 120; easing.type: Easing.OutCubic }
    }

    // ==========================================
    // Visual Tree
    // ==========================================
    Rectangle {
        id: bgRect
        width: parent.width
        implicitHeight: contentLayout.implicitHeight + Theme.spacing.md * 2
        color: Theme.colors.mantle
        radius: Theme.geometry.radiusMd
        border.color: root.accentColor
        border.width: Theme.geometry.borderSm

        clip: true

        // Subtle shadow layer for card depth
        Rectangle {
            anchors.fill: parent
            color: "transparent"
            radius: parent.radius
            border.color: Qt.rgba(0, 0, 0, 0.15)
            border.width: 1
            z: -1
        }

        // Horizontal Row content
        Row {
            id: contentLayout
            width: parent.width - Theme.spacing.md * 2
            anchors.centerIn: parent
            spacing: Theme.spacing.md

            // Left Type Icon
            LucideIcon {
                name: root.typeIcon
                size: 20
                color: root.accentColor
                anchors.verticalCenter: parent.verticalCenter
            }

            // Center Text Column
            Column {
                width: parent.width - 20 - 16 - (Theme.spacing.md * 2) // fits icon + close button
                spacing: Theme.spacing.xs
                anchors.verticalCenter: parent.verticalCenter

                // Toast Title
                Text {
                    text: {
                        if (root.title !== "") return root.title;
                        if (root.type === "success") return "Sucesso";
                        if (root.type === "error") return "Erro";
                        if (root.type === "warning") return "Atenção";
                        return "Informação";
                    }
                    font.family: Theme.typography.familyBold
                    font.pixelSize: Theme.typography.sizeSm
                    color: Theme.colors.subtext1
                    visible: text !== ""
                    width: parent.width
                    elide: Text.ElideRight
                    antialiasing: true
                }

                // Toast Message
                Text {
                    text: root.message
                    font.family: Theme.typography.family
                    font.pixelSize: Theme.typography.sizeSm
                    color: Theme.colors.text
                    width: parent.width
                    wrapMode: Text.WordWrap
                    antialiasing: true
                }
            }

            // Right Close Button
            LucideIcon {
                id: closeIcon
                name: "x"
                size: 16
                color: closeMouseArea.containsMouse ? Theme.colors.text : Theme.colors.overlay0
                visible: root.showClose
                anchors.verticalCenter: parent.verticalCenter
                scale: closeMouseArea.pressed ? 0.92 : (closeMouseArea.containsMouse ? 1.08 : 1.0)

                Behavior on color { ColorAnimation { duration: 120 } }
                Behavior on scale { NumberAnimation { duration: 100; easing.type: Easing.OutCubic } }

                MouseArea {
                    id: closeMouseArea
                    anchors.fill: parent
                    hoverEnabled: true
                    onClicked: root.dismiss()
                }
            }
        }

        // Bottom progress indicator bar
        Rectangle {
            id: progressBar
            height: 3
            color: root.accentColor
            // width calculates progress but respects the side radius margins
            width: Math.max(0, (parent.width - (Theme.geometry.radiusMd * 2)) * (root.remainingTime / root.duration))
            anchors.bottom: parent.bottom
            anchors.bottomMargin: Theme.geometry.borderSm // floats just above the bottom border
            x: Theme.geometry.radiusMd // starts after the left rounded corner
            radius: 1.5

            Behavior on width {
                NumberAnimation { duration: 80; easing.type: Easing.Linear }
            }
        }
    }

    // Hover handler to pause timer and progress countdown
    HoverHandler {
        id: hoverHandler
        onHoveredChanged: {
            countdownTimer.running = !hovered
        }
    }

    // ==========================================
    // Timers & Animations
    // ==========================================
    
    // Countdown clock (ticking every 50ms)
    Timer {
        id: countdownTimer
        interval: 50
        repeat: true
        running: true
        onTriggered: {
            root.remainingTime -= 50;
            if (root.remainingTime <= 0) {
                running = false;
                root.dismiss();
            }
        }
    }

    // Visual transitions
    Component.onCompleted: {
        bgRect.x = 120; // slide in from right offset
        entryAnim.start();
    }

    ParallelAnimation {
        id: entryAnim
        NumberAnimation { target: bgRect; property: "x"; to: 0; duration: 250; easing.type: Easing.OutCubic }
        NumberAnimation { target: root; property: "opacity"; from: 0.0; to: 1.0; duration: 250 }
    }

    // Trigger graceful slide-out exit
    function dismiss() {
        countdownTimer.running = false;
        exitAnim.start();
    }

    ParallelAnimation {
        id: exitAnim
        NumberAnimation { target: bgRect; property: "x"; to: 350; duration: 220; easing.type: Easing.InCubic }
        NumberAnimation { target: root; property: "opacity"; to: 0.0; duration: 220 }
        onStopped: {
            root.dismissed(); // notify manager to destroy
        }
    }
}
