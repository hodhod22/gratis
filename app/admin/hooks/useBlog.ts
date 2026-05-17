// app/admin/hooks/useBlog.ts
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

export function useBlog() {
  const blogs = useQuery(api.blog.getAllPublished) || [];

  const createBlogMutation = useMutation(api.blog.createBlog);
  const updateBlogMutation = useMutation(api.blog.updateBlog);
  const deleteBlogMutation = useMutation(api.blog.deleteBlog);

  // Wrappers med korrekta typer
  const createBlog = async (blog: any) => {
    return await createBlogMutation(blog);
  };

  const updateBlog = async (id: string, blog: any) => {
    return await updateBlogMutation({ id: id as Id<"blogs">, ...blog });
  };

  const deleteBlog = async (id: string) => {
    return await deleteBlogMutation({ id: id as Id<"blogs"> });
  };

  return {
    blogs,
    createBlog,
    updateBlog,
    deleteBlog,
  };
}
