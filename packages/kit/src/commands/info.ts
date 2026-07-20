import { Logger } from "@mocha/shared";
import * as fs from "node:fs";
import * as path from "node:path";
import { getMetaObject } from "@mocha/core";

const logger = new Logger("info");

export async function run(_args: string[]): Promise<void> {
  const cwd = process.cwd();

  console.log("");
  console.log("  🐻  Mocha Framework Info");
  console.log("  " + "─".repeat(40));
  console.log("");

  const pkgPath = path.join(cwd, "package.json");
  if (fs.existsSync(pkgPath)) {
    const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf-8"));
    console.log(`  Project:     ${pkg.name ?? "unknown"}`);
    console.log(`  Version:     ${pkg.version ?? "0.0.0"}`);
  }

  console.log(`  Directory:   ${cwd}`);

  const mochaVersion = "0.1.0";
  console.log(`  Mocha Core:   v${mochaVersion}`);
  console.log("");

  const srcDir = path.join(cwd, "src");
  if (fs.existsSync(srcDir)) {
    const stats = countFiles(srcDir);
    console.log(`  Source files:    ${stats.qmlTs + stats.ts}`);
    console.log(`    .qml.ts:       ${stats.qmlTs}`);
    console.log(`    .ts:           ${stats.ts}`);
    console.log(`    Components:    ${stats.components}`);
    console.log("");
  }

  console.log("  Features:");
  console.log("    ✅ QObject hierarchy with ownership");
  console.log("    ✅ QProperty observable properties");
  console.log("    ✅ Signal/Slot typed connections");
  console.log("    ✅ QML + TypeScript hybrid components");
  console.log("    ✅ Automatic binding generation");
  console.log("    ✅ Hot reload (preserve state)");
  console.log("    ✅ Built-in DevTools");
  console.log("    ✅ Thread management");
  console.log("");
  console.log("  Architecture:");
  console.log("    packages/core       - QObject, QProperty, Signals, Timer, DebugServer");
  console.log("    packages/qml        - @QMLComponent, parser, bindings");
  console.log("    packages/kit        - CLI, dev server, type-gen");
  console.log("    packages/shared     - Common utilities");
  console.log("");
}

function countFiles(dir: string): {
  qmlTs: number;
  ts: number;
  components: number;
} {
  const result = { qmlTs: 0, ts: 0, components: 0 };

  const walkDir = (currentDir: string) => {
    if (!fs.existsSync(currentDir)) return;
    for (const entry of fs.readdirSync(currentDir, { withFileTypes: true })) {
      const fullPath = path.join(currentDir, entry.name);
      if (entry.isDirectory() && !entry.name.startsWith(".")) {
        walkDir(fullPath);
      } else if (entry.name.endsWith(".qml.ts")) {
        result.qmlTs++;
        const content = fs.readFileSync(fullPath, "utf-8");
        if (content.includes("@QMLComponent")) result.components++;
      } else if (entry.name.endsWith(".ts") && !entry.name.endsWith(".d.ts")) {
        result.ts++;
      }
    }
  };

  walkDir(dir);
  return result;
}
