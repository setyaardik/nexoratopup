/**
 * In-memory sliding-window rate limiter. Good enough for a single Node.js
 * instance; swap for a Redis-backed limiter if you scale to multiple
 * instances/processes.
 */

const buckets = new Map<string, number[]>();
let requestsSinceSweep = 0;

function sweep(windowMs: number) {
  const now = Date.now();
  for (const [key, timestamps] of buckets) {
    const fresh = timestamps.filter((t) => now - t < windowMs);
    if (fresh.length === 0) buckets.delete(key);
    else buckets.set(key, fresh);
  }
}

export function checkRateLimit(
  key: string,
  limit: number,
  windowMs: number
): { allowed: boolean; retryAfterMs: number } {
  const now = Date.now();

  requestsSinceSweep += 1;
  if (requestsSinceSweep > 200) {
    requestsSinceSweep = 0;
    sweep(windowMs);
  }

  const timestamps = (buckets.get(key) ?? []).filter((t) => now - t < windowMs);

  if (timestamps.length >= limit) {
    buckets.set(key, timestamps);
    return { allowed: false, retryAfterMs: windowMs - (now - timestamps[0]) };
  }

  timestamps.push(now);
  buckets.set(key, timestamps);
  return { allowed: true, retryAfterMs: 0 };
}

export function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]!.trim();
  return request.headers.get("x-real-ip") ?? "unknown";
}
