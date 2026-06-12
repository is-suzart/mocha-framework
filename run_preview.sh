#!/bin/bash
export QML_XHR_ALLOW_FILE_READ=1
qmlscene /home/savunma/.gemini/antigravity/scratch/mocha-ds/test/preview.qml "$@"
