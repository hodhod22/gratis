// app/admin/components/RequestsList.tsx
"use client";

import { useState, useMemo } from "react";
import { Id } from "@/convex/_generated/dataModel";
import {
  FiHeart,
  FiInbox,
  FiStar,
  FiCalendar,
  FiFlag,
  FiCheckCircle,
} from "react-icons/fi";
import ProgressBar from "./ProgressBar";
import { formatDate, getStatusColor, getPriorityColor } from "../utils/helpers";

interface Request {
  _id: string;
  name: string;
  email: string;
  websiteType: string;
  description: string;
  status: string;
  priority: number;
  createdAt: number;
  updatedAt: number;
}

interface RequestsListProps {
  requests: Request[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onBulkUpdate?: (ids: Id<"requests">[], status: string) => Promise<void>;
}

export default function RequestsList({
  requests,
  selectedId,
  onSelect,
  onBulkUpdate,
}: RequestsListProps) {
  const [selectedRequests, setSelectedRequests] = useState<Id<"requests">[]>(
    [],
  );
  const [filter, setFilter] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<string>("priority");

  const filteredRequests = useMemo(() => {
    let filtered = requests;

    if (filter !== "all") {
      filtered = filtered.filter((r) => r.status === filter);
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (r) =>
          r.name.toLowerCase().includes(term) ||
          r.email.toLowerCase().includes(term) ||
          r.description.toLowerCase().includes(term),
      );
    }

    filtered = [...filtered].sort((a, b) => {
      if (sortBy === "priority") return b.priority - a.priority;
      if (sortBy === "date") return b.createdAt - a.createdAt;
      return a.name.localeCompare(b.name);
    });

    return filtered;
  }, [requests, filter, searchTerm, sortBy]);

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedRequests(filteredRequests.map((r) => r._id as Id<"requests">));
    } else {
      setSelectedRequests([]);
    }
  };

  const handleBulkAction = (status: string) => {
    if (selectedRequests.length > 0 && onBulkUpdate) {
      onBulkUpdate(selectedRequests, status);
      setSelectedRequests([]);
    }
  };

  const handleSelectRequest = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedRequests([...selectedRequests, id as Id<"requests">]);
    } else {
      setSelectedRequests(selectedRequests.filter((reqId) => reqId !== id));
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden flex flex-col">
      <div className="p-3 border-b border-slate-200 dark:border-slate-700 bg-linear-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20">
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            onChange={handleSelectAll}
            className="rounded dark:bg-slate-700 dark:checked:bg-blue-500"
          />
          <h2 className="font-semibold flex items-center gap-2 text-slate-800 dark:text-white">
            <FiHeart className="w-5 h-5 text-rose-500" />
            Förfrågningar ({filteredRequests.length})
          </h2>
        </div>
      </div>

      {/* Bulk actions bar */}
      {selectedRequests.length > 0 && (
        <div className="p-2 bg-blue-50 dark:bg-blue-950/30 border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
              <FiCheckCircle className="inline mr-2" />
              {selectedRequests.length} markerade
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => handleBulkAction("in-progress")}
                className="px-2 py-1 text-xs bg-blue-500 text-white rounded"
              >
                Pågår
              </button>
              <button
                onClick={() => handleBulkAction("completed")}
                className="px-2 py-1 text-xs bg-green-500 text-white rounded"
              >
                Klar
              </button>
              <button
                onClick={() => handleBulkAction("rejected")}
                className="px-2 py-1 text-xs bg-red-500 text-white rounded"
              >
                Avböj
              </button>
              <button
                onClick={() => setSelectedRequests([])}
                className="px-2 py-1 text-xs bg-gray-500 text-white rounded"
              >
                Rensa
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Filter och sök */}
      <div className="p-3 border-b border-slate-200 dark:border-slate-700">
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="flex flex-wrap gap-1">
            <button
              onClick={() => setFilter("all")}
              className={`px-2 py-1 text-xs rounded transition ${filter === "all" ? "bg-blue-600 text-white" : "bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300"}`}
            >
              Alla
            </button>
            <button
              onClick={() => setFilter("pending")}
              className={`px-2 py-1 text-xs rounded transition ${filter === "pending" ? "bg-yellow-500 text-white" : "bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300"}`}
            >
              Väntar
            </button>
            <button
              onClick={() => setFilter("in-progress")}
              className={`px-2 py-1 text-xs rounded transition ${filter === "in-progress" ? "bg-blue-500 text-white" : "bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300"}`}
            >
              Pågår
            </button>
            <button
              onClick={() => setFilter("completed")}
              className={`px-2 py-1 text-xs rounded transition ${filter === "completed" ? "bg-green-500 text-white" : "bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300"}`}
            >
              Klara
            </button>
            <button
              onClick={() => setFilter("rejected")}
              className={`px-2 py-1 text-xs rounded transition ${filter === "rejected" ? "bg-red-500 text-white" : "bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300"}`}
            >
              Avböjda
            </button>
          </div>
          <div className="flex gap-2 sm:ml-auto">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-2 py-1 text-xs border rounded dark:bg-slate-700 dark:border-slate-600 dark:text-white"
            >
              <option value="priority">Prioritet</option>
              <option value="date">Datum</option>
              <option value="name">Namn</option>
            </select>
            <input
              type="text"
              placeholder="Sök..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 sm:w-32 px-2 py-1 text-xs border rounded dark:bg-slate-700 dark:border-slate-600 dark:text-white dark:placeholder:text-slate-400"
            />
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto divide-y divide-slate-200 dark:divide-slate-700 max-h-125">
        {filteredRequests.length === 0 ? (
          <div className="p-8 text-center text-slate-500 dark:text-slate-400">
            <FiInbox className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>Inga förfrågningar</p>
          </div>
        ) : (
          filteredRequests.map((req) => (
            <div
              key={req._id}
              onClick={() => onSelect(req._id)}
              className={`p-4 cursor-pointer transition-all hover:bg-slate-50 dark:hover:bg-slate-700 ${
                selectedId === req._id
                  ? "bg-blue-50 dark:bg-blue-950/30 border-l-4 border-blue-500"
                  : ""
              }`}
            >
              <div className="flex items-start gap-2">
                <input
                  type="checkbox"
                  checked={selectedRequests.includes(req._id as Id<"requests">)}
                  onChange={(e) => {
                    e.stopPropagation();
                    handleSelectRequest(req._id, e.target.checked);
                  }}
                  className="mt-1 dark:bg-slate-700 dark:checked:bg-blue-500"
                />

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="font-semibold truncate text-slate-800 dark:text-white">
                      {req.name}
                    </span>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${getStatusColor(req.status)}`}
                    >
                      {req.status === "pending"
                        ? "⏳ Väntar"
                        : req.status === "in-progress"
                          ? "⚙️ Pågår"
                          : req.status === "completed"
                            ? "✅ Klar"
                            : "❌ Avböjd"}
                    </span>
                    <div className="flex items-center gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <FiStar
                          key={i}
                          className={`w-3 h-3 ${i < req.priority ? "text-yellow-500 fill-yellow-500" : "text-slate-300 dark:text-slate-600"}`}
                        />
                      ))}
                    </div>
                  </div>

                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-1 truncate">
                    {req.email}
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-300 line-clamp-2">
                    {req.description}
                  </p>

                  <div className="flex gap-3 mt-2 text-xs text-slate-400 dark:text-slate-500">
                    <span className="flex items-center gap-1">
                      <FiCalendar className="w-3 h-3" />
                      {formatDate(req.createdAt)}
                    </span>
                    <span className="flex items-center gap-1">
                      <FiFlag className={getPriorityColor(req.priority)} />
                      Prio {req.priority}
                    </span>
                  </div>

                  {req.status === "in-progress" && (
                    <ProgressBar
                      startDate={req.updatedAt}
                      status={req.status}
                    />
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
