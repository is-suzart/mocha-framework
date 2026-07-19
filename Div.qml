import QtQuick

Item {
    id: root

    // ── Show / Animate ────────────────────────────────
    property bool show: true
    property bool animate: false

    property string animateIn: "fade"
    property string animateOut: "fade"

    property int durationIn: 300
    property int durationOut: 250

    property real easingInEasing: Easing.OutQuad
    property real easingOutEasing: Easing.InQuad

    property real enterOffset: 24
    property real exitOffset: 24

    property real enterScale: 0.95
    property real exitScale: 0.95

    readonly property bool isAnimating: animate ? (show ? enterSeq.running : exitSeq.running) : false

    // ── Spacing (Box) ──────────────────────────────────
    property var p: undefined
    property var px: undefined
    property var py: undefined
    property var pt: undefined
    property var pr: undefined
    property var pb: undefined
    property var pl: undefined

    property var m: undefined
    property var mx: undefined
    property var my: undefined
    property var mt: undefined
    property var mr: undefined
    property var mb: undefined
    property var ml: undefined

    property string variant: "default"
    property string colorName: ""

    default property alias data: contentArea.data

    // ── Spacing helpers ────────────────────────────────
    function resolveSpacing(val) {
        if (val === undefined || val === null) return 0
        if (typeof val === "number") return val
        if (val === "xs") return Theme.spacing.xs
        if (val === "sm") return Theme.spacing.sm
        if (val === "md") return Theme.spacing.md
        if (val === "lg") return Theme.spacing.lg
        if (val === "xl") return Theme.spacing.xl
        if (val === "xxl") return Theme.spacing.xxl
        return 0
    }

    readonly property real finalPt: pt !== undefined ? resolveSpacing(pt) : (py !== undefined ? resolveSpacing(py) : resolveSpacing(p))
    readonly property real finalPr: pr !== undefined ? resolveSpacing(pr) : (px !== undefined ? resolveSpacing(px) : resolveSpacing(p))
    readonly property real finalPb: pb !== undefined ? resolveSpacing(pb) : (py !== undefined ? resolveSpacing(py) : resolveSpacing(p))
    readonly property real finalPl: pl !== undefined ? resolveSpacing(pl) : (px !== undefined ? resolveSpacing(px) : resolveSpacing(p))

    readonly property real finalMt: mt !== undefined ? resolveSpacing(mt) : (my !== undefined ? resolveSpacing(my) : resolveSpacing(m))
    readonly property real finalMr: mr !== undefined ? resolveSpacing(mr) : (mx !== undefined ? resolveSpacing(mx) : resolveSpacing(m))
    readonly property real finalMb: mb !== undefined ? resolveSpacing(mb) : (my !== undefined ? resolveSpacing(my) : resolveSpacing(m))
    readonly property real finalMl: ml !== undefined ? resolveSpacing(ml) : (mx !== undefined ? resolveSpacing(mx) : resolveSpacing(m))

    // ── Layout ──────────────────────────────────────────
    implicitWidth: contentArea.implicitWidth + finalPl + finalPr + finalMl + finalMr
    implicitHeight: contentArea.implicitHeight + finalPt + finalPb + finalMt + finalMb
    width: implicitWidth
    height: implicitHeight

    visible: animate ? true : show
    clip: animate

    opacity: animate ? (show ? 1 : 0) : 1
    scale: animate ? (show ? 1 : exitScale) : 1
    transformOrigin: Item.Center

    // ── States ──────────────────────────────────────────
    states: [
        State {
            name: "shown"
            when: root.animate && root.show
            PropertyChanges { target: root; opacity: 1 }
            PropertyChanges { target: root; scale: 1 }
            PropertyChanges { target: rootTranslate; y: 0 }
            PropertyChanges { target: rootTranslate; x: 0 }
        },
        State {
            name: "hidden"
            when: root.animate && !root.show
            PropertyChanges { target: root; opacity: 0 }
            PropertyChanges { target: root; scale: root.exitScale }
            PropertyChanges { target: rootTranslate; y: _exitY() }
            PropertyChanges { target: rootTranslate; x: _exitX() }
        }
    ]

    // ── Transitions ─────────────────────────────────────
    transitions: [
        Transition {
            from: "hidden"
            to: "shown"

            SequentialAnimation {
                id: enterSeq

                ScriptAction { script: _prepareEnter() }

                ParallelAnimation {
                    NumberAnimation {
                        target: root; property: "opacity"
                        duration: root.durationIn; easing.type: root.easingInEasing
                    }
                    NumberAnimation {
                        target: root; property: "scale"
                        duration: _useScale(root.animateIn) ? root.durationIn : 0
                        easing.type: root.easingInEasing
                    }
                    NumberAnimation {
                        target: rootTranslate; property: "y"
                        duration: _useSlideY(root.animateIn) ? root.durationIn : 0
                        easing.type: root.easingInEasing
                    }
                    NumberAnimation {
                        target: rootTranslate; property: "x"
                        duration: _useSlideX(root.animateIn) ? root.durationIn : 0
                        easing.type: root.easingInEasing
                    }
                }
            }
        },
        Transition {
            from: "shown"
            to: "hidden"

            SequentialAnimation {
                id: exitSeq

                ParallelAnimation {
                    NumberAnimation {
                        target: root; property: "opacity"
                        duration: root.durationOut; easing.type: root.easingOutEasing
                    }
                    NumberAnimation {
                        target: root; property: "scale"
                        duration: _useScale(root.animateOut) ? root.durationOut : 0
                        easing.type: Easing.InQuad
                    }
                    NumberAnimation {
                        target: rootTranslate; property: "y"
                        duration: _useSlideY(root.animateOut) ? root.durationOut : 0
                        easing.type: Easing.InCubic
                    }
                    NumberAnimation {
                        target: rootTranslate; property: "x"
                        duration: _useSlideX(root.animateOut) ? root.durationOut : 0
                        easing.type: Easing.InCubic
                    }
                }
            }
        }
    ]

    // ── Transform ───────────────────────────────────────
    transform: Translate {
        id: rootTranslate
        x: 0; y: 0
    }

    // ── Box layout: background + content ────────────────
    Rectangle {
        id: backgroundRect
        x: root.finalMl; y: root.finalMt
        width: root.width - root.finalMl - root.finalMr
        height: root.height - root.finalMt - root.finalMb

        color: {
            if (root.colorName && Theme.colors[root.colorName]) return Theme.colors[root.colorName]
            if (root.variant === "surface") return Theme.colors.surface0
            if (root.variant === "elevated") return Theme.colors.mantle
            return "transparent"
        }
        radius: Theme.geometry.radiusMd
        border.color: root.variant === "outline" ? Theme.colors.surface1 : "transparent"
        border.width: root.variant === "outline" ? Theme.geometry.borderSm : 0

        Item {
            id: contentArea
            x: root.finalPl; y: root.finalPt
            width: parent.width - root.finalPl - root.finalPr
            height: parent.height - root.finalPt - root.finalPb
        }
    }

    // ── Animation helpers ───────────────────────────────
    function _useSlideY(type) {
        return type === "slide-up" || type === "slide-down" || type === "all"
    }

    function _useSlideX(type) {
        return type === "slide-left" || type === "slide-right" || type === "all"
    }

    function _useScale(type) {
        return type === "zoom" || type === "bounce" || type === "all"
    }

    function _enterY() {
        if (animateIn === "slide-up") return enterOffset
        if (animateIn === "slide-down") return -enterOffset
        if (animateIn === "all") return enterOffset
        return 0
    }

    function _enterX() {
        if (animateIn === "slide-left") return enterOffset
        if (animateIn === "slide-right") return -enterOffset
        return 0
    }

    function _exitY() {
        if (animateOut === "slide-up") return exitOffset
        if (animateOut === "slide-down") return -exitOffset
        if (animateOut === "all") return exitOffset
        return 0
    }

    function _exitX() {
        if (animateOut === "slide-left") return exitOffset
        if (animateOut === "slide-right") return -exitOffset
        return 0
    }

    function _prepareEnter() {
        rootTranslate.y = _enterY()
        rootTranslate.x = _enterX()
        if (_useScale(animateIn) || _useScale(animateOut)) {
            root.scale = enterScale
        }
    }
}
