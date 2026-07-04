import QtQuick

Modal {
    id: root

    property string dialogType: "info"
    property string dialogTitle: ""
    property string dialogMessage: ""
    property string confirmLabel: "Confirmar"
    property string cancelLabel: "Cancelar"
    property bool showCancel: true

    signal confirmed()
    signal cancelled()

    title: ""
    size: "sm"
    customWidth: 420
    closeOnBackdropClick: true
    closeOnEscape: true

    readonly property color accentColor: {
        if (dialogType === "success") return Theme.colors.green;
        if (dialogType === "warning") return Theme.colors.yellow;
        if (dialogType === "error") return Theme.colors.danger;
        return Theme.colors.primary;
    }

    readonly property string typeIcon: {
        if (dialogType === "success") return "check-circle";
        if (dialogType === "warning") return "alert-triangle";
        if (dialogType === "error") return "alert-circle";
        return "info";
    }

    content: [
        Column {
            width: dialogContent.width
            spacing: Theme.spacing.md

            Row {
                spacing: Theme.spacing.md
                width: parent.width

                LucideIcon {
                    name: root.typeIcon
                    size: 28
                    color: root.accentColor
                    anchors.verticalCenter: parent.verticalCenter
                }

                Column {
                    spacing: Theme.spacing.xs
                    width: parent.width - 28 - Theme.spacing.md

                    Text {
                        text: root.dialogTitle
                        font.family: Theme.typography.familyBold
                        font.pixelSize: Theme.typography.sizeLg
                        color: Theme.colors.text
                        width: parent.width
                        wrapMode: Text.WordWrap
                        antialiasing: true
                    }

                    Text {
                        text: root.dialogMessage
                        font.family: Theme.typography.family
                        font.pixelSize: Theme.typography.sizeMd
                        color: Theme.colors.subtext0
                        width: parent.width
                        wrapMode: Text.WordWrap
                        antialiasing: true
                    }
                }
            }
        }
    ]

    footer: [
        Row {
            width: parent ? parent.width : 0
            spacing: Theme.spacing.md
            layoutDirection: Qt.RightToLeft

            Button {
                variant: root.accentColor === Theme.colors.danger ? "danger" : "primary"
                text: root.confirmLabel
                onClicked: {
                    root.confirmed();
                    root.close();
                }
            }

            Button {
                variant: "ghost"
                text: root.cancelLabel
                visible: root.showCancel
                onClicked: {
                    root.cancelled();
                    root.close();
                }
            }
        }
    ]

    onClosed: {
        if (!root.showCancel) {
            root.confirmed();
        }
    }
}
