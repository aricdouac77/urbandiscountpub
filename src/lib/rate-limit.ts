import "server-only";
import { headers } from "next/headers";
import { Ratelimit } from "@upstash/ratelimit";
import { getRedis } from "@/services/redis";
import { logger } from "@/lib/logger";

const limiters = new Map<string, Ratelimit>();

function getLimiter(key: string, requests: number, windowSeconds: number): Ratelimit | null {
  const redis = getRedis();
  if (!redis) return null;

  const cacheKey = `${key}:${requests}:${windowSeconds}`;
  const existing = limiters.get(cacheKey);
  if (existing) return existing;

  const limiter = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(requests, `${windowSeconds} s`),
    prefix: `ratelimit:${key}`,
  });
  limiters.set(cacheKey, limiter);
  return limiter;
}

export type RateLimitResult = { success: true } | { success: false; message: string };

/**
 * Sliding-window rate limit keyed by client IP. No-ops (always succeeds) when
 * Upstash Redis isn't configured, consistent with the rest of the app's
 * graceful-degradation pattern for optional third-party services.
 */
export async function rateLimit(
  action: string,
  { requests, windowSeconds }: { requests: number; windowSeconds: number },
): Promise<RateLimitResult> {
  const limiter = getLimiter(action, requests, windowSeconds);
  if (!limiter) {
    return { success: true };
  }

  const headersList = await headers();
  const ip =
    headersList.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    headersList.get("x-real-ip") ??
    "anonymous";

  const { success } = await limiter.limit(`${action}:${ip}`);

  if (!success) {
    logger.warn("rate_limit_exceeded", { action, ip });
    return {
      success: false,
      message: "Trop de tentatives. Merci de réessayer dans quelques instants.",
    };
  }

  return { success: true };
}
