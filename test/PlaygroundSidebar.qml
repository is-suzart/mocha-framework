import QtQuick
import QtQuick.Layouts
import ".."

Playground {
    id: pg
    title: "Sidebar"
    description: "Menu de navegação lateral principal para aplicações complexas."

    componentItem: [
        Rectangle {
            width: 240
            height: 500
            anchors.centerIn: parent
            color: Theme.colors.mantle
            border.color: Theme.colors.surface0
            border.width: 1
            
            Sidebar {
                anchors.fill: parent
                
                SidebarHeader {
                    title: "Mocha Console"
                    subtitle: "v1.2.0"
                    logoIcon: "coffee"
                }
                
                Column {
                    width: parent.width
                    spacing: 2
                    
                    Item { width: parent.width; height: 16; Text { text: "PRINCIPAL"; color: Theme.colors.subtext0; font.pixelSize: Theme.typography.sizeXs; anchors.verticalCenter: parent.verticalCenter; anchors.left: parent.left; anchors.leftMargin: Theme.spacing.sm } }
                    SidebarItem { label: "Dashboard"; icon: "layout"; isActive: true }
                    SidebarItem { label: "Projetos"; icon: "folder" }
                    SidebarItem { label: "Tarefas"; icon: "check-square" }
                    
                    Item { width: parent.width; height: 16; Text { text: "SISTEMA"; color: Theme.colors.subtext0; font.pixelSize: Theme.typography.sizeXs; anchors.verticalCenter: parent.verticalCenter; anchors.left: parent.left; anchors.leftMargin: Theme.spacing.sm } }
                    SidebarItem { label: "Configurações"; icon: "settings" }
                    SidebarItem { label: "Usuários"; icon: "users" }
                }
                
                SidebarFooter {
                    username: "Admin"
                    email: "admin@mocha.io"
                    avatarIcon: "log-out"
                }
            }
        }
    ]

    controls: [
        Text {
            text: "Exemplo de uma sidebar estruturada com cabeçalho e rodapé."
            color: Theme.colors.subtext0
            font.pixelSize: Theme.typography.sizeMd
            width: parent.width
            wrapMode: Text.WordWrap
        }
    ]
}
