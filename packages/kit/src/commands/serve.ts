import { Logger } from "@mocha/shared";
import { DebugServer } from "@mocha/core";
import * as net from "node:net";

const logger = new Logger("serve");

function randomPort(): number {
  return Math.floor(Math.random() * 55536) + 10000;
}

function findFreePort(preferred?: number): Promise<number> {
  return new Promise((resolve) => {
    const tryPort = (port: number) => {
      const server = net.createServer();
      server.unref();
      server.on("error", () => tryPort(randomPort()));
      server.listen(port, () => server.close(() => resolve(port)));
    };
    tryPort(preferred ?? randomPort());
  });
}

export async function run(args: string[]): Promise<void> {
  const portIndex =
    args.indexOf("--port") >= 0
      ? args.indexOf("--port")
      : args.indexOf("-p") >= 0
        ? args.indexOf("-p")
        : -1;
  const explicitPort = portIndex >= 0 ? parseInt(args[portIndex + 1], 10) : undefined;
  const port = await findFreePort(explicitPort);

  const server = new DebugServer({ port });
  await server.start();

  logger.info(`Debug server running at http://localhost:${server.port}`);

  process.on("SIGINT", async () => {
    await server.stop();
    process.exit(0);
  });

  process.on("SIGTERM", async () => {
    await server.stop();
    process.exit(0);
  });

  return new Promise(() => {});
}
