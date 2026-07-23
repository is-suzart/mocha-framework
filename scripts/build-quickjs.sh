#!/usr/bin/env bash
# build-quickjs.sh — downloads and compiles QuickJS as a static library
# Output: packages/bridge-quickjs/quickjs/ (sources) + libquickjs.a + headers

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
QUICKJS_DIR="$PROJECT_ROOT/packages/bridge-quickjs"
QUICKJS_SRC="$QUICKJS_DIR/quickjs"

QUICKJS_VERSION="2024-01-13"
QUICKJS_URL="https://bellard.org/quickjs/quickjs-${QUICKJS_VERSION}.tar.xz"
QUICKJS_ARCHIVE="$QUICKJS_DIR/quickjs.tar.xz"

# ── Download if not present ──
if [ ! -d "$QUICKJS_SRC" ]; then
  echo "[build-quickjs] Downloading QuickJS ${QUICKJS_VERSION}..."
  if command -v wget &>/dev/null; then
    wget -q --show-progress -O "$QUICKJS_ARCHIVE" "$QUICKJS_URL" || {
      echo "[build-quickjs] wget failed, trying curl..."
      curl -L -o "$QUICKJS_ARCHIVE" "$QUICKJS_URL"
    }
  elif command -v curl &>/dev/null; then
    curl -L -o "$QUICKJS_ARCHIVE" "$QUICKJS_URL"
  else
    echo "[build-quickjs] ERROR: wget or curl required"
    exit 1
  fi

  if [ ! -f "$QUICKJS_ARCHIVE" ] || [ ! -s "$QUICKJS_ARCHIVE" ]; then
    echo "[build-quickjs] ERROR: Failed to download QuickJS"
    exit 1
  fi

  echo "[build-quickjs] Extracting..."
  mkdir -p "$QUICKJS_SRC"
  tar xf "$QUICKJS_ARCHIVE" -C "$QUICKJS_DIR"
  mv "$QUICKJS_DIR/quickjs-${QUICKJS_VERSION}"/* "$QUICKJS_SRC"/ 2>/dev/null || true
  rm -f "$QUICKJS_ARCHIVE"
fi

echo "[build-quickjs] QuickJS source at: $QUICKJS_SRC"

# ── Detect compiler ──
CC="${CC:-gcc}"

echo "[build-quickjs] CC=$CC"

# ── Compile QuickJS as static library ──
QUICKJS_CFLAGS="-O2 -DCONFIG_VERSION=\"\\\"${QUICKJS_VERSION}\\\"\" -DCONFIG_BIGNUM"
QUICKJS_OBJS=""

cd "$QUICKJS_SRC"

for src in quickjs.c libregexp.c libunicode.c cutils.c libbf.c; do
  if [ -f "$src" ]; then
    obj="${src}.o"
    echo "[build-quickjs] Compiling $src..."
    $CC -c $QUICKJS_CFLAGS -I. "$src" -o "$obj"
    QUICKJS_OBJS="$QUICKJS_OBJS $obj"
  else
    echo "[build-quickjs] WARNING: $src not found, skipping"
  fi
done

if [ -z "$QUICKJS_OBJS" ]; then
  echo "[build-quickjs] ERROR: No object files compiled"
  exit 1
fi

# ── Build static library ──
echo "[build-quickjs] Creating libquickjs.a..."
ar rcs "$QUICKJS_DIR/quickjs/libquickjs.a" $QUICKJS_OBJS

# ── Copy headers ──
echo "[build-quickjs] Copying headers..."
for h in quickjs.h libregexp.h libunicode.h cutils.h libbf.h quickjs-libc.h list.h; do
  if [ -f "$h" ]; then
    cp "$h" "$QUICKJS_DIR/quickjs/"
  fi
done

echo "[build-quickjs] Done: libquickjs.a + headers in $QUICKJS_DIR/quickjs/"
ls -la "$QUICKJS_DIR/quickjs/libquickjs.a" "$QUICKJS_DIR/quickjs/quickjs.h"
