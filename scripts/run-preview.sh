#!/bin/bash
# ============================================================
# scripts/run-preview.sh
#
# Launch MochaDS QML preview (qmlscene6).
# The QML module MochaDS lives at packages/ds/qml/MochaDS/.
# ============================================================

set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
QML_IMPORT="$ROOT/packages/ds/qml"
PREVIEW_FILE="$QML_IMPORT/test/preview.qml"

if [ ! -f "$PREVIEW_FILE" ]; then
  echo "❌  Preview file not found: $PREVIEW_FILE"
  exit 1
fi

export QML_XHR_ALLOW_FILE_READ=1

if command -v qmlscene6 &>/dev/null; then
  exec qmlscene6 -I "$QML_IMPORT" "$PREVIEW_FILE" "$@"
elif command -v qmlscene &>/dev/null; then
  exec qmlscene -I "$QML_IMPORT" "$PREVIEW_FILE" "$@"
elif command -v qml6 &>/dev/null; then
  exec qml6 -I "$QML_IMPORT" "$PREVIEW_FILE" "$@"
else
  echo "❌  No QML runtime found (qmlscene6 / qmlscene / qml6)."
  exit 1
fi
