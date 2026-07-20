import { Command } from "commander";
import { join, basename, dirname, relative } from "path";
import { existsSync, mkdirSync, readdirSync, statSync } from "fs";
import { readFile, writeFile, rm, cp } from "fs/promises";
import { fileURLToPath } from "url";
import chalk from "chalk";
import ora from "ora";

interface CreateOptions {
  rust?: boolean;
  node?: boolean;
  python?: boolean;
  hybrid?: boolean;
  native?: boolean;
  i18n?: boolean;
  force?: boolean;
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const createCommand = new Command("create")
  .argument("<name>", "project name")
  .option("--rust", "scaffold with Rust backend (qmetaobject-rs)")
  .option("--node", "scaffold with Node.js backend (TypeScript + WebSocket)")
  .option("--python", "scaffold with Python backend (PySide6)")
  .option("--native", "scaffold with Mocha native (napi-rs + Qt, recommended)")
  .option("--hybrid", "scaffold with Mocha TS hybrid (mock backend, dev only)")
  .option("--i18n", "enable i18n support")
  .option("-f, --force", "overwrite existing directory")
  .description("create a new Mocha-DS project")
  .action(async (name: string, options: CreateOptions) => {
    const spinner = ora();

    let i18nEnabled = options.i18n || false;
    const hasNativeFlag =
      options.rust || options.node || options.python || options.hybrid || options.native;

    if (!hasNativeFlag) {
      try {
        const { select, confirm } = await import("@inquirer/prompts");
        const answer = await select({
          message: "Choose a backend:",
          choices: [
            {
              name: "Mocha Native (napi-rs + Qt) — recommended",
              value: "native",
            },
            {
              name: "Mocha Hybrid (TypeScript mock) — dev only, no window",
              value: "hybrid",
            },
            {
              name: "Node.js (TypeScript + WebSocket) — legacy",
              value: "node",
            },
            {
              name: "Python (PySide6) — community favorite",
              value: "python",
            },
            {
              name: "Rust (qmetaobject-rs) — max performance",
              value: "rust",
            },
          ],
        });
        (options as any).native = answer === "native";
        (options as any).hybrid = answer === "hybrid";
        (options as any).node = answer === "node";
        (options as any).python = answer === "python";
        (options as any).rust = answer === "rust";

        i18nEnabled = await confirm({
          message: "Enable internationalization (i18n)?",
          default: false,
        });
      } catch {
        options.native = true;
      }
    }

    let templateDir = "native";
    if (options.rust) templateDir = "rust";
    else if (options.python) templateDir = "python";
    else if (options.node) templateDir = "node";
    else if (options.hybrid) templateDir = "hybrid";

    const targetDir = join(process.cwd(), name);

    if (existsSync(targetDir)) {
      if (!options.force) {
        console.log(
          chalk.red(
            `Directory "${name}" already exists. Use --force to overwrite.`
          )
        );
        process.exit(1);
      }
      await rm(targetDir, { recursive: true, force: true });
    }

    spinner.start(`Scaffolding ${name} (${templateDir} backend)...`);

    mkdirSync(targetDir, { recursive: true });

    const templatePath = join(
      __dirname,
      "..",
      "..",
      "templates",
      templateDir
    );

    await generateProject(
      targetDir,
      name,
      templatePath,
      i18nEnabled,
      spinner
    );

    spinner.succeed(
      chalk.green(`Project "${name}" created at ${targetDir}`)
    );

    console.log("\n" + chalk.bold("Next steps:"));
    console.log(`  cd ${name}`);
    if (templateDir === "native") {
      console.log("  npm install");
      console.log("  npm run dev     # opens QML window via napi-rs + Qt");
    } else if (templateDir === "hybrid" || templateDir === "node") {
      console.log("  npm install");
      console.log("  npm run dev");
    } else if (templateDir === "python") {
      console.log("  pip install -r requirements.txt");
      console.log("  python main.py");
    } else {
      console.log("  cargo run");
    }
    console.log();
  });

async function replacePlaceholders(
  dir: string,
  placeholders: { [key: string]: string }
) {
  const files = readdirSync(dir);
  for (const file of files) {
    const fullPath = join(dir, file);
    if (statSync(fullPath).isDirectory()) {
      if (
        file === "MochaDS" ||
        file === ".git" ||
        file === "node_modules"
      )
        continue;
      await replacePlaceholders(fullPath, placeholders);
    } else {
      let content = await readFile(fullPath, "utf-8");
      let modified = false;
      for (const [key, val] of Object.entries(placeholders)) {
        const regex = new RegExp(`\\{\\{${key}\\}\\}`, "g");
        if (regex.test(content)) {
          content = content.replace(regex, val);
          modified = true;
        }
      }
      if (modified) {
        await writeFile(fullPath, content, "utf-8");
      }
    }
  }
}

async function removeI18nSupport(
  targetDir: string,
  isHybrid: boolean
) {
  if (isHybrid) {
    const appPath = join(targetDir, "src", "App.qml.ts");
    if (existsSync(appPath)) {
      let content = await readFile(appPath, "utf-8");
      content = content.replace(/this\.i18n\s*=\s*true;?\n?/g, "");
      content = content.replace(
        /MochaI18n\.basePath[\s\S]*?\n\s*/g,
        ""
      );
      content = content.replace(/MochaI18n\.t\("title"\)/g, '"Mocha-DS App"');
      await writeFile(appPath, content, "utf-8");
    }

    const homePath = join(targetDir, "src", "views", "Home.qml.ts");
    if (existsSync(homePath)) {
      let content = await readFile(homePath, "utf-8");
      content = content.replace(/MochaI18n\.t\("increment"\)/g, '"Increment"');
      content = content.replace(/MochaI18n\.t\("reset"\)/g, '"Reset"');
      content = content.replace(
        /MochaI18n\.t\("count"[\s\S]*?\)/g,
        '"Count: " + controller.count.value'
      );
      await writeFile(homePath, content, "utf-8");
    }
    return;
  }

  const mainQmlPath = join(targetDir, "ui", "main.qml");
  const homeQmlPath = join(targetDir, "ui", "views", "Home.qml");

  if (existsSync(mainQmlPath)) {
    let content = await readFile(mainQmlPath, "utf-8");
    content = content.replace(
      /Component\.onCompleted: \{[\s\S]*?\}/g,
      ""
    );
    content = content.replace(
      /MochaI18n\.t\("title"\)/g,
      '"Mocha-DS App"'
    );
    await writeFile(mainQmlPath, content, "utf-8");
  }

  if (existsSync(homeQmlPath)) {
    let content = await readFile(homeQmlPath, "utf-8");
    content = content.replace(/MochaI18n\.t\("increment"\)/g, '"Increment"');
    content = content.replace(/MochaI18n\.t\("reset"\)/g, '"Reset"');
    content = content.replace(
      /MochaI18n\.t\("count"[\s\S]*?\)/g,
      '"Count: " + appWindow.count'
    );
    await writeFile(homeQmlPath, content, "utf-8");
  }
}

async function generateProject(
  targetDir: string,
  name: string,
  templatePath: string,
  i18n: boolean,
  spinner: any
) {
  const slug = name.toLowerCase().replace(/\s+/g, "-");
  const moduleName = slug.replace(/-/g, "_");
  const isHybrid = templatePath.endsWith("hybrid");
  const isNative = templatePath.endsWith("native");

  if (existsSync(templatePath)) {
    await cp(templatePath, targetDir, { recursive: true });
  }

  const placeholders = {
    project_name: name,
    project_slug: slug,
    project_module: moduleName,
  };
  await replacePlaceholders(targetDir, placeholders);

  // Clone MochaDS for ALL project types (QML needs the actual .qml files)
  const mochaDsDir = join(targetDir, "ui", "MochaDS");
  mkdirSync(join(targetDir, "ui"), { recursive: true });
  mkdirSync(mochaDsDir, { recursive: true });

  const originalText = spinner.text;
  try {
    spinner.text = "Cloning MochaDS design system from Git...";
    const { execSync } = await import("child_process");
    execSync(
      "git clone --depth 1 https://github.com/is-suzart/mocha-framework.git .",
      {
        cwd: mochaDsDir,
        stdio: "ignore",
      }
    );

    const gitDir = join(mochaDsDir, ".git");
    if (existsSync(gitDir)) {
      await rm(gitDir, { recursive: true, force: true });
    }

    const qmlFiles = readdirSync(mochaDsDir).filter((file) =>
      file.endsWith(".qml")
    );
    let qmldirContent = "module MochaDS\n";
    for (const file of qmlFiles) {
      const compName = basename(file, ".qml");
      const fileContent = await readFile(
        join(mochaDsDir, file),
        "utf-8"
      );
      if (fileContent.includes("pragma Singleton")) {
        qmldirContent += `singleton ${compName} ${file}\n`;
      } else {
        qmldirContent += `${compName} ${file}\n`;
      }
    }
    await writeFile(
      join(mochaDsDir, "qmldir"),
      qmldirContent,
      "utf-8"
    );
  } catch (err) {
    console.log(
      chalk.red(
        "\nFailed to clone MochaDS from git. Project created without design system components."
      )
    );
  } finally {
    spinner.text = originalText;
  }

  // i18n setup for all project types
  const i18nDir = (isHybrid || isNative)
    ? join(targetDir, "src", "i18n")
    : join(targetDir, "ui", "i18n");
  mkdirSync(i18nDir, { recursive: true });

  if (i18n) {
    const enContent = {
      title: "Mocha-DS App",
      count: "Count: {{count}}",
      increment: "Increment",
      reset: "Reset",
    };
    const ptContent = {
      title: "App Mocha-DS",
      count: "Contagem: {{count}}",
      increment: "Incrementar",
      reset: "Resetar",
    };

    await writeFile(
      join(i18nDir, "en.json"),
      JSON.stringify(enContent, null, 2),
      "utf-8"
    );
    await writeFile(
      join(i18nDir, "pt.json"),
      JSON.stringify(ptContent, null, 2),
      "utf-8"
    );
  } else {
    await removeI18nSupport(targetDir, isHybrid);
  }

  spinner.info(
    "MochaDS cloned into ui/MochaDS/. Install dependencies with: npm install"
  );

  // Replace npm versions with file: paths for local dev
  if (isHybrid || isNative) {
    await linkLocalPackages(targetDir);
  }
}

async function linkLocalPackages(targetDir: string) {
  const pkgPath = join(targetDir, "package.json");
  if (!existsSync(pkgPath)) return;

  let pkg = JSON.parse(await readFile(pkgPath, "utf-8"));

  const monorepoRoot = findMonorepoRoot(process.cwd());
  if (!monorepoRoot) return;

  const packagesDir = join(monorepoRoot, "packages");
  const relToPackages = relative(targetDir, packagesDir);

  const mochaDeps = [
    "@mocha/core",
     "@mocha/native",
    "@mocha/qml",
    "@mocha/cli",
    "@mocha/kit",
    "@mocha/shared",
  ];

  let modified = false;
  for (const dep of mochaDeps) {
    const pkgName = dep.replace("@mocha/", "");
    const pkgDir = join(relToPackages, pkgName);
    if (pkg.dependencies?.[dep]) {
      pkg.dependencies[dep] = `file:${pkgDir}`;
      modified = true;
    }
    if (pkg.devDependencies?.[dep]) {
      pkg.devDependencies[dep] = `file:${pkgDir}`;
      modified = true;
    }
  }

  if (modified) {
    await writeFile(pkgPath, JSON.stringify(pkg, null, 2) + "\n", "utf-8");
  }
}

function findMonorepoRoot(from: string): string | null {
  let dir = from;
  for (let i = 0; i < 10; i++) {
    if (existsSync(join(dir, "packages", "core", "package.json"))) {
      return dir;
    }
    const parent = dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }
  return null;
}
