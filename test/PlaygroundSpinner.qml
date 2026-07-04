import QtQuick
import QtQuick.Layouts
import QtQuick.Controls
import ".." as DS

Playground {
    id: pg
    title: "Spinner"
    description: "Indicador de carregamento animado e minimalista."

    componentItem: [
        DS.CozySpinner {
            anchors.centerIn: parent
            size: sizeSelect.model[sizeSelect.currentIndex] === "sm" ? 24 : (sizeSelect.model[sizeSelect.currentIndex] === "md" ? 48 : 64)
            color: colorSelect.model[colorSelect.currentIndex]
        }
    ]

    controls: [
        PlaygroundCtrlSelect {
            id: colorSelect
            label: "Cor"
            model: ["mauve", "blue", "green", "yellow", "red", "peach", "teal"]
            currentIndex: 0
        },
        PlaygroundCtrlSelect {
            id: sizeSelect
            label: "Tamanho"
            model: ["sm", "md", "lg"]
            currentIndex: 1
        }
    ]
}
