import QtQuick 2.15

Item {
    id: root

    // ==========================================
    // Public API (Properties)
    // ==========================================
    property int currentPage: 1
    property int totalPages: 1
    property bool showGoToPage: false
    property bool disabled: false
    property alias testInput: pageInput


    // Signals
    signal pageChanged(int page)

    // ==========================================
    // Internal Style Tokens & Helpers
    // ==========================================
    readonly property var pagesList: getPagesList(currentPage, totalPages)

    // Confirm state: input is active (focused) or has text
    readonly property bool isConfirmState: !disabled && showGoToPage && (pageInput.activeFocus || pageInput.text !== "")

    // Layout Dimensions
    implicitWidth: layoutRow.implicitWidth
    implicitHeight: layoutRow.implicitHeight
    width: implicitWidth
    height: implicitHeight

    opacity: disabled ? 0.6 : 1.0
    Behavior on opacity { NumberAnimation { duration: 150 } }

    // ==========================================
    // Visual Tree
    // ==========================================
    Row {
        id: layoutRow
        spacing: Theme.spacing.sm
        anchors.verticalCenter: parent.verticalCenter

        // Previous Page Button
        Button {
            icon: "chevron-left"
            size: "sm"
            variant: "outline"
            disabled: root.disabled || root.currentPage <= 1
            anchors.verticalCenter: parent.verticalCenter
            
            onClicked: {
                if (root.currentPage > 1) {
                    root.currentPage--;
                    root.pageChanged(root.currentPage);
                }
            }
        }

        // Pages List (Numbered buttons and ellipses)
        Row {
            spacing: Theme.spacing.xs
            anchors.verticalCenter: parent.verticalCenter

            Repeater {
                model: root.pagesList

                delegate: Item {
                    width: isEllipsis ? 20 : pageButton.implicitWidth
                    height: 32
                    anchors.verticalCenter: parent.verticalCenter
                    
                    readonly property bool isEllipsis: modelData === "..."

                    // Ellipsis text indicator
                    Text {
                        text: "..."
                        font.family: Theme.typography.family
                        font.pixelSize: Theme.typography.sizeMd
                        color: Theme.colors.overlay1
                        anchors.centerIn: parent
                        visible: parent.isEllipsis
                        antialiasing: true
                    }

                    // Numeric Page Button
                    Button {
                        id: pageButton
                        visible: !parent.isEllipsis
                        text: String(modelData)
                        size: "sm"
                        variant: modelData === root.currentPage ? "primary" : "ghost"
                        disabled: root.disabled
                        customRadius: Theme.geometry.radiusSm
                        
                        onClicked: {
                            var p = parseInt(modelData);
                            if (!isNaN(p) && root.currentPage !== p) {
                                root.currentPage = p;
                                root.pageChanged(p);
                            }
                        }
                    }
                }
            }
        }

        // Direct Page Input Field (Optional)
        TextField {
            id: pageInput
            visible: root.showGoToPage
            width: 48
            size: "sm"
            placeholder: "Ir"
            type: "number"
            disabled: root.disabled
            anchors.verticalCenter: parent.verticalCenter
            
            onAccepted: root.confirmJump()
        }

        // Next / Confirm Action Button
        Button {
            icon: root.isConfirmState ? "check" : "chevron-right"
            size: "sm"
            variant: root.isConfirmState ? "primary" : "outline"
            disabled: root.disabled || (!root.isConfirmState && root.currentPage >= root.totalPages)
            anchors.verticalCenter: parent.verticalCenter

            Behavior on variant {
                // Smooth transition when morphing variants
                PropertyAnimation { duration: 150 }
            }

            onClicked: {
                if (root.isConfirmState) {
                    root.confirmJump();
                } else {
                    if (root.currentPage < root.totalPages) {
                        root.currentPage++;
                        root.pageChanged(root.currentPage);
                    }
                }
            }
        }
    }

    // ==========================================
    // Controller Functions
    // ==========================================
    
    function confirmJump() {
        if (pageInput.text === "") {
            root.forceActiveFocus(); // just release focus
            return;
        }
        
        var pageNum = parseInt(pageInput.text);
        if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= totalPages) {
            if (currentPage !== pageNum) {
                currentPage = pageNum;
                pageChanged(currentPage);
            }
            pageInput.text = "";
            pageInput.status = "normal";
            root.forceActiveFocus(); // lose text field focus
        } else {
            // Flash input in validation error status (red border)
            pageInput.status = "error";
        }
    }

    // Truncated page number ranges algorithm
    function getPagesList(current, total) {
        var pages = [];
        if (total <= 0) return pages;
        
        if (total <= 7) {
            for (var i = 1; i <= total; i++) {
                pages.push(i);
            }
        } else {
            pages.push(1);
            var start = Math.max(2, current - 1);
            var end = Math.min(total - 1, current + 1);
            
            if (start > 2) {
                pages.push("...");
            }
            
            for (var i = start; i <= end; i++) {
                pages.push(i);
            }
            
            if (end < total - 1) {
                pages.push("...");
            }
            
            pages.push(total);
        }
        return pages;
    }
}
