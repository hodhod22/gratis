import { fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import { notFound } from "next/navigation";
import {
  FiClock,
  FiCalendar,
  FiTag,
  FiArrowLeft,
  FiUser,
} from "react-icons/fi";
import Link from "next/link";

interface BlogPostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: BlogPostPageProps) {
  const { slug } = await params;
  try {
    const blog = await fetchQuery(api.blog.getBySlug, { slug });
    if (!blog) return { title: "Blogginlägg ej hittat" };
    return {
      title: `${blog.title} | FreeWebDev`,
      description: blog.excerpt,
    };
  } catch {
    return { title: "Blogginlägg ej hittat" };
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;

  try {
    const blog = await fetchQuery(api.blog.getBySlug, { slug });

    if (!blog) {
      return notFound();
    }

    const date = new Date(blog.publishedAt).toLocaleDateString("sv-SE", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    const formatContent = (content: string) => {
      if (!content) return <p>Inget innehåll</p>;

      return content.split("\n").map((line, index) => {
        if (line.startsWith("# ")) {
          return (
            <h1 key={index} className="text-4xl font-bold mt-8 mb-4">
              {line.substring(2)}
            </h1>
          );
        }
        if (line.startsWith("## ")) {
          return (
            <h2 key={index} className="text-2xl font-bold mt-6 mb-3">
              {line.substring(3)}
            </h2>
          );
        }
        if (line.startsWith("### ")) {
          return (
            <h3 key={index} className="text-xl font-bold mt-4 mb-2">
              {line.substring(4)}
            </h3>
          );
        }
        if (line.startsWith("- ")) {
          return (
            <li key={index} className="ml-4 mb-1">
              {line.substring(2)}
            </li>
          );
        }
        if (line.startsWith("```")) {
          const code = line.replace(/```/g, "");
          return (
            <pre
              key={index}
              className="bg-slate-900 text-white p-4 rounded-lg overflow-x-auto my-4"
            >
              <code>{code}</code>
            </pre>
          );
        }
        if (line.trim() === "") {
          return <br key={index} />;
        }
        return (
          <p key={index} className="mb-4 leading-relaxed">
            {line}
          </p>
        );
      });
    };

    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 max-w-4xl">
        {/* Tillbaka knapp - toppen */}
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 mb-8 transition-colors"
        >
          <FiArrowLeft />
          Tillbaka till bloggen
        </Link>

        <header className="mb-8">
          <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500 dark:text-slate-400 mb-4">
            <span className="flex items-center gap-1">
              <FiCalendar className="w-4 h-4" />
              {date}
            </span>
            <span className="flex items-center gap-1">
              <FiClock className="w-4 h-4" />
              {blog.readTime} min läsning
            </span>
            <span className="flex items-center gap-1">
              <FiUser className="w-4 h-4" />
              Ali
            </span>
          </div>

          <h1 className="text-3xl md:text-5xl font-bold mb-4 bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {blog.title}
          </h1>

          <div className="flex flex-wrap gap-2">
            <span className="text-sm px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full">
              {blog.category}
            </span>
            {blog.tags?.map((tag: string) => (
              <span
                key={tag}
                className="text-sm px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center gap-1"
              >
                <FiTag className="w-3 h-3" />
                {tag}
              </span>
            ))}
          </div>
        </header>

        {blog.coverImage && (
          <div className="mb-8 rounded-xl overflow-hidden shadow-lg">
            <img
              src={blog.coverImage}
              alt={blog.title}
              className="w-full h-auto object-cover"
            />
          </div>
        )}

        <article className="prose prose-lg dark:prose-invert max-w-none">
          {formatContent(blog.content)}
        </article>

        {/* Tillbaka knapp - slutet */}
        <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-700 text-center">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            <FiArrowLeft />
            Tillbaka till bloggen
          </Link>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error loading blog post:", error);
    return notFound();
  }
}
