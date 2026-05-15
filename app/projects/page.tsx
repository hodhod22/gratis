import { fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import { Doc } from "@/convex/_generated/dataModel";
import ProjectsClient from "./ProjectsClient";

export const metadata = {
  title: "Mina Projekt | Portfolio",
  description:
    "Utvalda projekt byggda med Next.js, TypeScript och modern teknik",
};

export default async function ProjectsPage() {
  // Hämta alla projekt och kategorier från Convex
  let projects: Doc<"projects">[] = [];
  let categories: string[] = [];

  try {
    projects = await fetchQuery(api.projects.getAll, { category: "all" });
    categories = await fetchQuery(api.projects.getCategories);
  } catch (error) {
    console.error("Failed to fetch projects:", error);
  }

  return (
    <ProjectsClient initialProjects={projects} initialCategories={categories} />
  );
}
