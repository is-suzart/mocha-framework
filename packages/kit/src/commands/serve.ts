import { Logger } from "@mocha/shared";
import { DebugServer } from "@mocha/core";

const logger = new Logger("serve");

export async function run(args: string[]): Promise<void> {
  const portIndex =
    args.indexOf("--port") >= 0
      ? args.indexOf("--port")
      : args.indexOf("-p") >= 0
        ? args.indexOf("-p")
        : -1;
  const port = portIndex >= 0 ? parseInt(args[portIndex + 1], 10) : 9229;

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
