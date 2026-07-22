import { Logger } from "@mocha/shared";
import * as fs from "node:fs";
import * as path from "node:path";
import { execSync } from "node:child_process";

const logger = new Logger("package:exe");

export interface ExeMeta {
  name: string;
  version: string;
  target: string;
  icon?: string;
  appMeta: {
    description?: string;
  };
}

export function packageExe(distDir: string, meta: ExeMeta): void {
  const sanitize = (s: string) => s.replace(/[^a-zA-Z0-9._-]/g, "-");
  const pkgName = sanitize(meta.name);

  logger.info(`[exe] Packaging ${pkgName} ${meta.version} (portable)`);

  const appDir = fs.existsSync(distDir) ? distDir : path.resolve(process.cwd(), distDir);
  if (!fs.existsSync(appDir)) {
    logger.error(`[exe] Build output not found: ${appDir}`);
    return;
  }

  const winRoot = path.resolve(distDir, "..", `win-${pkgName}`);
  fs.mkdirSync(winRoot, { recursive: true });

  for (const entry of fs.readdirSync(appDir)) {
    const src = path.join(appDir, entry);
    const dest = path.join(winRoot, entry);
    if (fs.statSync(src).isFile()) {
      fs.copyFileSync(src, dest);
    }
  }

  fs.writeFileSync(
    path.join(winRoot, "run.bat"),
    [`@echo off`, `node "%~dp0app.js" %*`, ``].join("\r\n")
  );

  fs.writeFileSync(
    path.join(winRoot, "run.ps1"),
    [
      `# PowerShell launcher for ${pkgName}`,
      `$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path`,
      `node (Join-Path $scriptDir "app.js") $args`,
      ``,
    ].join("\r\n")
  );

  const readme = [
    `${pkgName} v${meta.version}`,
    `========================`,
    ``,
    `Prerequisites: Node.js >= 18 installed on Windows (https://nodejs.org)`,
    ``,
    `To run:`,
    `  1. Double-click run.bat`,
    `  2. Or from PowerShell: .\\run.ps1`,
    `  3. Or from Command Prompt: run.bat`,
    ``,
    `If you get a Qt error, install Qt6 runtime:`,
    `  https://www.qt.io/download-open-source`,
    ``,
  ].join("\r\n");
  fs.writeFileSync(path.join(winRoot, "README.txt"), readme);

  const makeZip = (dir: string, zipPath: string) => {
    try {
      // prefer 7z if available (preserves permissions on Linux)
      execSync(`7z a -tzip "${zipPath}" ./*`, { cwd: dir, stdio: "pipe" });
      return true;
    } catch {
      // fallback to native zip
      try {
        execSync(`zip -r "${zipPath}" .`, { cwd: dir, stdio: "pipe" });
        return true;
      } catch {
        return false;
      }
    }
  };

  const zipPath = path.resolve(distDir, "..", `${pkgName}-${meta.version}-win-x64.zip`);
  if (makeZip(winRoot, zipPath)) {
    logger.info(`[exe] Package created: ${zipPath}`);
  } else {
    logger.warn(`[exe] Could not create zip (install zip or 7z). See: ${winRoot}`);
  }

  logger.info(`[exe] Test on Windows: extract ${path.basename(zipPath)} and run run.bat`);
}
