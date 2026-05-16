import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

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

export const sendMessage = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    message: v.string(),
  },
  handler: async (ctx, args) => {
    console.log("💬 Nytt meddelande från:", args.name, "(", args.email, ")");
    console.log("💬 Meddelande:", args.message);

    await ctx.db.insert("messages", {
      name: args.name,
      email: args.email,
      message: args.message,
      isRead: false,
      isFromAdmin: false,
      createdAt: Date.now(),
    });

    const existingConv = await ctx.db
      .query("conversations")
      .filter((q) => q.eq(q.field("email"), args.email))
      .first();

    if (existingConv) {
      await ctx.db.patch(existingConv._id, {
        lastMessageAt: Date.now(),
        unreadCount: (existingConv.unreadCount || 0) + 1,
        isActive: true,
      });
    } else {
      await ctx.db.insert("conversations", {
        email: args.email,
        name: args.name,
        isActive: true,
        lastMessageAt: Date.now(),
        unreadCount: 1,
      });
    }

    return { success: true };
  },
});

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
      .filter((q) => q.eq(q.field("email"), args.toEmail))
      .first();

    if (conv) {
      await ctx.db.patch(conv._id, {
        lastMessageAt: Date.now(),
        unreadCount: 0,
        isActive: true,
      });
    }

    return { success: true };
  },
});
