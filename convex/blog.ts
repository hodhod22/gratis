import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { requireAdmin } from "./lib/auth";

// Hämta alla publicerade blogginlägg
export const getAllPublished = query({
  handler: async (ctx) => {
    const blogs = await ctx.db
      .query("blogs")
      .filter((q) => q.eq(q.field("isPublished"), true))
      .order("desc")
      .collect();
    return blogs;
  },
});

// Hämta ett blogginlägg via slug
export const getBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    const blog = await ctx.db
      .query("blogs")
      .filter((q) => q.eq(q.field("slug"), args.slug))
      .first();
    return blog ?? null;
  },
});

// Admin: Skapa nytt blogginlägg
export const createBlog = mutation({
  args: {
    title: v.string(),
    slug: v.string(),
    excerpt: v.string(),
    content: v.string(),
    coverImage: v.optional(v.string()),
    category: v.string(),
    tags: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    const now = Date.now();
    const readTime = Math.ceil(args.content.split(" ").length / 200);

    await ctx.db.insert("blogs", {
      ...args,
      readTime,
      publishedAt: now,
      isPublished: true,
    });
  },
});

// Admin: Uppdatera blogginlägg
export const updateBlog = mutation({
  args: {
    id: v.id("blogs"),
    title: v.optional(v.string()),
    excerpt: v.optional(v.string()),
    content: v.optional(v.string()),
    coverImage: v.optional(v.string()),
    category: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
    isPublished: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    const { id, ...fields } = args;
    await ctx.db.patch(id, fields);
  },
});

// Admin: Ta bort blogginlägg
export const deleteBlog = mutation({
  args: { id: v.id("blogs") },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    await ctx.db.delete(args.id);
  },
});
