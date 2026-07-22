import { execSync } from "node:child_process";
import { existsSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { platform } from "node:os";

const logger = console;

const IS_WIN = platform() === "win32";
const IS_MAC = platform() === "darwin";

interface DoctorResult {
  name: string;
  ok: boolean;
  version?: string;
  path?: string;
  hint?: string;
}

function sh(cmd: string): string | null {
  try {
    return execSync(cmd, { stdio: ["ignore", "pipe", "pipe"], encoding: "utf-8", windowsHide: true }).trim();
  } catch {
    return null;
  }
}

function versionParse(raw: string) {
  const m = raw?.match(/(\d+)\.(\d+)\.(\d+)/) || raw?.match(/(\d+)\.(\d+)/);
  return m ? { major: parseInt(m[1]), minor: parseInt(m[2]), raw: m[0] } : null;
}

function findQt(): string | null {
  if (IS_WIN) {
    const root = "C:\\Qt";
    if (existsSync(root)) {
      for (const ver of readdirSync(root).sort().reverse()) {
        for (const target of ["msvc2022_64", "msvc2019_64", "mingw_64"]) {
          const p = join(root, ver, target);
          if (existsSync(join(p, "bin", "moc.exe"))) return p;
        }
      }
    }
  }
  if (IS_MAC) {
    for (const p of ["/opt/homebrew/opt/qt@6", "/usr/local/opt/qt@6"]) {
      if (existsSync(join(p, "bin", "moc"))) return p;
    }
  }
  for (const p of ["/usr/lib/x86_64-linux-gnu/qt6", "/usr/lib/qt6", "/usr"]) {
    if (existsSync(join(p, "bin", "moc")) || existsSync(join(p, "libexec", "moc"))) return p;
  }
  return null;
}

export async function run(args: string[]): Promise<void> {
  const fix = args.includes("--fix") || args.includes("-f");

  console.log("\n  🐻  Mocha Doctor\n  " + "─".repeat(40) + "\n");

  const results: DoctorResult[] = [];

  const nodeVer = process.version;
  const nodeParsed = versionParse(nodeVer);
  results.push({
    name: "Node.js",
    ok: !!nodeParsed && nodeParsed.major >= 18,
    version: nodeVer,
    hint: nodeParsed && nodeParsed.major < 18 ? "Install Node.js 18+ from https://nodejs.org" : undefined,
  });

  const rustVer = sh(IS_WIN ? "rustc -V 2>nul" : "rustc -V 2>/dev/null");
  results.push({
    name: "Rust",
    ok: !!rustVer,
    version: rustVer?.split(" ")[1] || undefined,
    hint: !rustVer ? "Install from https://rustup.rs" : undefined,
  });

  const nativeBinary = (() => {
    const base = join(process.cwd(), "node_modules", "@mocha", "native");
    if (!existsSync(base)) return null;
    try {
      for (const f of readdirSync(base)) {
        if (f.startsWith("mocha-native") && f.endsWith(".node")) return join(base, f);
      }
    } catch {
      return null;
    }
    return null;
  })();

  if (IS_WIN) {
    const cl = sh('cmd /c "cl.exe" 2>&1') || "";
    const hasMSVC = cl.includes("Microsoft") || cl.includes("Version") || !!nativeBinary;
    results.push({
      name: "MSVC Build Tools",
      ok: hasMSVC,
      hint: !hasMSVC ? "Install Visual Studio 2022 Build Tools with C++ workload.\n    winget install Microsoft.VisualStudio.2022.BuildTools" : undefined,
    });
  }

  if (IS_MAC) {
    const xc = sh("xcode-select -p 2>/dev/null");
    results.push({
      name: "Xcode CLI Tools",
      ok: !!xc && !xc.includes("error"),
      path: xc?.trim(),
      hint: !xc ? "Run: xcode-select --install" : undefined,
    });
  }

  const qtDir = findQt();
  const qmake = sh("qmake6 --version 2>/dev/null") || sh("qmake --version 2>/dev/null");
  const qtVer = qmake?.match(/Qt version (\d+\.\d+\.\d+)/)?.[1];
  results.push({
    name: "Qt6",
    ok: !!qtDir || !!qmake,
    version: qtVer || (qtDir ? "(found)" : undefined),
    path: qtDir || undefined,
    hint: !qtDir && !qmake
      ? IS_WIN
        ? "Install via: aqt install-qt --outputdir C:\\Qt windows desktop 6.8.2 win64_msvc2022_64"
        : IS_MAC
          ? "Install via: brew install qt@6"
          : "Install via package manager (qt6-base-dev)"
      : undefined,
  });

  results.push({
    name: "Native module (@mocha/native)",
    ok: !!nativeBinary,
    path: nativeBinary || undefined,
    hint: !nativeBinary ? "Run: npx napi build --platform --release (in node_modules/@mocha/native)" : undefined,
  });

  const dpkgDeb = sh("which dpkg-deb 2>/dev/null") || sh("dpkg-deb --help 2>&1 | head -1");
  const haveZip = !!(sh("zip --version 2>/dev/null") || sh("7z --help 2>&1"));
  const linuxdeploy = sh("which linuxdeploy 2>/dev/null") || sh("which linuxdeploy-x86_64.AppImage 2>/dev/null");

  results.push({
    name: "Packaging: dpkg-deb",
    ok: !!dpkgDeb,
    path: dpkgDeb?.trim() || undefined,
    hint: !dpkgDeb ? "Install via: sudo apt install dpkg-dev" : undefined,
  });

  results.push({
    name: "Packaging: zip/7z",
    ok: haveZip,
    hint: !haveZip ? "For .exe packaging: sudo apt install zip (or p7zip-full for 7z)" : undefined,
  });

  results.push({
    name: "Packaging: linuxdeploy",
    ok: !!linuxdeploy,
    path: linuxdeploy?.trim() || undefined,
    hint: !linuxdeploy
      ? "For .AppImage: download linuxdeploy-x86_64.AppImage → chmod +x → put in PATH"
      : undefined,
  });

  console.log("  Dependencies:\n");
  for (const r of results) {
    const icon = r.ok ? "✅" : "❌";
    const line = `  ${icon} ${r.name}`;
    console.log(line.padEnd(30) + (r.version ? ` v${r.version}` : r.path ? ` ${r.path}` : ""));
  }

  const allOk = results.every((r) => r.ok);
  const failed = results.filter((r) => !r.ok);

  if (!allOk) {
    console.log(`\n  Missing (${failed.length}):\n`);
    for (const r of failed) {
      console.log(`  ${r.name}`);
      if (r.hint) console.log(`    → ${r.hint}`);
    }
  }

  if (fix && failed.length > 0) {
    console.log("\n  Auto-fixing...");
    logger.info("Run the bootstrap script for automatic installation:");
    logger.info("  node scripts/bootstrap.mjs --fix");
  }

  console.log("\n  " + "─".repeat(40));
  if (allOk) {
    console.log("  ✅ All systems go! Run: npm run dev\n");
  } else {
    console.log("  ⚠️  Fix issues above, then try again.\n");
  }

  if (failed.length > 0) process.exitCode = 1;
}
