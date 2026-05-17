import type { MutationCtx } from "../_generated/server";

const WINDOW_MS = 60 * 60 * 1000;

export async function enforceRateLimit(
  ctx: MutationCtx,
  key: string,
  maxPerHour: number,
): Promise<void> {
  const now = Date.now();
  const existing = await ctx.db
    .query("rateLimits")
    .withIndex("by_key", (q) => q.eq("key", key))
    .first();

  if (!existing) {
    await ctx.db.insert("rateLimits", { key, count: 1, windowStart: now });
    return;
  }

  if (now - existing.windowStart > WINDOW_MS) {
    await ctx.db.patch(existing._id, { count: 1, windowStart: now });
    return;
  }

  if (existing.count >= maxPerHour) {
    throw new Error("För många försök. Försök igen om en timme.");
  }

  await ctx.db.patch(existing._id, { count: existing.count + 1 });
}
