#!/usr/bin/env node

import { Command } from 'commander';
import { createCommand } from './commands/create.js';
import { addCommand } from './commands/add.js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

let pkg: { version: string };
try {
  pkg = JSON.parse(readFileSync(join(__dirname, '..', 'package.json'), 'utf-8'));
} catch {
  pkg = { version: '0.1.0' };
}

const program = new Command();

program
  .name('mocha')
  .description('Mocha-DS — scaffold, dev, build, and manage desktop apps')
  .version(pkg.version);

program.addCommand(createCommand);
program.addCommand(addCommand);

function registerDevCommand() {
  return new Command('dev')
    .argument('[entry]', 'entry file (default: auto-detect)')
    .description('start dev server with HMR (hot module reload)')
    .action(async (entry: string) => {
      const { run } = await import('../../kit/dist/commands/dev.js');
      await run([entry]);
    });
}

function registerBuildCommand() {
  return new Command('build')
    .argument('[entry]', 'entry file')
    .option('-o, --output <dir>', 'output directory', 'dist')
    .option('--minify', 'minify output', false)
    .option('--no-sourcemap', 'disable sourcemaps', false)
    .option('--format <fmt>', 'package format: deb, appimage, exe, dmg')
    .option('--name <name>', 'application name for packaging')
    .option('--app-version <ver>', 'application version for packaging', '0.1.0')
    .option('--icon <path>', 'application icon (png or svg) for packaging')
    .description('build Mocha application (TS + QML)')
    .action(async (entry: string, opts: { output: string; minify: boolean; sourcemap: boolean; format?: string; name?: string; version?: string; icon?: string }) => {
      const { run } = await import('../../kit/dist/commands/build.js');
      await run([
        entry,
        '--output', opts.output,
        ...(opts.minify ? ['--minify'] : []),
        ...(opts.sourcemap ? [] : ['--no-sourcemap']),
        ...(opts.format ? ['--format', opts.format] : []),
        ...(opts.name ? ['--name', opts.name] : []),
        ...(opts.version ? ['--app-version', opts.version] : []),
        ...(opts.icon ? ['--icon', opts.icon] : []),
      ]);
    });
}

function registerTypeGenCommand() {
  return new Command('type-gen')
    .argument('[source]', 'source directory', 'src')
    .option('-o, --output <file>', 'output file')
    .description('generate TypeScript type definitions from QML')
    .action(async (source: string, opts: { output?: string }) => {
      const { run } = await import('../../kit/dist/commands/type-gen.js');
      await run([source, ...(opts.output ? ['--output', opts.output] : [])]);
    });
}

function registerServeCommand() {
  return new Command('serve')
    .option('-p, --port <port>', 'DevTools port (random if omitted)')
    .description('start DevTools inspector server')
    .action(async (opts: { port?: string }) => {
      const { run } = await import('../../kit/dist/commands/serve.js');
      const args: string[] = [];
      if (opts.port) args.push('--port', opts.port);
      await run(args);
    });
}

function registerInfoCommand() {
  return new Command('info')
    .description('show project information')
    .action(async () => {
      const { run } = await import('../../kit/dist/commands/info.js');
      await run([]);
    });
}

function registerDoctorCommand() {
  return new Command('doctor')
    .option('-f, --fix', 'attempt to auto-fix missing dependencies')
    .description('check development environment for missing dependencies')
    .action(async (opts: { fix: boolean }) => {
      const { run } = await import('../../kit/dist/commands/doctor.js');
      await run(opts.fix ? ['--fix'] : []);
    });
}

async function registerFrameworkCommands() {
  try {
    program.addCommand(registerDevCommand());
    program.addCommand(registerBuildCommand());
    program.addCommand(registerTypeGenCommand());
    program.addCommand(registerServeCommand());
    program.addCommand(registerInfoCommand());
    program.addCommand(registerDoctorCommand());
  } catch {
    // @mocha/kit not installed — framework commands unavailable
  }
}

await registerFrameworkCommands();

program.parse(process.argv);
