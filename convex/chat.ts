import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Hämta meddelanden för en specifik användare
export const getMessagesByEmail = query({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    const messages = await ctx.db
      .query("messages")
      .filter((q) => q.eq(q.field("email"), args.email))
      .order("asc")
      .collect();
    return messages;
  },
});

// Skicka meddelande (från kund)
export const sendMessage = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    message: v.string(),
  },
  handler: async (ctx, args) => {
    if (!args.email) {
      throw new Error("Du måste vara inloggad för att skicka meddelanden");
    }

    await ctx.db.insert("messages", {
      ...args,
      isRead: false,
      isFromAdmin: false,
      createdAt: Date.now(),
    });

    const existingConv = await ctx.db
      .query("conversations")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();

    if (existingConv) {
      const newUnreadCount = existingConv.isActive
        ? 0
        : existingConv.unreadCount + 1;
      await ctx.db.patch(existingConv._id, {
        lastMessageAt: Date.now(),
        unreadCount: newUnreadCount,
      });
    } else {
      await ctx.db.insert("conversations", {
        email: args.email,
        name: args.name,
        isActive: false,
        lastMessageAt: Date.now(),
        unreadCount: 1,
      });
    }

    return { success: true };
  },
});

// Skicka svar från admin
export const sendAdminReply = mutation({
  args: {
    toEmail: v.string(),
    toName: v.string(),
    message: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("messages", {
      name: "Admin",
      email: args.toEmail,
      message: args.message,
      isRead: true,
      isFromAdmin: true,
      createdAt: Date.now(),
    });

    const conv = await ctx.db
      .query("conversations")
      .withIndex("by_email", (q) => q.eq("email", args.toEmail))
      .first();

    if (conv) {
      await ctx.db.patch(conv._id, { lastMessageAt: Date.now() });
    }

    return { success: true };
  },
});
