import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

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
    console.log("🔍 Söker efter blogg med slug:", args.slug);
    const allBlogs = await ctx.db.query("blogs").collect();
    console.log(
      "📚 Alla bloggar:",
      allBlogs.map((b) => ({ title: b.title, slug: b.slug })),
    );
    const blog = allBlogs.find((b) => b.slug === args.slug);
    console.log("✅ Hittad blogg:", blog?.title);
    return blog;
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
    const { id, ...fields } = args;
    await ctx.db.patch(id, fields);
  },
});

// Admin: Ta bort blogginlägg
export const deleteBlog = mutation({
  args: { id: v.id("blogs") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
