// convex/admin.ts
import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { requireAdmin } from "./lib/auth";

// ============ KONVERSATIONER ============

// Hämta alla konversationer
export const getAllConversations = query({
  handler: async (ctx) => {
    await requireAdmin(ctx);
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

      result.push({
        ...conv,
        lastMessage: messages[0]?.message || "",
      });
    }
    return result;
  },
});

// Hämta aktiva konversationer
export const getActiveConversations = query({
  handler: async (ctx) => {
    await requireAdmin(ctx);
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

      result.push({
        ...conv,
        lastMessage: messages[0]?.message || "",
      });
    }
    return result;
  },
});

// Hämta stängda konversationer
export const getClosedConversations = query({
  handler: async (ctx) => {
    await requireAdmin(ctx);
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

      result.push({
        ...conv,
        lastMessage: messages[0]?.message || "",
      });
    }
    return result;
  },
});

// Hämta konversation via ID
export const getConversationById = query({
  args: { id: v.id("conversations") },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    return await ctx.db.get(args.id);
  },
});

// Hämta konversation via email
export const getConversationByEmail = query({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    return await ctx.db
      .query("conversations")
      .filter((q) => q.eq(q.field("email"), args.email))
      .first();
  },
});

// Öppna en konversation
export const openConversation = mutation({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    const existing = await ctx.db
      .query("conversations")
      .filter((q) => q.eq(q.field("email"), args.email))
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, {
        isActive: true,
        unreadCount: 0,
        adminClosedAt: undefined,
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
    await requireAdmin(ctx);
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
    await requireAdmin(ctx);
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
    await requireAdmin(ctx);
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

// Radera ett meddelande (och dess filer från storage)
export const deleteMessage = mutation({
  args: { id: v.id("messages") },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    const message = await ctx.db.get(args.id);
    if (message?.attachments) {
      for (const file of message.attachments) {
        if (file.storageId) {
          await ctx.storage.delete(file.storageId);
        }
      }
    }
    await ctx.db.delete(args.id);
  },
});

// Hämta antal olästa meddelanden
export const getUnreadCount = query({
  handler: async (ctx) => {
    await requireAdmin(ctx);
    const conversations = await ctx.db
      .query("conversations")
      .filter((q) => q.eq(q.field("isActive"), true))
      .collect();
    return conversations.reduce((sum, c) => sum + (c.unreadCount || 0), 0);
  },
});

// Fixa gamla meddelanden som saknar storageId
export const fixOldMessages = mutation({
  handler: async (ctx) => {
    await requireAdmin(ctx);
    const messages = await ctx.db.query("messages").collect();
    let fixed = 0;
    for (const msg of messages) {
      if (msg.attachments && msg.attachments.length > 0) {
        const needsFix = msg.attachments.some((f: any) => !f.storageId);
        if (needsFix) {
          await ctx.db.patch(msg._id, { attachments: [] });
          fixed++;
        }
      }
    }
    return { fixed };
  },
});

// Rensa bort tomma konversationer
export const cleanOldConversations = mutation({
  handler: async (ctx) => {
    await requireAdmin(ctx);
    const conversations = await ctx.db.query("conversations").collect();
    let deleted = 0;
    for (const conv of conversations) {
      const messages = await ctx.db
        .query("messages")
        .filter((q) => q.eq(q.field("email"), conv.email))
        .collect();
      if (messages.length === 0) {
        await ctx.db.delete(conv._id);
        deleted++;
      }
    }
    return { deleted };
  },
});

// ============ FÖRFRÅGNINGAR ============

// Hämta alla förfrågningar
export const getAllRequests = query({
  handler: async (ctx) => {
    await requireAdmin(ctx);
    return await ctx.db.query("requests").order("desc").collect();
  },
});

// Hämta förfrågan via ID
export const getRequestById = query({
  args: { id: v.id("requests") },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    return await ctx.db.get(args.id);
  },
});

// Hämta förfrågningar efter status
export const getRequestsByStatus = query({
  args: { status: v.string() },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    return await ctx.db
      .query("requests")
      .filter((q) => q.eq(q.field("status"), args.status))
      .order("desc")
      .collect();
  },
});

// Hämta förfrågningar sorterade efter prioritet
export const getRequestsByPriority = query({
  handler: async (ctx) => {
    await requireAdmin(ctx);
    const requests = await ctx.db.query("requests").order("desc").collect();
    return requests.sort((a, b) => b.priority - a.priority);
  },
});

// Hämta statistik för förfrågningar
export const getRequestsStats = query({
  handler: async (ctx) => {
    await requireAdmin(ctx);
    const allRequests = await ctx.db.query("requests").collect();

    return {
      total: allRequests.length,
      pending: allRequests.filter((r) => r.status === "pending").length,
      inProgress: allRequests.filter((r) => r.status === "in-progress").length,
      completed: allRequests.filter((r) => r.status === "completed").length,
      rejected: allRequests.filter((r) => r.status === "rejected").length,
      averagePriority:
        allRequests.reduce((sum, r) => sum + r.priority, 0) /
        (allRequests.length || 1),
    };
  },
});

// Uppdatera status på en förfrågan
export const updateRequestStatus = mutation({
  args: {
    id: v.id("requests"),
    status: v.string(),
    adminNotes: v.optional(v.string()),
    completedUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    await ctx.db.patch(args.id, {
      status: args.status,
      adminNotes: args.adminNotes,
      completedUrl: args.completedUrl,
      updatedAt: Date.now(),
    });
  },
});

// Uppdatera prioritet på en förfrågan
export const updateRequestPriority = mutation({
  args: {
    id: v.id("requests"),
    priority: v.number(),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    await ctx.db.patch(args.id, {
      priority: args.priority,
      updatedAt: Date.now(),
    });
  },
});

// Lägg till kommentar på en förfrågan
export const addRequestComment = mutation({
  args: {
    id: v.id("requests"),
    comment: v.string(),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    const request = await ctx.db.get(args.id);
    const existingComments = request?.adminNotes || "";
    const timestamp = new Date().toLocaleString("sv-SE");
    const newComment = `[${timestamp}] ${args.comment}\n${existingComments}`;

    await ctx.db.patch(args.id, {
      adminNotes: newComment,
      updatedAt: Date.now(),
    });
  },
});

// Bulk uppdatering av status (för flera förfrågningar)
export const bulkUpdateRequestStatus = mutation({
  args: {
    ids: v.array(v.id("requests")),
    status: v.string(),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    let count = 0;
    for (const id of args.ids) {
      await ctx.db.patch(id, {
        status: args.status,
        updatedAt: Date.now(),
      });
      count++;
    }
    return { success: true, count };
  },
});

// Arkivera gamla färdiga förfrågningar
export const archiveOldCompleted = mutation({
  args: {
    olderThanDays: v.number(),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    const cutoffDate = Date.now() - args.olderThanDays * 24 * 60 * 60 * 1000;
    const completedRequests = await ctx.db
      .query("requests")
      .filter((q) => q.eq(q.field("status"), "completed"))
      .collect();

    const toArchive = completedRequests.filter((r) => r.updatedAt < cutoffDate);
    let archived = 0;
    for (const req of toArchive) {
      await ctx.db.patch(req._id, {
        status: "archived",
        updatedAt: Date.now(),
      });
      archived++;
    }

    return { archived };
  },
});

// Ta bort en förfrågan
export const deleteRequest = mutation({
  args: { id: v.id("requests") },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    await ctx.db.delete(args.id);
  },
});

// ============ STATISTIK / DASHBOARD ============

// Hämta statistik för admin dashboard
export const getAdminStats = query({
  handler: async (ctx) => {
    await requireAdmin(ctx);

    const activeConversations = await ctx.db
      .query("conversations")
      .filter((q) => q.eq(q.field("isActive"), true))
      .collect();

    const unreadMessages = await ctx.db
      .query("messages")
      .filter((q) => q.eq(q.field("isRead"), false))
      .filter((q) => q.eq(q.field("isFromAdmin"), false))
      .collect();

    const pendingRequests = await ctx.db
      .query("requests")
      .filter((q) => q.eq(q.field("status"), "pending"))
      .collect();

    const totalDonations = await ctx.db.query("donations").collect();
    const totalAmount = totalDonations.reduce((sum, d) => sum + d.amount, 0);

    return {
      activeConversations: activeConversations.length,
      closedConversations: await ctx.db
        .query("conversations")
        .filter((q) => q.eq(q.field("isActive"), false))
        .collect()
        .then((c) => c.length),
      unreadMessages: unreadMessages.length,
      pendingRequests: pendingRequests.length,
      totalDonations: totalDonations.length,
      totalAmount: totalAmount,
    };
  },
});
