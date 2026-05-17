// app/admin/components/RequestFilters.tsx
"use client";

import { useState } from "react";
import { FiSearch, FiFilter, FiDownload } from "react-icons/fi";

interface RequestFiltersProps {
  onFilterChange?: (filter: string) => void;
  onSearchChange?: (term: string) => void;
  onSortChange?: (sort: string) => void;
  onExport?: () => void;
  counts?: {
    total: number;
    pending: number;
    inProgress: number;
    completed: number;
    rejected: number;
  };
}

export default function RequestFilters({
  onFilterChange,
  onSearchChange,
  onSortChange,
  onExport,
  counts,
}: RequestFiltersProps) {
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("priority");

  const handleFilterClick = (filter: string) => {
    setActiveFilter(filter);
    onFilterChange?.(filter);
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    onSearchChange?.(term);
  };

  const filters = [
    { id: "all", label: "Alla", count: counts?.total || 0, color: "slate" },
    {
      id: "pending",
      label: "Väntande",
      count: counts?.pending || 0,
      color: "yellow",
    },
    {
      id: "in-progress",
      label: "Pågår",
      count: counts?.inProgress || 0,
      color: "blue",
    },
    {
      id: "completed",
      label: "Klara",
      count: counts?.completed || 0,
      color: "green",
    },
    {
      id: "rejected",
      label: "Avböjda",
      count: counts?.rejected || 0,
      color: "red",
    },
  ];

  const getColorClass = (color: string, isActive: boolean) => {
    if (isActive) {
      const colors = {
        slate: "bg-slate-600 text-white",
        yellow: "bg-yellow-500 text-white",
        blue: "bg-blue-500 text-white",
        green: "bg-green-500 text-white",
        red: "bg-red-500 text-white",
      };
      return colors[color as keyof typeof colors];
    }
    return "bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200";
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-4">
      <div className="flex flex-wrap gap-3 items-center justify-between">
        <div className="flex gap-2 flex-wrap">
          {filters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => handleFilterClick(filter.id)}
              className={`px-3 py-1.5 rounded-lg text-sm transition ${getColorClass(filter.color, activeFilter === filter.id)}`}
            >
              {filter.label} ({filter.count})
            </button>
          ))}
        </div>

        <div className="flex gap-2">
          <select
            value={sortBy}
            onChange={(e) => {
              setSortBy(e.target.value);
              onSortChange?.(e.target.value);
            }}
            className="px-3 py-1.5 border rounded-lg text-sm dark:bg-slate-700"
          >
            <option value="priority">⭐ Prioriteter</option>
            <option value="date">📅 Datum</option>
            <option value="name">👤 Namn</option>
          </select>

          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Sök..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-9 pr-3 py-1.5 border rounded-lg text-sm dark:bg-slate-700 w-48 focus:w-64 transition-all"
            />
          </div>

          {onExport && (
            <button
              onClick={onExport}
              className="px-3 py-1.5 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 flex items-center gap-1"
            >
              <FiDownload className="w-4 h-4" /> Exportera
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
