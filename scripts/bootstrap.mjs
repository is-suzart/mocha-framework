#!/usr/bin/env node

import { execSync, spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { platform, arch } from "node:os";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");

const BOLD = "\x1b[1m";
const GREEN = "\x1b[32m";
const YELLOW = "\x1b[33m";
const RED = "\x1b[31m";
const CYAN = "\x1b[36m";
const RESET = "\x1b[0m";

const CHECK = `${GREEN}✓${RESET}`;
const CROSS = `${RED}✗${RESET}`;

const PLATFORM = platform();
const IS_WIN = PLATFORM === "win32";
const IS_MAC = PLATFORM === "darwin";
const IS_LINUX = !IS_WIN && !IS_MAC;

const FIX_FLAG = process.argv.includes("--fix") || process.argv.includes("-f");

function ok(msg) {
  console.log(`  ${CHECK} ${msg}`);
}

function warn(msg) {
  console.log(`  ${YELLOW}⚠${RESET} ${msg}`);
}

function fail(msg) {
  console.log(`  ${CROSS} ${msg}`);
}

function info(msg) {
  console.log(`  ${CYAN}ℹ${RESET} ${msg}`);
}

function sh(cmd, opts = {}) {
  try {
    const result = execSync(cmd, {
      stdio: ["ignore", "pipe", "pipe"],
      encoding: "utf-8",
      windowsHide: true,
      ...opts,
    });
    return result.trim();
  } catch {
    return null;
  }
}

function shLive(cmd, opts = {}) {
  try {
    execSync(cmd, {
      stdio: "inherit",
      windowsHide: true,
      ...opts,
    });
    return true;
  } catch {
    return false;
  }
}

function versionParse(raw) {
  if (!raw) return null;
  const m = raw.match(/(\d+)\.(\d+)\.(\d+)/) || raw.match(/(\d+)\.(\d+)/);
  return m ? { major: parseInt(m[1]), minor: parseInt(m[2]), raw: m[0] } : null;
}

function versionGTE(a, b) {
  if (!a || !b) return false;
  return a.major > b.major || (a.major === b.major && a.minor >= b.minor);
}

async function detectDistro() {
  if (!IS_LINUX) return null;
  const id = sh("grep '^ID=' /etc/os-release") || "";
  const like = sh("grep '^ID_LIKE=' /etc/os-release") || "";
  return { id: id.replace("ID=", "").replace(/"/g, "").trim(), like: like.replace("ID_LIKE=", "").replace(/"/g, "").trim() };
}

console.log(`\n${BOLD}🐻  Mocha Framework — Bootstrap${RESET}\n`);
console.log(`  Platform: ${IS_WIN ? "Windows" : IS_MAC ? "macOS" : "Linux"} (${arch()})\n`);

let allOk = true;
let installedSomething = false;

// ─── Node.js ────────────────────────────────────────────────

console.log(`${BOLD}Node.js${RESET}`);
const nodeVer = versionParse(process.version);
if (nodeVer && nodeVer.major >= 18) {
  ok(`Node.js ${process.version}`);
} else {
  fail(`Node.js ${process.version} — need >= 18`);
  allOk = false;
  if (FIX_FLAG) {
    if (IS_WIN) {
      info("Installing Node.js via winget...");
      shLive("winget install OpenJS.NodeJS.LTS --accept-package-agreements");
    } else if (IS_MAC) {
      info("Installing Node.js via Homebrew...");
      shLive("brew install node@20");
    } else {
      info("Install Node.js manually: https://nodejs.org");
    }
    installedSomething = true;
  }
}

// ─── Rust ───────────────────────────────────────────────────

console.log(`\n${BOLD}Rust${RESET}`);
const rustVer = versionParse(sh("rustc --version") || sh("rustc -V"));
if (rustVer) {
  ok(`Rust ${rustVer.raw}`);
} else {
  fail("Rust not found");
  allOk = false;
  if (FIX_FLAG) {
    if (IS_WIN) {
      info("Installing Rust via winget...");
      shLive("winget install Rustlang.Rustup --accept-package-agreements");
    } else {
      info("Installing Rust via rustup...");
      shLive('curl --proto "=https" --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y');
    }
    installedSomething = true;
  }
}

// ─── MSVC Build Tools (Windows) ─────────────────────────────

if (IS_WIN) {
  console.log(`\n${BOLD}MSVC Build Tools${RESET}`);
  const clVer = sh('cmd /c "cl.exe" 2>&1') || "";
  const nativeDir = join(ROOT, "packages", "native");
  const hasBinary = existsSync(nativeDir) && (sh(`dir /b "${nativeDir}" 2>nul`) || "").includes(".node");
  if (clVer.includes("Microsoft") || clVer.includes("Version") || hasBinary) {
    ok("MSVC Build Tools" + (hasBinary && !clVer.includes("Microsoft") ? " (verified via native build)" : ""));
  } else {
    warn("MSVC Build Tools not detected");
    info("Required: Visual Studio Build Tools with 'Desktop development with C++' workload");
    if (FIX_FLAG) {
      info("Installing via winget...");
      shLive('winget install Microsoft.VisualStudio.2022.BuildTools --override "--add Microsoft.VisualStudio.Workload.VCTools --add Microsoft.VisualStudio.Component.Windows11SDK.22621 --passive --wait"');
      installedSomething = true;
      info("AFTER installation, RESTART your terminal and re-run this script");
    }
  }
}

// ─── Xcode CLI (macOS) ─────────────────────────────────────

if (IS_MAC) {
  console.log(`\n${BOLD}Xcode CLI Tools${RESET}`);
  const xcode = sh("xcode-select -p");
  if (xcode && !xcode.includes("error")) {
    ok("Xcode CLI Tools installed");
  } else {
    fail("Xcode CLI Tools not found");
    allOk = false;
    if (FIX_FLAG) {
      info("Installing Xcode CLI Tools...");
      shLive("xcode-select --install");
      installedSomething = true;
    }
  }
}

// ─── C++ Compiler (Linux) ───────────────────────────────────

if (IS_LINUX) {
  console.log(`\n${BOLD}C++ Compiler${RESET}`);
  const gcc = sh("gcc --version") || sh("g++ --version");
  const clang = sh("clang --version") || sh("clang++ --version");
  if (gcc) {
    ok(`GCC found: ${gcc.split("\n")[0]}`);
  } else if (clang) {
    ok(`Clang found: ${clang.split("\n")[0]}`);
  } else {
    fail("No C++ compiler found");
    allOk = false;
    if (FIX_FLAG) {
      const distro = await detectDistro();
      if (distro) {
        if (distro.id === "arch" || distro.like.includes("arch")) {
          shLive("sudo pacman -S --noconfirm gcc");
        } else if (distro.id === "fedora" || distro.like.includes("fedora")) {
          shLive("sudo dnf install -y gcc-c++");
        } else {
          shLive("sudo apt-get update && sudo apt-get install -y build-essential");
        }
        installedSomething = true;
      }
    }
  }
}

// ─── Qt6 ────────────────────────────────────────────────────

console.log(`\n${BOLD}Qt6${RESET}`);

let qtDir = process.env.QT6_DIR || "";

function checkQt(dir) {
  const moc = IS_WIN ? join(dir, "bin", "moc.exe") : join(dir, "bin", "moc");
  const coreInc = join(dir, "include", "QtCore");
  const coreLib = IS_WIN
    ? (existsSync(join(dir, "lib", "Qt6Core.lib")) || existsSync(join(dir, "lib", "Qt6Cored.lib")))
    : existsSync(join(dir, "lib", "libQt6Core.so")) || existsSync(join(dir, "lib", "libQt6Core.dylib"));
  return existsSync(moc) && existsSync(coreInc) && coreLib;
}

function findQt() {
  const candidates = [];
  if (IS_WIN) {
    const cRoot = "C:\\Qt";
    if (existsSync(cRoot)) {
      for (const ver of ["6.8.2", "6.8.0", "6.7.0"]) {
        for (const arch of ["msvc2022_64", "msvc2019_64", "mingw_64"]) {
          candidates.push(join(cRoot, ver, arch));
        }
      }
    }
  } else if (IS_MAC) {
    candidates.push(sh("brew --prefix qt@6 2>/dev/null") || "");
    candidates.push("/opt/homebrew/opt/qt@6");
    candidates.push("/usr/local/opt/qt@6");
  } else {
    candidates.push("/usr");
    candidates.push("/usr/lib/x86_64-linux-gnu/qt6");
    candidates.push("/usr/lib/aarch64-linux-gnu/qt6");
    candidates.push("/usr/lib/qt6");
  }
  for (const c of candidates) {
    if (c && checkQt(c)) return c;
  }
  return null;
}

const foundQt = findQt();
if (foundQt) {
  ok(`Qt6 found at: ${foundQt}`);
  qtDir = foundQt;
} else if (sh("qmake6 --version") || sh("qmake --version")) {
  ok("Qt6 via qmake");
} else {
  fail("Qt6 not found");
  allOk = false;
  if (FIX_FLAG) {
    if (IS_WIN) {
      info("Installing Qt6 via aqtinstall...");
      const pip = sh("pip --version") || sh("pip3 --version");
      if (!pip) {
        info("Python/pip not found. Installing...");
        shLive("winget install Python.Python.3.12 --accept-package-agreements");
      }
      shLive("pip install aqtinstall");
      shLive('aqt install-qt --outputdir C:\\Qt windows desktop 6.8.2 win64_msvc2022_64');
      qtDir = "C:\\Qt\\6.8.2\\msvc2022_64";
    } else if (IS_MAC) {
      info("Installing Qt6 via Homebrew...");
      shLive("brew install qt@6");
      qtDir = sh("brew --prefix qt@6 2>/dev/null") || "/opt/homebrew/opt/qt@6";
    } else {
      const distro = await detectDistro();
      info("Installing Qt6 via package manager...");
      if (distro) {
        if (distro.id === "arch" || distro.like.includes("arch")) {
          shLive("sudo pacman -S --noconfirm qt6-base qt6-tools");
        } else if (distro.id === "fedora" || distro.like.includes("fedora")) {
          shLive("sudo dnf install -y qt6-qtbase-devel qt6-qttools-devel");
        } else {
          shLive("sudo apt-get update && sudo apt-get install -y qt6-base-dev qt6-base-dev-tools qt6-tools-dev qt6-tools-dev-tools");
        }
        qtDir = "/usr";
      }
    }
  }
}

// ─── Set QT6_DIR ────────────────────────────────────────────

if (qtDir) {
  console.log(`\n${BOLD}Environment${RESET}`);
  const currentEnv = process.env.QT6_DIR || "";
  if (currentEnv !== qtDir) {
    if (IS_WIN) {
      try {
        execSync(`setx QT6_DIR "${qtDir}" > nul`, { stdio: "ignore", windowsHide: true });
        ok(`QT6_DIR set to: ${qtDir}`);
      } catch {
        warn(`Could not set QT6_DIR automatically. Run: setx QT6_DIR "${qtDir}"`);
      }
    } else {
      info(`Add to your shell profile: export QT6_DIR="${qtDir}"`);
    }
  } else {
    ok(`QT6_DIR already set: ${qtDir}`);
  }
}

// ─── OpenGL / System deps (Linux) ──────────────────────────

if (IS_LINUX) {
  console.log(`\n${BOLD}System Libraries${RESET}`);
  const hasGL = existsSync("/usr/lib/x86_64-linux-gnu/libGL.so") || existsSync("/usr/lib/libGL.so") || existsSync("/usr/lib/x86_64-linux-gnu/libGL.so.1");
  if (hasGL) {
    ok("OpenGL / libxkbcommon found");
  } else {
    warn("libGL / libxkbcommon may be missing");
    if (FIX_FLAG) {
      const distro = await detectDistro();
      if (distro) {
        if (distro.id === "arch" || distro.like.includes("arch")) {
          shLive("sudo pacman -S --noconfirm libgl libxkbcommon");
        } else if (distro.id === "fedora" || distro.like.includes("fedora")) {
          shLive("sudo dnf install -y mesa-libGL-devel libxkbcommon-devel");
        } else {
          shLive("sudo apt-get install -y libgl1-mesa-dev libxkbcommon-dev");
        }
        installedSomething = true;
      }
    }
  }
}

// ─── Build native module ─────────────────────────────────────

console.log(`\n${BOLD}Native Module${RESET}`);
const nativeDir = join(ROOT, "packages", "native");
const nativeIndex = join(nativeDir, "index.js");
if (existsSync(nativeIndex)) {
  const binaries = (sh(`dir /b "${nativeDir}" 2>nul`) || "").split("\n").filter(f => f.includes("mocha-native") && f.endsWith(".node"));
  if (IS_WIN) {
    const found = sh(`dir /b "${nativeDir}" 2>nul`) || "";
    if (found.includes("mocha-native") && found.includes(".node")) {
      ok("Native binary already built");
    }
  } else {
    const found = sh(`ls "${nativeDir}" 2>/dev/null`) || "";
    if (found.includes("mocha-native") && found.includes(".node")) {
      ok("Native binary already built");
    }
  }
  if (!IS_WIN && !existsSync(join(nativeDir, "mocha-native.linux-x64-gnu.node")) && !existsSync(join(nativeDir, "index.js"))) {
    warn("Native binary not found — needs build");
  }
}

// ─── Install VS Code extension ──────────────────────────────

console.log(`\n${BOLD}Editor Extension${RESET}`);
const vsix = join(ROOT, "vscode-extension", "mocha-framework-0.3.2.vsix");
if (existsSync(vsix)) {
  const editors = IS_WIN
    ? ["antigravity-ide", "code", "cursor", "code-insiders"]
    : ["code", "cursor", "code-insiders", "antigravity-ide"];

  let installed = false;
  for (const editor of editors) {
    const found = sh(IS_WIN ? `where ${editor} 2>nul` : `which ${editor} 2>/dev/null`);
    if (found) {
      info(`Installing extension into ${editor}...`);
      if (shLive(`${editor} --install-extension "${vsix}" --force`)) {
        ok(`Installed into ${editor}`);
        installed = true;
      } else {
        warn(`Could not install into ${editor}`);
      }
      break;
    }
  }
  if (!installed) {
    info("No editor binary found in PATH. Install manually:");
    info(`  code --install-extension "${vsix}"`);
  }
} else {
  warn("VSIX not found. Run: cd vscode-extension && npx vsce package");
}

// ─── Summary ─────────────────────────────────────────────────

console.log(`\n${"─".repeat(50)}`);
if (allOk) {
  console.log(`\n${GREEN}${BOLD}  All dependencies OK!${RESET}\n`);
  console.log("  Next steps:");
  console.log("    npm install");
  console.log("    cd packages/native && npx napi build --platform --release");
  console.log("    cd ../..");
  console.log("    npm run dev");
} else if (installedSomething) {
  console.log(`\n${YELLOW}${BOLD}  Some dependencies were installed.${RESET}`);
  console.log(`\n  ${YELLOW}RESTART your terminal${RESET} and re-run:`);
  console.log("    node scripts/bootstrap.mjs --fix\n");
} else {
  console.log(`\n${YELLOW}${BOLD}  Missing dependencies detected.${RESET}\n`);
  console.log("  Run with --fix to auto-install:");
  console.log("    node scripts/bootstrap.mjs --fix\n");
}
console.log(`${"─".repeat(50)}\n`);
