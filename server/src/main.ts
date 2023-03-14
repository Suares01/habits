import "dotenv/config";
import { FastifyServer } from "./server";

const server = new FastifyServer();

(async () => {
  await server.start();
})();
