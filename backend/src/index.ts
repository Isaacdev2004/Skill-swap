import http from "http";
import { env } from "@/config/env";
import { connectDatabase } from "@/database/connection";
import { connectRedis } from "@/database/redis";
import { createApp } from "@/app";
import { initializeSocket } from "@/socket/index";
import { startCronJobs } from "@/cron/index";
import { logger } from "@/common/utils/logger";

async function bootstrap(): Promise<void> {
  await connectDatabase();
  await connectRedis();

  const app = createApp();
  const httpServer = http.createServer(app);

  initializeSocket(httpServer);
  startCronJobs();

  httpServer.listen(env.PORT, () => {
    logger.info(`SkillSwap API running on port ${env.PORT}`, {
      env: env.NODE_ENV,
      api: `/api/${env.API_VERSION}`,
    });
  });

  const shutdown = async (signal: string) => {
    logger.info(`${signal} received — shutting down`);
    httpServer.close(() => process.exit(0));
  };

  process.on("SIGTERM", () => void shutdown("SIGTERM"));
  process.on("SIGINT", () => void shutdown("SIGINT"));
}

bootstrap().catch((error) => {
  logger.error("Failed to start server", { error: error instanceof Error ? error.message : error });
  process.exit(1);
});
