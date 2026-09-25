/**
 * A simple fixed-window, per-IP limit. In-memory per server instance, which is enough at
 * this site's volume to stop one client from using the form to flood an inbox.
 */
export function createRateLimiter(limit: number, windowMs: number) {
  const hits = new Map<string, { count: number; reset: number }>();
  return function check(key: string, now = Date.now()): boolean {
    const entry = hits.get(key);
    if (!entry || now > entry.reset) {
      hits.set(key, { count: 1, reset: now + windowMs });
      return true;
    }
    entry.count += 1;
    return entry.count <= limit;
  };
}
