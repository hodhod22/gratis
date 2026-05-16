import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const updateAdminStatus = mutation({
  args: { isOnline: v.boolean() },
  handler: async (ctx, args) => {
    const existing = await ctx.db.query("adminStatus").first();

    if (existing) {
      await ctx.db.patch(existing._id, {
        isOnline: args.isOnline,
        lastSeen: Date.now(),
        lastActive: Date.now(),
      });
    } else {
      await ctx.db.insert("adminStatus", {
        isOnline: args.isOnline,
        lastSeen: Date.now(),
        lastActive: Date.now(),
      });
    }
  },
});

export const getAdminStatus = query({
  handler: async (ctx) => {
    const status = await ctx.db.query("adminStatus").first();
    if (!status) {
      return { isOnline: false };
    }
    // Admin är online om status uppdaterats inom 2 minuter
    const twoMinutesAgo = Date.now() - 2 * 60 * 1000;
    const isOnline = status.isOnline && status.lastActive > twoMinutesAgo;
    return { isOnline, lastActive: status.lastActive };
  },
});
