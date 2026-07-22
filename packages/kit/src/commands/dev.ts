import { Logger } from "@mocha/shared";
import * as fs from "node:fs";
import * as path from "node:path";

const logger = new Logger("dev");

export async function run(args: string[]): Promise<void> {
  const entry = args[0] || findEntry();

  if (!entry) {
    logger.error("No entry file found. Create src/App.qml.ts or specify one.");
    process.exit(1);
  }

  const entryPath = path.resolve(process.cwd(), entry);
  if (!fs.existsSync(entryPath)) {
    logger.error(`Entry file not found: ${entryPath}`);
    process.exit(1);
  }

  logger.info(`Starting dev server with hot reload...`);
  logger.info(`Entry: ${entry}`);
  logger.info(`[HMR] Watching for .qml.ts changes — edit and save to reload`);

  process.env.MOCHA_ENV = "development";
  process.env.MOCHA_ENTRY_DIR = path.dirname(entryPath);

  await import(entryPath);

  return new Promise(() => {});
}

function findEntry(): string | null {
  const candidates = [
    "src/App.qml.ts",
    "src/app.qml.ts",
    "src/main.qml.ts",
    "src/index.qml.ts",
    "App.qml.ts",
    "index.qml.ts",
  ];
  for (const candidate of candidates) {
    if (fs.existsSync(path.resolve(process.cwd(), candidate))) {
      return candidate;
    }
  }
  return findQmlTsFile();
}

function findQmlTsFile(): string | null {
  const srcDir = path.resolve(process.cwd(), "src");
  if (!fs.existsSync(srcDir)) return null;
  try {
    for (const entry of fs.readdirSync(srcDir, { recursive: true })) {
      const name = String(entry);
      if (name.endsWith(".qml.ts")) {
        return path.join("src", name);
      }
    }
  } catch {}
  return null;
}
