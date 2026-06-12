import QtQuick 2.15

Item {
    id: root

    // ==========================================
    // Public API
    // ==========================================
    property string variant: "rectangle" // "rectangle" | "circle"
    property real radius: variant === "circle" ? Math.min(width, height) / 2 : Theme.geometry.radiusSm
    
    // Layout Dimensions
    implicitWidth: 100
    implicitHeight: 20
    width: implicitWidth
    height: implicitHeight

    // Internal shimmer animation coordinate
    property real time: 0.0

    // Animates the shimmer wave position continuously
    NumberAnimation on time {
        from: 0.0
        to: 1.0
        duration: 1500
        loops: Animation.Infinite
        running: root.visible && root.width > 0 && root.height > 0
    }

    // High-performance GPU shader to render shape and shimmer
    ShaderEffect {
        id: shader
        anchors.fill: parent

        // Bind QML properties to GPU Shader Uniforms
        property color baseColor: Theme.colors.surface0
        property color shimmerColor: Theme.colors.surface1
        property real time: root.time
        property real effectWidth: root.width
        property real effectHeight: root.height
        property real radius: root.radius

        fragmentShader: "
            varying highp vec2 qt_TexCoord0;
            uniform lowp float qt_Opacity;
            uniform lowp vec4 baseColor;
            uniform lowp vec4 shimmerColor;
            uniform highp float time;
            uniform highp float effectWidth;
            uniform highp float effectHeight;
            uniform highp float radius;

            // Signed Distance Function for rounded rectangle to achieve perfect AA corners
            float sdRoundRect(vec2 p, vec2 size, float r) {
                vec2 d = abs(p) - size + r;
                return min(max(d.x, d.y), 0.0) + length(max(d, 0.0)) - r;
            }

            void main() {
                // Map texture coordinate [0, 1] to pixel space centered at (0, 0)
                vec2 p = (qt_TexCoord0 - 0.5) * vec2(effectWidth, effectHeight);
                vec2 halfSize = vec2(effectWidth, effectHeight) * 0.5;
                float dist = sdRoundRect(p, halfSize, radius);
                
                // Perform anti-aliasing edge blend
                float alpha = smoothstep(1.0, 0.0, dist);

                // Calculate diagonal shimmer intensity based on time
                // Project UV space to a diagonal line (slope = 0.4)
                float d = qt_TexCoord0.x + qt_TexCoord0.y * 0.4;
                
                // Shift wave center from -0.6 to 1.6 to move across the component
                float center = time * 2.2 - 0.6;
                float distToPeak = abs(d - center);
                float peakWidth = 0.25;
                float intensity = smoothstep(peakWidth, 0.0, distToPeak);

                // Mix base surface color with shimmer color
                vec4 finalColor = mix(baseColor, shimmerColor, intensity);
                gl_FragColor = finalColor * alpha * qt_Opacity;
            }
        "
    }
}
