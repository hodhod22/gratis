import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// ============ KONVERSATIONER ============

// Hämta alla konversationer
export const getAllConversations = query({
  handler: async (ctx) => {
    const conversations = await ctx.db
      .query("conversations")
      .order("desc")
      .collect();
    const result = [];
    for (const conv of conversations) {
      const messages = await ctx.db
        .query("messages")
        .filter((q) => q.eq(q.field("email"), conv.email))
        .order("desc")
        .take(1);
      result.push({ ...conv, lastMessage: messages[0]?.message || "" });
    }
    return result;
  },
});

// Hämta aktiva konversationer
export const getActiveConversations = query({
  handler: async (ctx) => {
    const conversations = await ctx.db
      .query("conversations")
      .filter((q) => q.eq(q.field("isActive"), true))
      .order("desc")
      .collect();
    const result = [];
    for (const conv of conversations) {
      const messages = await ctx.db
        .query("messages")
        .filter((q) => q.eq(q.field("email"), conv.email))
        .order("desc")
        .take(1);
      result.push({ ...conv, lastMessage: messages[0]?.message || "" });
    }
    return result;
  },
});

// Hämta stängda konversationer
export const getClosedConversations = query({
  handler: async (ctx) => {
    const conversations = await ctx.db
      .query("conversations")
      .filter((q) => q.eq(q.field("isActive"), false))
      .order("desc")
      .collect();
    const result = [];
    for (const conv of conversations) {
      const messages = await ctx.db
        .query("messages")
        .filter((q) => q.eq(q.field("email"), conv.email))
        .order("desc")
        .take(1);
      result.push({ ...conv, lastMessage: messages[0]?.message || "" });
    }
    return result;
  },
});

// Öppna en konversation (gör den aktiv)
export const openConversation = mutation({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("conversations")
      .filter((q) => q.eq(q.field("email"), args.email))
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, {
        isActive: true,
        unreadCount: 0,
      });
    } else {
      const messages = await ctx.db
        .query("messages")
        .filter((q) => q.eq(q.field("email"), args.email))
        .order("desc")
        .take(1);

      await ctx.db.insert("conversations", {
        email: args.email,
        name: messages[0]?.name || "Användare",
        isActive: true,
        lastMessageAt: Date.now(),
        unreadCount: 0,
      });
    }
  },
});

// Stäng en konversation
export const closeConversation = mutation({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("conversations")
      .filter((q) => q.eq(q.field("email"), args.email))
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, {
        isActive: false,
        adminClosedAt: Date.now(),
      });
    }
  },
});

// Hämta meddelanden för en konversation
export const getConversationMessages = query({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("messages")
      .filter((q) => q.eq(q.field("email"), args.email))
      .order("asc")
      .collect();
  },
});

// Markera meddelanden som lästa
export const markMessagesAsRead = mutation({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    const messages = await ctx.db
      .query("messages")
      .filter((q) => q.eq(q.field("email"), args.email))
      .collect();
    for (const msg of messages) {
      if (!msg.isRead && !msg.isFromAdmin) {
        await ctx.db.patch(msg._id, { isRead: true });
      }
    }
    const conv = await ctx.db
      .query("conversations")
      .filter((q) => q.eq(q.field("email"), args.email))
      .first();
    if (conv) {
      await ctx.db.patch(conv._id, { unreadCount: 0 });
    }
  },
});

// Radera meddelande
export const deleteMessage = mutation({
  args: { id: v.id("messages") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

// Hämta antal olästa
export const getUnreadCount = query({
  handler: async (ctx) => {
    const conversations = await ctx.db
      .query("conversations")
      .filter((q) => q.eq(q.field("isActive"), true))
      .collect();
    return conversations.reduce((sum, c) => sum + (c.unreadCount || 0), 0);
  },
});

// ============ FÖRFRÅGNINGAR ============

export const getAllRequests = query({
  handler: async (ctx) => {
    return await ctx.db.query("requests").order("desc").collect();
  },
});

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

export const updateRequestPriority = mutation({
  args: { id: v.id("requests"), priority: v.number() },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      priority: args.priority,
      updatedAt: Date.now(),
    });
  },
});

export const deleteRequest = mutation({
  args: { id: v.id("requests") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
