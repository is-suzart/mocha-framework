import QtQuick 2.15

Item {
    id: root

    // ==========================================
    // Public API (Properties)
    // ==========================================

    // Array of tab items: e.g., ["Tab A", "Tab B"] or [{ id: "t1", label: "Tab A", icon: "settings" }]
    property var model: []

    // Index of the active tab
    property int currentIndex: 0

    // Variant style: "line" | "pill" | "segmented" | "card"
    property string variant: "line"

    // Visual customizations (Overrides)
    property color customAccentColor: "transparent"
    property color customTextColor: "transparent"

    // ==========================================
    // Signals
    // ==========================================
    signal tabSelected(int index, string tabId)

    // ==========================================
    // Internal Style Tokens & Helpers
    // ==========================================
    readonly property bool hasCustomAccentColor: customAccentColor.toString() !== "#00000000" && customAccentColor.toString() !== "transparent"
    readonly property bool hasCustomTextColor: customTextColor.toString() !== "#00000000" && customTextColor.toString() !== "transparent"

    readonly property color finalAccentColor: hasCustomAccentColor ? customAccentColor : Theme.colors.primary
    readonly property color finalTextColor: hasCustomTextColor ? customTextColor : Theme.colors.text

    // Segmented tab width helper
    readonly property real segmentedTabWidth: model && model.length > 0 ? (width / model.length) : 0

    // Helper functions to resolve tab item details
    function getLabel(item, index) {
        if (item === undefined || item === null) return "";
        if (typeof item === "string") return item;
        return item.label || "";
    }

    function getId(item, index) {
        if (item === undefined || item === null) return String(index);
        if (typeof item === "string") return item;
        return item.id !== undefined ? String(item.id) : String(index);
    }

    function getIcon(item) {
        if (item === undefined || item === null) return "";
        if (typeof item === "object") {
            return item.icon || "";
        }
        return "";
    }

    // Reference to current active tab visual item
    readonly property Item currentTabItem: (tabRow && currentIndex >= 0 && currentIndex < tabRow.children.length) ? tabRow.children[currentIndex] : null

    // Layout Dimensions
    implicitHeight: 40
    implicitWidth: 300
    width: implicitWidth
    height: implicitHeight

    // Scroll active tab into view when changed
    onCurrentIndexChanged: {
        ensureTabVisible(currentIndex);
    }

    function ensureTabVisible(index) {
        if (!tabRow || index < 0 || index >= tabRow.children.length) return;
        var item = tabRow.children[index];
        if (!item) return;

        var itemLeft = item.x;
        var itemRight = item.x + item.width;

        if (itemLeft < flickable.contentX) {
            flickable.contentX = itemLeft;
        } else if (itemRight > flickable.contentX + flickable.width) {
            flickable.contentX = Math.max(0, itemRight - flickable.width);
        }
    }

    // ==========================================
    // Visual Tree
    // ==========================================

    // Segmented Container Background (unified track behind segmented tabs)
    Rectangle {
        id: segmentedBg
        anchors.fill: parent
        color: Theme.colors.mantle
        border.color: Theme.colors.surface0
        border.width: Theme.geometry.borderSm
        radius: Theme.geometry.radiusMd
        visible: root.variant === "segmented"
        z: 0

        Behavior on color { ColorAnimation { duration: 150 } }
        Behavior on border.color { ColorAnimation { duration: 150 } }
    }

    // Flickable wrapper for horizontal scrolling if tabs exceed width
    Flickable {
        id: flickable
        anchors.fill: parent
        // Inset segmented controls for iOS/macOS styled margins
        anchors.margins: root.variant === "segmented" ? 4 : 0
        contentWidth: tabRow.width
        contentHeight: parent.height - (root.variant === "segmented" ? 8 : 0)
        boundsBehavior: Flickable.StopAtBounds
        clip: true

        // Inner container to hold indicator and row
        Item {
            width: Math.max(flickable.width, tabRow.width)
            height: parent.height

            // 1. Sliding Selection Indicator
            Rectangle {
                id: activeIndicator
                x: root.currentTabItem ? root.currentTabItem.x : 0
                width: root.currentTabItem ? root.currentTabItem.width : 0
                
                // Position and height based on variant
                y: {
                    if (root.variant === "line") return parent.height - 3;
                    if (root.variant === "segmented") return 0;
                    return Theme.spacing.xs; // "pill"
                }
                height: {
                    if (root.variant === "line") return 3;
                    if (root.variant === "segmented") return parent.height;
                    return parent.height - (Theme.spacing.xs * 2); // "pill"
                }
                radius: {
                    if (root.variant === "line") return 0;
                    if (root.variant === "segmented") return Theme.geometry.radiusMd - 2;
                    return Theme.geometry.radiusPill; // "pill"
                }
                
                color: {
                    if (root.variant === "segmented") return Theme.colors.surface0;
                    return root.finalAccentColor; // "line" | "pill"
                }
                border.color: root.variant === "segmented" ? Theme.colors.surface1 : "transparent"
                border.width: root.variant === "segmented" ? Theme.geometry.borderSm : 0
                
                z: root.variant === "pill" || root.variant === "segmented" ? 0 : 2
                visible: root.variant !== "card"

                // Smooth sliding transitions
                Behavior on x {
                    NumberAnimation { duration: 200; easing.type: Easing.OutQuad }
                }
                Behavior on width {
                    NumberAnimation { duration: 200; easing.type: Easing.OutQuad }
                }
                Behavior on y {
                    NumberAnimation { duration: 150 }
                }
                Behavior on height {
                    NumberAnimation { duration: 150 }
                }
                Behavior on color { ColorAnimation { duration: 150 } }
            }

            // 2. Track Line (visible only in line variant)
            Rectangle {
                id: trackLine
                width: parent.width
                height: 1
                anchors.bottom: parent.bottom
                color: Theme.colors.surface0
                visible: root.variant === "line"
                z: 1
            }

            // 3. Tabs Row
            Row {
                id: tabRow
                height: parent.height
                spacing: root.variant === "card" ? Theme.spacing.sm : 0
                z: 1

                Repeater {
                    model: root.model

                    delegate: Item {
                        id: tabItem
                        height: parent.height
                        
                        // Calculate width dynamically or equally for segmented control
                        width: {
                            if (root.variant === "segmented" && root.model.length > 0) {
                                return flickable.width / root.model.length;
                            }
                            return tabContent.implicitWidth + Theme.spacing.lg * 2;
                        }

                        readonly property bool isActive: root.currentIndex === index
                        readonly property bool isHovered: mouseArea.containsMouse

                        // Card variant background
                        Rectangle {
                            id: cardBg
                            anchors.fill: parent
                            visible: root.variant === "card"
                            color: tabItem.isActive ? Theme.colors.base : Theme.colors.mantle
                            border.color: tabItem.isActive ? root.finalAccentColor : Theme.colors.surface0
                            border.width: Theme.geometry.borderSm
                            radius: Theme.geometry.radiusMd

                            Behavior on color { ColorAnimation { duration: 150 } }
                            Behavior on border.color { ColorAnimation { duration: 150 } }
                        }

                        Row {
                            id: tabContent
                            spacing: Theme.spacing.sm
                            anchors.centerIn: parent

                            // Optional Left Icon
                            LucideIcon {
                                name: root.getIcon(modelData)
                                size: 16
                                color: {
                                    if (tabItem.isActive) {
                                        if (root.variant === "pill") return Theme.colors.crust;
                                        return root.finalAccentColor;
                                    }
                                    return tabItem.isHovered ? root.finalTextColor : Theme.colors.subtext0;
                                }
                                visible: name !== ""
                                anchors.verticalCenter: parent.verticalCenter
                                Behavior on color { ColorAnimation { duration: 150 } }
                            }

                            // Tab Label Text
                            Text {
                                text: root.getLabel(modelData, index)
                                font.family: tabItem.isActive ? Theme.typography.familyBold : Theme.typography.family
                                font.pixelSize: Theme.typography.sizeMd
                                color: {
                                    if (tabItem.isActive) {
                                        if (root.variant === "pill") return Theme.colors.crust;
                                        return root.finalAccentColor;
                                    }
                                    return tabItem.isHovered ? root.finalTextColor : Theme.colors.subtext0;
                                }
                                anchors.verticalCenter: parent.verticalCenter
                                antialiasing: true
                                Behavior on color { ColorAnimation { duration: 150 } }
                            }
                        }

                        // Tab click area
                        MouseArea {
                            id: mouseArea
                            anchors.fill: parent
                            hoverEnabled: true
                            cursorShape: Qt.PointingHandCursor
                            onClicked: {
                                root.currentIndex = index;
                                root.tabSelected(index, root.getId(modelData, index));
                            }
                        }
                    }
                }
            }
        }
    }
}
