import { Logger } from "@mocha/shared";
import * as fs from "node:fs";
import * as path from "node:path";
import { execSync } from "node:child_process";

const logger = new Logger("package:appimage");

export interface AppImageMeta {
  name: string;
  version: string;
  target: string;
  icon?: string;
  appMeta: {
    description?: string;
    color?: string;
    platforms?: {
      linux?: { categories?: string[]; terminal?: boolean };
    };
  };
}

const LINUXDEPLOY_URL = "https://github.com/linuxdeploy/linuxdeploy/releases/download/continuous/linuxdeploy-x86_64.AppImage";
const LINUXDEPLOY_QT_URL = "https://github.com/linuxdeploy/linuxdeploy-plugin-qt/releases/download/continuous/linuxdeploy-plugin-qt-x86_64.AppImage";

function findTool(name: string): string | null {
  try {
    return execSync(`which "${name}"`, { encoding: "utf-8" }).trim();
  } catch {
    try {
      // also try local .AppImage in cwd or /tmp
      const candidates = [
        `./${name}-x86_64.AppImage`,
        `/tmp/${name}-x86_64.AppImage`,
      ];
      for (const c of candidates) {
        if (fs.existsSync(c)) return c;
      }
    } catch {}
  }
  return null;
}

export function packageAppImage(distDir: string, meta: AppImageMeta): void {
  const sanitize = (s: string) => s.replace(/[^a-zA-Z0-9._-]/g, "-").toLowerCase();
  const pkgName = sanitize(meta.name);

  logger.info(`[appimage] Packaging ${pkgName} ${meta.version}`);

  const appDir = fs.existsSync(distDir) ? distDir : path.resolve(process.cwd(), distDir);
  if (!fs.existsSync(appDir)) {
    logger.error(`[appimage] Build output not found: ${appDir}`);
    return;
  }

  const appImageDir = path.resolve(distDir, "..", "AppDir");
  fs.rmSync(appImageDir, { recursive: true, force: true });
  const usrBin = path.join(appImageDir, "usr", "bin");
  const usrLib = path.join(appImageDir, "usr", "lib", pkgName);
  fs.mkdirSync(usrBin, { recursive: true });
  fs.mkdirSync(usrLib, { recursive: true });

  for (const entry of fs.readdirSync(appDir)) {
    const src = path.join(appDir, entry);
    const dest = path.join(usrLib, entry);
    if (fs.statSync(src).isFile()) {
      fs.copyFileSync(src, dest);
    }
  }

  // node_modules for @mocha/native resolution
  const nativePkgDir = findNativePackageDir();
  if (nativePkgDir) {
    const nodeModulesNative = path.join(usrLib, "node_modules", "@mocha", "native");
    fs.mkdirSync(nodeModulesNative, { recursive: true });
    const nativeLibFiles = ["package.json", "index.js", "native.d.ts", "index.d.ts"];
    for (const f of nativeLibFiles) {
      const src = path.join(nativePkgDir, f);
      if (fs.existsSync(src)) fs.copyFileSync(src, path.join(nodeModulesNative, f));
    }
    for (const f of fs.readdirSync(nativePkgDir)) {
      if (f.startsWith("mocha-native") && f.endsWith(".node")) {
        fs.copyFileSync(path.join(nativePkgDir, f), path.join(nodeModulesNative, f));
      }
    }
    logger.info(`[appimage] Native module: ${nodeModulesNative}`);
  }

  const appRun = [
    "#!/usr/bin/env sh",
    'APPDIR="$(dirname "$(readlink -f "$0")")"',
    `export NODE_PATH="${"\${APPDIR}"}/usr/lib/${pkgName}"`,
    `exec node "${"\${APPDIR}"}/usr/lib/${pkgName}/app.js" "$@"`,
    "",
  ].join("\n");
  fs.writeFileSync(path.join(appImageDir, "AppRun"), appRun, { mode: 0o755 });

  const linuxPlatform = meta.appMeta?.platforms?.linux;
  const categories = linuxPlatform?.categories?.length
    ? linuxPlatform.categories.join(";") + ";"
    : "Development;";
  const terminal = linuxPlatform?.terminal ?? false;

  const desktop = [
    "[Desktop Entry]",
    `Name=${pkgName}`,
    `Exec=AppRun`,
    "Type=Application",
    `Icon=${pkgName}`,
    `Categories=${categories}`,
    `Terminal=${terminal}`,
    meta.appMeta?.description ? `Comment=${meta.appMeta.description}` : "",
    "",
  ].filter(Boolean).join("\n");
  fs.writeFileSync(path.join(appImageDir, `${pkgName}.desktop`), desktop);

  // icon
  if (meta.icon && fs.existsSync(meta.icon)) {
    const ext = path.extname(meta.icon);
    const destIcon = path.join(appImageDir, `${pkgName}${ext}`);
    fs.copyFileSync(meta.icon, destIcon);
    logger.info(`[appimage] Icon: ${destIcon}`);
  }

  // bundle node binary for standalone
  try {
    const nodeBin = execSync("which node", { encoding: "utf-8" }).trim();
    if (nodeBin && fs.existsSync(nodeBin)) {
      fs.copyFileSync(nodeBin, path.join(appImageDir, "usr", "bin", "node"));
      fs.chmodSync(path.join(appImageDir, "usr", "bin", "node"), 0o755);
      logger.info(`[appimage] Bundled Node.js: ${nodeBin}`);
    }
  } catch {
    logger.warn("[appimage] Node.js not found — AppImage will need system Node.js");
  }

  const outFile = path.resolve(distDir, "..", `${pkgName}-${meta.version}-x86_64.AppImage`);

  const ld = findTool("linuxdeploy");
  if (ld) {
    logger.info(`[appimage] Found linuxdeploy at ${ld} — running...`);
    try {
      const ldCmd = ld.endsWith(".AppImage") ? ld : "linuxdeploy";
      execSync(`${ldCmd} --appdir "${appImageDir}" --output appimage`, {
        stdio: "inherit",
        env: { ...process.env, NO_STRIP: "1", OUTPUT: outFile },
      });
      logger.info(`[appimage] Package created: ${outFile}`);
      return;
    } catch (err: any) {
      logger.warn(`[appimage] linuxdeploy failed: ${err?.message || err}`);
    }
  }

  logger.info(`[appimage] AppDir prepared at ${appImageDir}`);
  logger.info(`[appimage] linuxdeploy not in PATH. Install it:`);
  logger.info(`[appimage]   wget -O /tmp/linuxdeploy.AppImage ${LINUXDEPLOY_URL}`);
  logger.info(`[appimage]   chmod +x /tmp/linuxdeploy.AppImage`);
  logger.info(`[appimage]   /tmp/linuxdeploy.AppImage --appdir "${appImageDir}" --output appimage`);
  logger.info(`[appimage] Output would be: ${outFile}`);
}

function findNativePackageDir(): string | null {
  const candidates = [
    path.resolve(process.cwd(), "node_modules", "@mocha", "native"),
    path.resolve(process.cwd(), "..", "packages", "native"),
    path.resolve(process.cwd(), "packages", "native"),
  ];
  for (const c of candidates) {
    if (fs.existsSync(c)) return c;
  }
  return null;
}

function copyDir(src: string, dest: string): void {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else if (entry.isSymbolicLink()) {
      try { fs.symlinkSync(fs.readlinkSync(srcPath), destPath); } catch {}
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}
