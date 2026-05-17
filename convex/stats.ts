import { query } from "./_generated/server";

/** Publik köinfo för väntetidsvisning */
export const getQueueStats = query({
  handler: async (ctx) => {
    const pending = await ctx.db
      .query("requests")
      .withIndex("by_status", (q) => q.eq("status", "pending"))
      .collect();
    const inProgress = await ctx.db
      .query("requests")
      .withIndex("by_status", (q) => q.eq("status", "in-progress"))
      .collect();

    const queueLength = pending.length + inProgress.length;
    const waitingDays = Math.max(7, Math.ceil(queueLength * 1.75));

    return {
      queueLength,
      waitingDays,
      pendingCount: pending.length,
    };
  },
});
