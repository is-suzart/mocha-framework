import QtQuick
import QtQuick.Layouts
import QtQuick.Controls
import ".." as DS

Playground {
    id: pg
    title: "DatePicker"
    description: "Seletor de data com calendário popup e formatação personalizada."

    property var selectedDate: null

    componentItem: [
        Column {
            spacing: DS.Theme.spacing.xl
            anchors.centerIn: parent
            width: 350

            DS.DatePicker {
                width: parent.width
                selectedDate: pg.selectedDate
                placeholder: "Data de nascimento"
                size: sizeSelect.model[sizeSelect.currentIndex]
                onSelectedDateChanged: pg.selectedDate = selectedDate
            }

            Text {
                text: "Data selecionada: " + (pg.selectedDate ? pg.selectedDate.toLocaleDateString() : "---")
                font.family: DS.Theme.typography.family
                font.pixelSize: DS.Theme.typography.sizeSm
                color: DS.Theme.colors.subtext0
                anchors.horizontalCenter: parent.horizontalCenter
            }
        }
    ]

    controls: [
        PlaygroundCtrlSelect {
            id: sizeSelect
            label: "Tamanho"
            model: ["sm", "md", "lg"]
            currentIndex: 1
        }
    ]
}
