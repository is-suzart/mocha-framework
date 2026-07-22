import { Logger } from "@mocha/shared";
import * as fs from "node:fs";
import * as path from "node:path";
import { execSync } from "node:child_process";

const logger = new Logger("package:deb");

export interface DebMeta {
  name: string;
  version: string;
  target: string;
  icon?: string;
  appMeta: {
    name?: string;
    description?: string;
    platforms?: {
      linux?: { categories?: string[] };
    };
  };
}

export function packageDeb(distDir: string, meta: DebMeta): void {
  const sanitize = (s: string) => s.replace(/[^a-zA-Z0-9._-]/g, "-").toLowerCase();
  const pkgName = sanitize(meta.name);
  const fullVersion = meta.version;
  const arch = detectArch();
  const appName = meta.appMeta?.name || pkgName;
  const description = meta.appMeta?.description || `${appName} — built with Mocha Framework`;
  const section = meta.appMeta?.platforms?.linux?.categories?.[0]?.toLowerCase() || "devel";

  const debRoot = path.resolve(distDir, "..", "deb");
  const pkgDir = path.join(debRoot, pkgName);

  logger.info(`[deb] Packaging ${pkgName} ${fullVersion} (${arch})`);

  const appDir = fs.existsSync(distDir) ? distDir : path.resolve(process.cwd(), distDir);
  if (!fs.existsSync(appDir)) {
    logger.error(`[deb] Build output not found: ${appDir}`);
    return;
  }

  const targetDir = path.join(pkgDir, "usr", "lib", pkgName);
  fs.mkdirSync(targetDir, { recursive: true });
  fs.mkdirSync(path.join(pkgDir, "usr", "bin"), { recursive: true });

  for (const entry of fs.readdirSync(appDir)) {
    const src = path.join(appDir, entry);
    const dest = path.join(targetDir, entry);
    if (fs.statSync(src).isFile()) {
      fs.copyFileSync(src, dest);
    }
  }

  const wrapperPath = path.join(pkgDir, "usr", "bin", pkgName);
  const wrapperScript = [
    "#!/usr/bin/env sh",
    `NODE_PATH=/usr/lib/${pkgName} exec node /usr/lib/${pkgName}/app.js "$@"`,
    "",
  ].join("\n");
  fs.writeFileSync(wrapperPath, wrapperScript, { mode: 0o755 });
  logger.info(`[deb] Wrapper: /usr/bin/${pkgName}`);

  const controlDir = path.join(pkgDir, "DEBIAN");
  fs.mkdirSync(controlDir, { recursive: true });

  const control = [
    `Package: ${pkgName}`,
    `Version: ${fullVersion}`,
    `Architecture: ${arch}`,
    `Section: ${section}`,
    `Maintainer: mocha <mocha@localhost>`,
    `Depends: nodejs (>= 18)`,
    `Description: ${appName}`,
    ` ${description}`,
    "",
  ].join("\n");
  fs.writeFileSync(path.join(controlDir, "control"), control);
  logger.info(`[deb] DEBIAN/control written`);

  try {
    const debFile = path.resolve(debRoot, `${pkgName}_${fullVersion}_${arch}.deb`);
    execSync(`dpkg-deb --build "${pkgDir}" "${debFile}"`, { stdio: "pipe" });
    logger.info(`[deb] Package created: ${debFile}`);
  } catch (err: any) {
    const stderr = err?.stderr?.toString() || err?.message || String(err);
    logger.error(`[deb] dpkg-deb failed: ${stderr}`);
    logger.info(`[deb] To build manually: dpkg-deb --build "${pkgDir}"`);
  }
}

function detectArch(): string {
  switch (process.arch) {
    case "x64": return "amd64";
    case "arm64": return "arm64";
    case "ia32": return "i386";
    default: return process.arch;
  }
}
