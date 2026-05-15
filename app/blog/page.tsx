import { fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import BlogCard from "@/components/BlogCard";
import { Doc } from "@/convex/_generated/dataModel";

export const metadata = {
  title: "Blogg | Min Portfolio",
  description:
    "Tankar, tips och insikter om webbutveckling, Next.js och TypeScript",
};

export default async function BlogPage() {
  let blogs: Doc<"blogs">[] = [];

  try {
    blogs = await fetchQuery(api.blog.getAllPublished);
  } catch (error) {
    console.error("Failed to fetch blogs:", error);
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Min Blogg
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          Tankar, tips och insikter om webbutveckling, Next.js och modern
          frontend
        </p>
      </div>

      {/* Blog Grid */}
      {blogs.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-slate-500 dark:text-slate-400">
            Inga blogginlägg ännu. Kom snart tillbaka!
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogs.map((blog) => (
            <BlogCard key={blog._id} blog={blog} />
          ))}
        </div>
      )}
    </div>
  );
}
