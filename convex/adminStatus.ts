import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Uppdatera admin status (körs från admin-panelen)
export const updateAdminStatus = mutation({
  args: {
    isOnline: v.boolean(),
  },
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

// Hämta admin status (för kunder)
export const getAdminStatus = query({
  handler: async (ctx) => {
    const status = await ctx.db.query("adminStatus").first();
    if (!status) {
      return { isOnline: false, lastSeen: Date.now(), lastActive: Date.now() };
    }
    // Om admin inte uppdaterat status på 2 minuter, markera som offline
    const twoMinutesAgo = Date.now() - 2 * 60 * 1000;
    if (status.lastActive < twoMinutesAgo && status.isOnline) {
      return { ...status, isOnline: false };
    }
    return status;
  },
});
