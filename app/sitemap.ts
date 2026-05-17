import { MetadataRoute } from "next";
import { fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://freewebdev.se";

  const staticPages = [
    "",
    "/about",
    "/blog",
    "/projects",
    "/request",
    "/donate",
    "/integritet",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1 : 0.8,
  }));

  let blogPages: MetadataRoute.Sitemap = [];
  try {
    const blogs = await fetchQuery(api.blog.getAllPublished);
    blogPages = blogs.map((blog) => ({
      url: `${baseUrl}/blog/${blog.slug}`,
      lastModified: new Date(blog.publishedAt),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }));
  } catch {
    // Convex otillgänglig vid build — statiska sidor räcker
  }

  return [...staticPages, ...blogPages];
}
