import fastify from "fastify";
import cors from "@fastify/cors";
import { prisma } from "./database/prisma";
import { appRoutes } from "./routes";

export class FastifyServer {
  private readonly app = fastify();

  public async start(): Promise<void> {
    this.app.register(cors, {
      origin: String(process.env.WEB_URL),
    });
    this.app.register(appRoutes);

    await prisma.$connect();

    const url = await this.app.listen({
      port: 3333,
    });

    console.log(`Server is running on ${url}`);
  }

  public async close(): Promise<void> {
    await prisma.$disconnect();

    await this.app.close();
  }
}
