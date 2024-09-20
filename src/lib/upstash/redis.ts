import { env } from "@/env";
import { Redis } from "@upstash/redis";

// Initiate Redis instance by connecting to REST URL
export const redis = new Redis({
  url: env.UPSTASH_REDIS_REST_URL ?? "",
  token: env.UPSTASH_REDIS_REST_TOKEN ?? "",
});
