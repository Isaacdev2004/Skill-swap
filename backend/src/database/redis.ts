import Redis from "ioredis";
import { env } from "@/config/env";
import { logger } from "@/common/utils/logger";

let redisClient: Redis | null = null;

export function getRedisClient(): Redis | null {
  if (!env.REDIS_ENABLED) {
    return null;
  }

  if (!redisClient) {
    redisClient = new Redis(env.REDIS_URL, {
      maxRetriesPerRequest: 3,
      lazyConnect: true,
    });

    redisClient.on("error", (error) => {
      logger.warn("Redis error", { error: error.message });
    });

    redisClient.on("connect", () => {
      logger.info("Redis connected");
    });
  }

  return redisClient;
}

export async function connectRedis(): Promise<void> {
  const client = getRedisClient();
  if (!client) {
    logger.info("Redis disabled — skipping connection");
    return;
  }

  try {
    await client.connect();
  } catch (error) {
    logger.warn("Redis unavailable — continuing without cache", {
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}

export async function disconnectRedis(): Promise<void> {
  if (redisClient) {
    await redisClient.quit();
    redisClient = null;
  }
}

export async function cacheGet<T>(key: string): Promise<T | null> {
  const client = getRedisClient();
  if (!client || client.status !== "ready") return null;

  const value = await client.get(key);
  return value ? (JSON.parse(value) as T) : null;
}

export async function cacheSet(key: string, value: unknown, ttlSeconds = 300): Promise<void> {
  const client = getRedisClient();
  if (!client || client.status !== "ready") return;

  await client.set(key, JSON.stringify(value), "EX", ttlSeconds);
}

export async function cacheDel(key: string): Promise<void> {
  const client = getRedisClient();
  if (!client || client.status !== "ready") return;

  await client.del(key);
}
