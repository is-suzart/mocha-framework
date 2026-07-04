import QtQuick
import QtQuick.Layouts
import QtQuick.Controls
import ".." as DS

Playground {
    id: pg
    title: "Paginator"
    description: "Controles de navegação para conjuntos de dados divididos em páginas."

    componentItem: [
        Column {
            anchors.centerIn: parent
            spacing: DS.Theme.spacing.xl
            
            DS.Paginator {
                totalPages: 10
                currentPage: 1
                onPageChanged: console.log("Página: " + page)
            }
            
            Text {
                text: "Página selecionada simulada no console."
                color: DS.Theme.colors.subtext0
                anchors.horizontalCenter: parent.horizontalCenter
            }
        }
    ]

    controls: [
        Text {
            text: "Componente de paginação padrão."
            color: DS.Theme.colors.subtext0
            font.pixelSize: DS.Theme.typography.sizeMd
        }
    ]
}
