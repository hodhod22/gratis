// app/admin/AdminClient.tsx
"use client";

import { useState, lazy, Suspense, useCallback, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

// Lazy load components för bättre prestanda
const AdminHeader = lazy(() => import("./components/AdminHeader"));
const ConversationList = lazy(() => import("./components/ConversationList"));
const ConversationChat = lazy(() => import("./components/ConversationChat"));
const RequestsList = lazy(() => import("./components/RequestsList"));
const RequestDetail = lazy(() => import("./components/RequestDetail"));
const BlogManager = lazy(() => import("./components/BlogManager"));
const RequestFilters = lazy(() => import("./components/RequestFilters"));
const MeetingsManager = lazy(() => import("./components/MeetingsManager"));

// Hooks
import { useConversations } from "./hooks/useConversations";
import { useRequests } from "./hooks/useRequests";
import { useBlog } from "./hooks/useBlog";
import { useAdminStatus } from "./hooks/useAdminStatus";

import {
  FiMessageSquare,
  FiArchive,
  FiHeart,
  FiEdit,
  FiCalendar,
} from "react-icons/fi";

type TabType = "active" | "closed" | "meetings" | "requests" | "blog";

export default function AdminClient() {
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState<TabType>("active");
  const [selectedConversationId, setSelectedConversationId] = useState<
    string | null
  >(null);
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(
    null,
  );

  // Filter states för requests
  const [requestFilter, setRequestFilter] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<string>("priority");

  // Hämta meetings data för att visa badge
  const meetings = useQuery(api.meetings.getAllMeetings) || [];
  const meetingsCount = meetings.length;
  const pendingMeetingsCount = meetings.filter(
    (m: any) => m.status === "pending",
  ).length;

  // Separata hooks för olika datatyper
  const {
    activeConversations,
    closedConversations,
    totalUnread,
    sendMessage,
    markAsRead,
    closeConversation,
    openConversation,
  } = useConversations();

  const {
    requests,
    stats,
    updateStatus,
    updatePriority,
    deleteRequest,
    bulkUpdate,
  } = useRequests();

  const { blogs, createBlog, updateBlog, deleteBlog } = useBlog();
  const { isOnline } = useAdminStatus();

  const adminEmail = user?.emailAddresses[0]?.emailAddress || "";

  // Filtrera och sortera requests
  const filteredRequests = requests
    .filter((req) =>
      requestFilter === "all" ? true : req.status === requestFilter,
    )
    .filter(
      (req) =>
        searchTerm === "" ||
        req.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        req.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        req.description.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    .sort((a, b) => {
      if (sortBy === "priority") return b.priority - a.priority;
      if (sortBy === "date") return b.createdAt - a.createdAt;
      return a.name.localeCompare(b.name);
    });

  // Bulk update handler
  const handleBulkUpdate = useCallback(
    async (ids: Id<"requests">[], status: string) => {
      await bulkUpdate(ids, status);
    },
    [bulkUpdate],
  );

  // Exportera till CSV
  const exportRequestsToCSV = useCallback(() => {
    const headers = [
      "Namn",
      "Email",
      "Typ",
      "Status",
      "Prioritet",
      "Skapad",
      "Deadline",
      "Budget",
      "Beskrivning",
    ];
    const rows = filteredRequests.map((req) => [
      `"${req.name}"`,
      `"${req.email}"`,
      `"${req.websiteType}"`,
      `"${req.status}"`,
      req.priority,
      new Date(req.createdAt).toLocaleDateString("sv-SE"),
      req.deadline || "-",
      `"${req.budget}"`,
      `"${req.description.replace(/"/g, '""')}"`,
    ]);

    const csv = [headers, ...rows].map((row) => row.join(",")).join("\n");
    const blob = new Blob(["\uFEFF" + csv], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `forfragningar-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }, [filteredRequests]);

  const tabs: {
    id: TabType;
    label: string;
    icon: any;
    count: number;
    badge: number;
  }[] = [
    {
      id: "active",
      label: "Aktiva",
      icon: FiMessageSquare,
      count: activeConversations.length,
      badge: totalUnread,
    },
    {
      id: "closed",
      label: "Stängda",
      icon: FiArchive,
      count: closedConversations.length,
      badge: 0,
    },
    {
      id: "meetings",
      label: "Möten",
      icon: FiCalendar,
      count: meetingsCount,
      badge: pendingMeetingsCount,
    },
    {
      id: "requests",
      label: "Förfrågningar",
      icon: FiHeart,
      count: requests.length,
      badge: stats.pending,
    },
    { id: "blog", label: "Blogg", icon: FiEdit, count: blogs.length, badge: 0 },
  ];

  // Statistik för admin header
  const headerStats = {
    activeConversations: activeConversations.length,
    closedConversations: closedConversations.length,
    totalRequests: requests.length,
    totalBlogs: blogs.length,
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <Suspense
        fallback={
          <div className="h-32 animate-pulse bg-slate-200 dark:bg-slate-700 rounded-xl" />
        }
      >
        <AdminHeader
          adminEmail={adminEmail}
          isOnline={isOnline}
          totalUnread={totalUnread}
          stats={headerStats}
        />
      </Suspense>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-6 border-b border-slate-200 dark:border-slate-700">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id);
              // Rensa selection när man byter tab
              if (tab.id !== "active" && tab.id !== "closed") {
                setSelectedConversationId(null);
              }
              if (tab.id !== "requests") {
                setSelectedRequestId(null);
              }
            }}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === tab.id
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
            }`}
          >
            <tab.icon className="inline mr-2 w-4 h-4" />
            {tab.label} ({tab.count})
            {tab.badge > 0 && (
              <span className="ml-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full animate-pulse">
                {tab.badge} nya
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Aktiva/Stängda konversationer */}
      {(activeTab === "active" || activeTab === "closed") && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Suspense
            fallback={
              <div className="h-150 animate-pulse bg-slate-200 dark:bg-slate-700 rounded-xl" />
            }
          >
            <ConversationList
              conversations={
                activeTab === "active"
                  ? activeConversations
                  : closedConversations
              }
              selectedId={selectedConversationId}
              onSelect={setSelectedConversationId}
              isActive={activeTab === "active"}
            />
          </Suspense>

          <Suspense
            fallback={
              <div className="h-150 animate-pulse bg-slate-200 dark:bg-slate-700 rounded-xl" />
            }
          >
            <ConversationChat
              conversationId={selectedConversationId}
              onSendMessage={sendMessage}
              onMarkAsRead={markAsRead}
              onClose={closeConversation}
            />
          </Suspense>
        </div>
      )}

      {/* Möten */}
      {activeTab === "meetings" && (
        <Suspense
          fallback={
            <div className="min-h-125 animate-pulse bg-slate-200 dark:bg-slate-700 rounded-xl" />
          }
        >
          <MeetingsManager />
        </Suspense>
      )}

      {/* Förfrågningar */}
      {activeTab === "requests" && (
        <div className="space-y-6">
          <Suspense
            fallback={
              <div className="h-20 animate-pulse bg-slate-200 dark:bg-slate-700 rounded-xl" />
            }
          >
            <RequestFilters
              counts={stats}
              onFilterChange={setRequestFilter}
              onSearchChange={setSearchTerm}
              onSortChange={setSortBy}
              onExport={exportRequestsToCSV}
            />
          </Suspense>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Suspense
              fallback={
                <div className="h-150 animate-pulse bg-slate-200 dark:bg-slate-700 rounded-xl" />
              }
            >
              <RequestsList
                requests={filteredRequests}
                selectedId={selectedRequestId}
                onSelect={setSelectedRequestId}
                onBulkUpdate={handleBulkUpdate}
              />
            </Suspense>

            <Suspense
              fallback={
                <div className="h-150 animate-pulse bg-slate-200 dark:bg-slate-700 rounded-xl" />
              }
            >
              <RequestDetail
                requestId={selectedRequestId}
                onUpdateStatus={updateStatus}
                onUpdatePriority={updatePriority}
                onDelete={deleteRequest}
              />
            </Suspense>
          </div>
        </div>
      )}

      {/* Blogg */}
      {activeTab === "blog" && (
        <Suspense
          fallback={
            <div className="min-h-125 animate-pulse bg-slate-200 dark:bg-slate-700 rounded-xl" />
          }
        >
          <BlogManager
            blogs={blogs}
            onCreate={createBlog}
            onUpdate={updateBlog}
            onDelete={deleteBlog}
          />
        </Suspense>
      )}
    </div>
  );
}
