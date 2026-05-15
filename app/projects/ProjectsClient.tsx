"use client";

import { useState } from "react";
import ProjectCard from "@/components/ProjectCard";
import { Doc } from "@/convex/_generated/dataModel";
import { FiGrid, FiList, FiSearch } from "react-icons/fi";

interface ProjectsClientProps {
  initialProjects: Doc<"projects">[];
  initialCategories: string[];
}

export default function ProjectsClient({
  initialProjects,
  initialCategories,
}: ProjectsClientProps) {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");

  // Filtrera projekt baserat på kategori och sökning
  const filteredProjects = initialProjects.filter((project) => {
    const matchesCategory =
      selectedCategory === "all" || project.category === selectedCategory;
    const matchesSearch =
      searchQuery === "" ||
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.technologies.some((tech) =>
        tech.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Mina Projekt
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          Här är ett urval av projekt jag byggt med Next.js, TypeScript och
          modern teknik
        </p>
      </div>

      {/* Search Bar */}
      <div className="max-w-md mx-auto mb-8">
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Sök projekt..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8">
        <div className="flex flex-wrap gap-2 justify-center">
          <button
            onClick={() => setSelectedCategory("all")}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              selectedCategory === "all"
                ? "bg-blue-600 text-white shadow-md"
                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
            }`}
          >
            Alla ({initialProjects.length})
          </button>
          {initialCategories.map((cat) => {
            const count = initialProjects.filter(
              (p) => p.category === cat,
            ).length;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedCategory === cat
                    ? "bg-blue-600 text-white shadow-md"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
                }`}
              >
                {cat} ({count})
              </button>
            );
          })}
        </div>

        {/* View Toggle */}
        <div className="flex gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
          <button
            onClick={() => setViewMode("grid")}
            className={`p-2 rounded-lg transition-colors ${
              viewMode === "grid" ? "bg-white dark:bg-slate-700 shadow" : ""
            }`}
            aria-label="Grid view"
          >
            <FiGrid className="w-5 h-5" />
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`p-2 rounded-lg transition-colors ${
              viewMode === "list" ? "bg-white dark:bg-slate-700 shadow" : ""
            }`}
            aria-label="List view"
          >
            <FiList className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Projects Count */}
      <div className="text-center mb-6">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Visar {filteredProjects.length} av {initialProjects.length} projekt
        </p>
      </div>

      {/* Projects Grid/List */}
      {filteredProjects.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-slate-500 dark:text-slate-400">
            Inga projekt hittades.
          </p>
          <button
            onClick={() => {
              setSelectedCategory("all");
              setSearchQuery("");
            }}
            className="mt-4 text-blue-600 hover:underline"
          >
            Rensa filter
          </button>
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project) => (
            <ProjectCard key={project._id} project={project} viewMode="grid" />
          ))}
        </div>
      ) : (
        <div className="space-y-6">
          {filteredProjects.map((project) => (
            <ProjectCard key={project._id} project={project} viewMode="list" />
          ))}
        </div>
      )}
    </div>
  );
}
