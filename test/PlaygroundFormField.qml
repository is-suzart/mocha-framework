import QtQuick
import QtQuick.Layouts
import QtQuick.Controls
import ".." as DS

Playground {
    id: pg
    title: "FormField"
    description: "Campo de formulário com label, validação e mensagens de erro."

    componentItem: [
        Column {
            spacing: DS.Theme.spacing.xl
            anchors.centerIn: parent
            width: 350

            DS.FormField {
                width: parent.width
                label: "Nome completo"
                required: true
                DS.TextField { width: parent.width; placeholder: "Digite seu nome" }
            }

            DS.FormField {
                width: parent.width
                label: "Email"
                description: "Usado para login"
                DS.TextField { width: parent.width; placeholder: "email@exemplo.com" }
            }

            DS.FormField {
                width: parent.width
                label: "Senha"
                DS.TextField { width: parent.width; type: "password"; placeholder: "Mínimo 8 caracteres" }
            }

            DS.FormField {
                width: parent.width
                label: "Telefone"
                status: "error"
                errorMessage: "Telefone inválido"
                DS.TextField { width: parent.width; placeholder: "(11) 99999-9999"; status: "error" }
            }
        }
    ]

    controls: []
}
