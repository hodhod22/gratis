import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Skicka in en ny förfrågan
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
    const now = Date.now();

    await ctx.db.insert("requests", {
      ...args,
      status: "pending",
      priority: 3,
      createdAt: now,
      updatedAt: now,
    });

    return { success: true };
  },
});

// Admin: Hämta alla förfrågningar
export const getAllRequests = query({
  handler: async (ctx) => {
    return await ctx.db.query("requests").order("desc").collect();
  },
});

// Admin: Hämta förfrågningar efter status
export const getRequestsByStatus = query({
  args: { status: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("requests")
      .withIndex("by_status", (q) => q.eq("status", args.status))
      .order("desc")
      .collect();
  },
});

// Admin: Uppdatera status på en förfrågan
export const updateRequestStatus = mutation({
  args: {
    id: v.id("requests"),
    status: v.string(),
    adminNotes: v.optional(v.string()),
    completedUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      status: args.status,
      adminNotes: args.adminNotes,
      completedUrl: args.completedUrl,
      updatedAt: Date.now(),
    });
  },
});

// Admin: Uppdatera prioritet
export const updatePriority = mutation({
  args: {
    id: v.id("requests"),
    priority: v.number(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      priority: args.priority,
      updatedAt: Date.now(),
    });
  },
});

// Admin: Ta bort förfrågan
export const deleteRequest = mutation({
  args: { id: v.id("requests") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
