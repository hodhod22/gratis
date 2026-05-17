// convex/chat.ts
import { v } from "convex/values";
import { internal } from "./_generated/api";
import { mutation, query } from "./_generated/server";
import {
  requireAdmin,
  requireAuth,
  requireUserOrAdmin,
  isAdmin,
} from "./lib/auth";
import { enforceRateLimit } from "./lib/rateLimit";

export const generateUploadUrl = mutation({
  handler: async (ctx) => {
    await requireAuth(ctx);
    return await ctx.storage.generateUploadUrl();
  },
});

export const getImageUrl = query({
  args: { storageId: v.id("_storage") },
  handler: async (ctx, args) => {
    try {
      return await ctx.storage.getUrl(args.storageId);
    } catch {
      return null;
    }
  },
});

// Uppdaterad: Hantera oinloggade användare
export const getMessagesByEmail = query({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    const email = args.email.toLowerCase();
    const identity = await ctx.auth.getUserIdentity();
    const isAdminUser = identity?.email === "ezadkhahaali@gmail.com";
    const isOwner = identity?.email === email;

    // Om inte inloggad, inte admin, eller inte ägare - returnera tom array
    if (!identity || (!isAdminUser && !isOwner)) {
      return [];
    }

    const messages = await ctx.db
      .query("messages")
      .withIndex("by_email", (q) => q.eq("email", email))
      .collect();
    return messages.sort((a, b) => a.createdAt - b.createdAt);
  },
});

// Uppdaterad: Hantera oinloggade användare
export const getCustomerUnreadCount = query({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    const email = args.email.toLowerCase();
    const identity = await ctx.auth.getUserIdentity();
    const isAdminUser = identity?.email === "ezadkhahaali@gmail.com";
    const isOwner = identity?.email === email;

    // Om inte inloggad, inte admin, eller inte ägare - returnera 0
    if (!identity || (!isAdminUser && !isOwner)) {
      return 0;
    }

    const conv = await ctx.db
      .query("conversations")
      .withIndex("by_email", (q) => q.eq("email", email))
      .first();
    return conv?.customerUnreadCount ?? 0;
  },
});

export const markCustomerMessagesRead = mutation({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    const authEmail = await requireAuth(ctx);
    const email = args.email.toLowerCase();
    if (authEmail !== email) {
      throw new Error("Du får bara markera din egen chatt som läst");
    }
    const conv = await ctx.db
      .query("conversations")
      .withIndex("by_email", (q) => q.eq("email", email))
      .first();
    if (conv) {
      await ctx.db.patch(conv._id, { customerUnreadCount: 0 });
    }
  },
});

export const sendMessage = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    message: v.string(),
    attachments: v.optional(
      v.array(
        v.object({
          name: v.string(),
          storageId: v.id("_storage"),
          size: v.number(),
          type: v.string(),
        }),
      ),
    ),
  },
  handler: async (ctx, args) => {
    const authEmail = await requireAuth(ctx);
    const email = args.email.toLowerCase();
    if (authEmail !== email) {
      throw new Error("E-post måste matcha ditt inloggade konto");
    }

    await enforceRateLimit(ctx, `chat:${email}`, 30);

    await ctx.db.insert("messages", {
      name: args.name,
      email,
      message: args.message,
      attachments: args.attachments || [],
      isRead: false,
      isFromAdmin: false,
      createdAt: Date.now(),
    });

    const existingConv = await ctx.db
      .query("conversations")
      .withIndex("by_email", (q) => q.eq("email", email))
      .first();

    if (existingConv) {
      await ctx.db.patch(existingConv._id, {
        lastMessageAt: Date.now(),
        unreadCount: (existingConv.unreadCount || 0) + 1,
        isActive: true,
        name: args.name,
      });
    } else {
      await ctx.db.insert("conversations", {
        email,
        name: args.name,
        isActive: true,
        lastMessageAt: Date.now(),
        unreadCount: 1,
        customerUnreadCount: 0,
      });
    }

    await ctx.scheduler.runAfter(0, internal.emails.notifyAdminNewChatMessage, {
      name: args.name,
      email,
      message: args.message || "📎 Bilaga",
    });

    return { success: true };
  },
});

export const recordCustomerOnline = mutation({
  args: {
    email: v.string(),
    name: v.string(),
  },
  handler: async (ctx, args) => {
    const authEmail = await requireAuth(ctx);
    const email = args.email.toLowerCase();
    if (authEmail !== email) {
      throw new Error("Ogiltig e-post");
    }

    await enforceRateLimit(ctx, `ping:${email}`, 20);

    const now = Date.now();
    const existing = await ctx.db
      .query("conversations")
      .withIndex("by_email", (q) => q.eq("email", email))
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, { lastCustomerPingAt: now });
    } else {
      await ctx.db.insert("conversations", {
        email,
        name: args.name,
        isActive: true,
        lastMessageAt: now,
        unreadCount: 0,
        lastCustomerPingAt: now,
        customerUnreadCount: 0,
      });
    }
  },
});

export const sendAdminReply = mutation({
  args: {
    toEmail: v.string(),
    toName: v.string(),
    message: v.string(),
    attachments: v.optional(
      v.array(
        v.object({
          name: v.string(),
          storageId: v.id("_storage"),
          size: v.number(),
          type: v.string(),
        }),
      ),
    ),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    const toEmail = args.toEmail.toLowerCase();

    await ctx.db.insert("messages", {
      name: "Admin",
      email: toEmail,
      message: args.message,
      attachments: args.attachments || [],
      isRead: true,
      isFromAdmin: true,
      createdAt: Date.now(),
    });

    const conv = await ctx.db
      .query("conversations")
      .withIndex("by_email", (q) => q.eq("email", toEmail))
      .first();

    if (conv) {
      await ctx.db.patch(conv._id, {
        lastMessageAt: Date.now(),
        unreadCount: 0,
        isActive: true,
        customerUnreadCount: (conv.customerUnreadCount ?? 0) + 1,
      });
    }

    return { success: true };
  },
});
