import QtQuick 2.15

Item {
    id: colRoot

    // ==========================================
    // Public API (Properties)
    // ==========================================
    property int span: 12
    property int sm: -1
    property int md: -1
    property int lg: -1

    property int offset: 0
    property int smOffset: -1
    property int mdOffset: -1
    property int lgOffset: -1

    // Internal properties resolved by parent Grid
    property int _resolvedSpan: 12
    property int _resolvedOffset: 0

    // Default container for children
    default property alias content: colRoot.data

    implicitWidth: 100
    implicitHeight: childrenRect.height
    width: implicitWidth
    height: implicitHeight
}
