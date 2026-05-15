import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://freewebdev.se";
  
  // Dynamiska routes som du kan lägga till
  const staticPages = [
    "",
    "/about",
    "/blog",
    "/projects",
    "/request",
    "/donate",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1 : 0.8,
  }));
  
  // Hämta bloggar från Convex (om du har)
  // const blogs = await fetchQuery(api.blog.getAllPublished);
  // const blogPages = blogs.map((blog) => ({
  //   url: `${baseUrl}/blog/${blog.slug}`,
  //   lastModified: new Date(blog.publishedAt),
  //   changeFrequency: "monthly" as const,
  //   priority: 0.6,
  // }));
  
  return [...staticPages];
}