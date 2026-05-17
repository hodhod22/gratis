// app/admin/components/BlogManager.tsx
"use client";

import { useState } from "react";
import { FiEdit, FiSave, FiTrash2, FiEye, FiPlus } from "react-icons/fi";

interface Blog {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  tags: string[];
  coverImage?: string;
  readTime: number;
  publishedAt: number;
}

interface BlogManagerProps {
  blogs: Blog[];
  onCreate: (blog: any) => Promise<any>;
  onUpdate: (id: string, blog: any) => Promise<any>;
  onDelete: (id: string) => Promise<any>;
}

export default function BlogManager({
  blogs,
  onCreate,
  onUpdate,
  onDelete,
}: BlogManagerProps) {
  const [editingBlog, setEditingBlog] = useState<Blog | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    category: "",
    tags: "",
    coverImage: "",
  });

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const tagsArray = form.tags.split(",").map((t) => t.trim());
      const blogData = { ...form, tags: tagsArray };

      if (editingBlog) {
        await onUpdate(editingBlog._id, blogData);
      } else {
        await onCreate(blogData);
      }

      setEditingBlog(null);
      setShowForm(false);
      setForm({
        title: "",
        slug: "",
        excerpt: "",
        content: "",
        category: "",
        tags: "",
        coverImage: "",
      });
    } catch (error) {
      console.error("Error saving blog:", error);
      alert("Kunde inte spara blogginlägget");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (blog: Blog) => {
    setEditingBlog(blog);
    setForm({
      title: blog.title,
      slug: blog.slug,
      excerpt: blog.excerpt,
      content: blog.content,
      category: blog.category,
      tags: blog.tags.join(", "),
      coverImage: blog.coverImage || "",
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Är du säker på att du vill radera detta blogginlägg?")) {
      setIsLoading(true);
      try {
        await onDelete(id);
      } catch (error) {
        console.error("Error deleting blog:", error);
        alert("Kunde inte radera blogginlägget");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleCancel = () => {
    setEditingBlog(null);
    setShowForm(false);
    setForm({
      title: "",
      slug: "",
      excerpt: "",
      content: "",
      category: "",
      tags: "",
      coverImage: "",
    });
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <FiEdit className="text-blue-500" /> Blogginlägg
        </h2>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            disabled={isLoading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 text-sm disabled:opacity-50"
          >
            <FiPlus /> Nytt inlägg
          </button>
        )}
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-4 mb-6">
          <h3 className="font-medium mb-3">
            {editingBlog ? "✏️ Redigera inlägg" : "📝 Skapa nytt inlägg"}
          </h3>

          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <input
              type="text"
              placeholder="Titel"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-800"
              disabled={isLoading}
            />
            <input
              type="text"
              placeholder="Slug (url-namn)"
              value={form.slug}
              onChange={(e) => setForm({ ...form, slug: e.target.value })}
              className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-800"
              disabled={isLoading}
            />
          </div>

          <input
            type="text"
            placeholder="Kort sammanfattning"
            value={form.excerpt}
            onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
            className="w-full mb-4 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-800"
            disabled={isLoading}
          />

          <textarea
            placeholder="Innehåll (Markdown-stöd)"
            rows={8}
            value={form.content}
            onChange={(e) => setForm({ ...form, content: e.target.value })}
            className="w-full mb-4 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-800 font-mono text-sm"
            disabled={isLoading}
          />

          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <input
              type="text"
              placeholder="Kategori (t.ex. Next.js)"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-800"
              disabled={isLoading}
            />
            <input
              type="text"
              placeholder="Taggar (separera med kommatecken)"
              value={form.tags}
              onChange={(e) => setForm({ ...form, tags: e.target.value })}
              className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-800"
              disabled={isLoading}
            />
          </div>

          <input
            type="text"
            placeholder="Bild-URL (valfritt)"
            value={form.coverImage}
            onChange={(e) => setForm({ ...form, coverImage: e.target.value })}
            className="w-full mb-4 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-800"
            disabled={isLoading}
          />

          <div className="flex gap-2">
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 disabled:opacity-50"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <FiSave />
              )}
              {editingBlog ? "Uppdatera" : "Publicera"}
            </button>
            <button
              onClick={handleCancel}
              disabled={isLoading}
              className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-600 disabled:opacity-50"
            >
              Avbryt
            </button>
          </div>
        </div>
      )}

      {/* Blog List */}
      <div className="space-y-3">
        <h3 className="font-medium mb-2">📄 Befintliga inlägg</h3>
        {blogs.length === 0 ? (
          <p className="text-slate-500 text-center py-8">
            Inga blogginlägg ännu. Skapa ditt första! ✍️
          </p>
        ) : (
          blogs.map((blog) => (
            <div
              key={blog._id}
              className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-700 rounded-lg"
            >
              <div className="flex-1">
                <h3 className="font-medium">{blog.title}</h3>
                <div className="flex flex-wrap gap-2 mt-1">
                  <span className="text-xs text-slate-500">
                    {blog.category}
                  </span>
                  <span className="text-xs text-slate-400">
                    {blog.readTime} min läsning
                  </span>
                  <span className="text-xs text-slate-400">
                    {new Date(blog.publishedAt).toLocaleDateString("sv-SE")}
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                <a
                  href={`/blog/${blog.slug}`}
                  target="_blank"
                  className="p-1 text-green-600 hover:bg-green-100 rounded"
                >
                  <FiEye />
                </a>
                <button
                  onClick={() => handleEdit(blog)}
                  disabled={isLoading}
                  className="p-1 text-blue-600 hover:bg-blue-100 rounded disabled:opacity-50"
                >
                  <FiEdit />
                </button>
                <button
                  onClick={() => handleDelete(blog._id)}
                  disabled={isLoading}
                  className="p-1 text-red-600 hover:bg-red-100 rounded disabled:opacity-50"
                >
                  <FiTrash2 />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
