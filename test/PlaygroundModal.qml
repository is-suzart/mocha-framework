import QtQuick
import QtQuick.Layouts
import ".." as DS

Playground {
    id: pg
    title: "Modal"
    description: "Diálogos sobrepostos para fluxos de trabalho que exigem atenção."

    componentItem: [
        Item {
            anchors.fill: parent
            
            DS.Modal {
                id: myModal
                title: titleText.text
                subtitle: subtitleText.text
                open: false
                
                Column {
                    width: parent.width
                    spacing: DS.Theme.spacing.md
                    
                    Text {
                        width: parent.width
                        text: "Conteúdo do modal pode conter formulários, textos ou outros componentes Mocha-DS."
                        color: DS.Theme.colors.text
                        wrapMode: Text.WordWrap
                        font.family: DS.Theme.typography.family
                    }
                    
                    Row {
                        spacing: DS.Theme.spacing.md
                        anchors.right: parent.right
                        DS.Button { text: "Cancelar"; variant: "ghost"; onClicked: myModal.open = false }
                        DS.Button { text: "Confirmar"; variant: "primary"; onClicked: myModal.open = false }
                    }
                }
            }

            DS.Button {
                anchors.centerIn: parent
                text: "Abrir Modal"
                variant: "primary"
                onClicked: myModal.open = true
            }
        }
    ]

    controls: [
        PlaygroundCtrlTextField {
            id: titleText
            label: "Título"
            text: "Confirmação de Ação"
        },
        PlaygroundCtrlTextField {
            id: subtitleText
            label: "Subtítulo"
            text: "Tem certeza que deseja prosseguir?"
        }
    ]
}
