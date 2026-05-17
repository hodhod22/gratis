import { v } from "convex/values";
import { internal } from "./_generated/api";
import { mutation } from "./_generated/server";
import { enforceRateLimit } from "./lib/rateLimit";

export const submitRequest = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    websiteType: v.string(),
    description: v.string(),
    requirements: v.string(),
    deadline: v.optional(v.string()),
    budget: v.string(),
  },
  handler: async (ctx, args) => {
    const email = args.email.toLowerCase().trim();
    if (!email.includes("@")) {
      throw new Error("Ogiltig e-postadress");
    }

    await enforceRateLimit(ctx, `request:${email}`, 3);

    const now = Date.now();

    await ctx.db.insert("requests", {
      ...args,
      email,
      status: "pending",
      priority: 3,
      createdAt: now,
      updatedAt: now,
    });

    await ctx.scheduler.runAfter(0, internal.emails.notifyAdminNewRequest, {
      name: args.name,
      email,
      websiteType: args.websiteType,
      description: args.description,
    });

    return { success: true };
  },
});
