import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Hämta alla projekt (med valfri kategorifilter)
export const getAll = query({
  args: { category: v.optional(v.string()) },
  handler: async (ctx, args) => {
    const allProjects = await ctx.db.query("projects").collect();

    if (args.category && args.category !== "all") {
      return allProjects.filter(
        (project) => project.category === args.category,
      );
    }
    return allProjects;
  },
});

// Hämta utvalda projekt (featured)
export const getFeatured = query({
  handler: async (ctx) => {
    const allProjects = await ctx.db.query("projects").collect();
    return allProjects.filter((project) => project.featured === true);
  },
});

// Hämta alla unika kategorier
export const getCategories = query({
  handler: async (ctx) => {
    const allProjects = await ctx.db.query("projects").collect();
    const categories = allProjects.map((project) => project.category);
    return [...new Set(categories)];
  },
});

// Lägg till ett nytt projekt
export const add = mutation({
  args: {
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
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("projects", {
      ...args,
      completedAt: Date.now(),
    });
  },
});

// Uppdatera ett projekt
export const update = mutation({
  args: {
    id: v.id("projects"),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    technologies: v.optional(v.array(v.string())),
    category: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
    githubUrl: v.optional(v.string()),
    liveUrl: v.optional(v.string()),
    featured: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const { id, ...fields } = args;
    return await ctx.db.patch(id, fields);
  },
});

// Ta bort ett projekt
export const remove = mutation({
  args: { id: v.id("projects") },
  handler: async (ctx, args) => {
    return await ctx.db.delete(args.id);
  },
});
