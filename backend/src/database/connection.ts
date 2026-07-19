import mongoose from "mongoose";
import { env, isDevelopment, isProduction } from "@/config/env";
import { logger } from "@/common/utils/logger";

let memoryServer: { stop: () => Promise<boolean> } | null = null;

async function connectWithMemoryDb(): Promise<void> {
  const { MongoMemoryServer } = await import("mongodb-memory-server");
  const server = await MongoMemoryServer.create();
  memoryServer = server;
  await mongoose.connect(server.getUri());
  logger.warn("Using in-memory MongoDB (data will not persist across restarts)");
}

export async function connectDatabase(): Promise<void> {
  mongoose.set("strictQuery", true);

  mongoose.connection.on("connected", () => {
    logger.info("MongoDB connected");
  });

  mongoose.connection.on("error", (error) => {
    logger.error("MongoDB connection error", { error: error.message });
  });

  mongoose.connection.on("disconnected", () => {
    logger.warn("MongoDB disconnected");
  });

  if (env.USE_MEMORY_DB && isDevelopment) {
    await connectWithMemoryDb();
    return;
  }

  try {
    await mongoose.connect(env.MONGODB_URI);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    const refused =
      message.includes("ECONNREFUSED") || message.includes("MongoServerSelectionError");

    if (isDevelopment && !isProduction && refused) {
      logger.warn("Local MongoDB unavailable — falling back to in-memory database", {
        uri: env.MONGODB_URI,
      });
      await connectWithMemoryDb();
      return;
    }

    throw error;
  }
}

export async function disconnectDatabase(): Promise<void> {
  await mongoose.disconnect();
  if (memoryServer) {
    await memoryServer.stop();
    memoryServer = null;
  }
}
