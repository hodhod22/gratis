import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getAllPublished = query({
  handler: async (ctx) => {
    const blogs = await ctx.db.query("blogs").collect();
    return blogs
      .filter((b) => b.isPublished === true)
      .sort((a, b) => b.publishedAt - a.publishedAt);
  },
});

export const getBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    const blogs = await ctx.db.query("blogs").collect();
    return blogs.find((b) => b.slug === args.slug);
  },
});

export const add = mutation({
  args: {
    title: v.string(),
    slug: v.string(),
    excerpt: v.string(),
    content: v.string(),
    coverImage: v.optional(v.string()),
    category: v.string(),
    tags: v.array(v.string()),
    isPublished: v.boolean(),
  },
  handler: async (ctx, args) => {
    const readTime = Math.ceil(args.content.split(" ").length / 200);
    return await ctx.db.insert("blogs", {
      ...args,
      readTime,
      publishedAt: Date.now(),
    });
  },
});
