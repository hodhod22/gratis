// convex/schema.ts
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  projects: defineTable({
    title: v.string(),
    slug: v.string(),
    description: v.string(),
    longDescription: v.optional(v.string()),
    technologies: v.array(v.string()),
    category: v.string(),
    imageUrl: v.string(),
    githubUrl: v.optional(v.string()),
    liveUrl: v.optional(v.string()),
    featured: v.boolean(),
    completedAt: v.number(),
  }),

  blogs: defineTable({
    title: v.string(),
    slug: v.string(),
    excerpt: v.string(),
    content: v.string(),
    coverImage: v.optional(v.string()),
    category: v.string(),
    publishedAt: v.number(),
    readTime: v.number(),
    tags: v.array(v.string()),
    isPublished: v.boolean(),
  }),

  // messages tabell med Convex Storage support
  messages: defineTable({
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
    isRead: v.boolean(),
    isFromAdmin: v.boolean(),
    createdAt: v.number(),
  })
    .index("by_email", ["email"])
    .index("by_createdAt", ["createdAt"]),

  conversations: defineTable({
    email: v.string(),
    name: v.string(),
    isActive: v.boolean(),
    lastMessageAt: v.number(),
    unreadCount: v.number(),
    adminClosedAt: v.optional(v.number()),
    lastCustomerPingAt: v.optional(v.number()),
    customerUnreadCount: v.optional(v.number()),
  })
    .index("by_email", ["email"])
    .index("by_isActive", ["isActive"])
    .index("by_lastMessageAt", ["lastMessageAt"]),

  requests: defineTable({
    name: v.string(),
    email: v.string(),
    websiteType: v.string(),
    description: v.string(),
    requirements: v.string(),
    deadline: v.optional(v.string()),
    budget: v.string(),
    status: v.string(),
    priority: v.number(),
    createdAt: v.number(),
    updatedAt: v.number(),
    adminNotes: v.optional(v.string()),
    completedUrl: v.optional(v.string()),
  })
    .index("by_status", ["status"])
    .index("by_priority", ["priority"])
    .index("by_createdAt", ["createdAt"]),

  donations: defineTable({
    name: v.string(),
    email: v.string(),
    amount: v.number(),
    message: v.optional(v.string()),
    isAnonymous: v.boolean(),
    createdAt: v.number(),
  }).index("by_createdAt", ["createdAt"]),

  adminStatus: defineTable({
    isOnline: v.boolean(),
    lastSeen: v.number(),
    lastActive: v.number(),
  }),

  rateLimits: defineTable({
    key: v.string(),
    count: v.number(),
    windowStart: v.number(),
  }).index("by_key", ["key"]),

  // 🆕 NEW: Users table for admin management
  users: defineTable({
    tokenIdentifier: v.string(),
    email: v.string(),
    name: v.string(),
    isAdmin: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_token", ["tokenIdentifier"])
    .index("by_email", ["email"]),
  // Lägg till i din convex/schema.ts

 // convex/schema.ts - Lägg till adminNotes i meetings

meetings: defineTable({
  name: v.string(),
  email: v.string(),
  phone: v.optional(v.string()),
  date: v.string(),
  time: v.string(),
  meetingType: v.string(),
  message: v.optional(v.string()),
  status: v.string(), // pending, confirmed, completed, cancelled
  meetingLink: v.optional(v.string()),
  adminNotes: v.optional(v.string()), // 🆕 Lägg till denna rad
  createdAt: v.number(),
  updatedAt: v.number(),
})
  .index("by_email", ["email"])
  .index("by_status", ["status"])
  .index("by_date", ["date"])
  .index("by_createdAt", ["createdAt"]),
});
