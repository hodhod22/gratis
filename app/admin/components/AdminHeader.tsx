// app/admin/components/AdminHeader.tsx
"use client";

import {
  FiBell,
  FiUsers,
  FiArchive,
  FiInbox,
  FiEdit,
  FiCircle,
} from "react-icons/fi";

interface AdminHeaderProps {
  adminEmail: string;
  isOnline: boolean;
  totalUnread: number;
  stats?: {
    activeConversations: number;
    closedConversations: number;
    totalRequests: number;
    totalBlogs: number;
  };
}

export default function AdminHeader({
  adminEmail,
  isOnline,
  totalUnread,
  stats,
}: AdminHeaderProps) {
  return (
    <>
      {/* Header */}
      <div className="mb-6 flex justify-between items-center flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Admin Panel
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-sm">
            Hantera konversationer, förfrågningar och blogg
          </p>
          <div className="flex items-center gap-2 mt-1">
            <p className="text-xs text-green-600">
              ✅ Inloggad som admin: {adminEmail}
            </p>
            <div className="flex items-center gap-1 text-xs">
              <FiCircle
                className={`w-2 h-2 ${isOnline ? "text-green-500 fill-green-500" : "text-gray-400"}`}
              />
              <span className="text-slate-500">
                {isOnline ? "Online" : "Offline"}
              </span>
            </div>
          </div>
        </div>

        {/* Notification Badge */}
        {totalUnread > 0 && (
          <div className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-full animate-pulse shadow-lg">
            <FiBell className="w-5 h-5 animate-bounce" />
            <span className="font-semibold text-lg">
              {totalUnread} nya meddelanden
            </span>
          </div>
        )}
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          <div className="bg-white dark:bg-slate-800 rounded-xl p-3 shadow-lg">
            <div className="flex items-center gap-2">
              <FiUsers className="w-5 h-5 text-blue-500" />
              <div>
                <p className="text-xl font-bold">{stats.activeConversations}</p>
                <p className="text-xs text-slate-500">Aktiva konversationer</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl p-3 shadow-lg">
            <div className="flex items-center gap-2">
              <FiArchive className="w-5 h-5 text-orange-500" />
              <div>
                <p className="text-xl font-bold">{stats.closedConversations}</p>
                <p className="text-xs text-slate-500">Stängda konversationer</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl p-3 shadow-lg">
            <div className="flex items-center gap-2">
              <FiInbox className="w-5 h-5 text-purple-500" />
              <div>
                <p className="text-xl font-bold">{stats.totalRequests}</p>
                <p className="text-xs text-slate-500">Förfrågningar</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl p-3 shadow-lg">
            <div className="flex items-center gap-2">
              <FiEdit className="w-5 h-5 text-green-500" />
              <div>
                <p className="text-xl font-bold">{stats.totalBlogs}</p>
                <p className="text-xs text-slate-500">Blogginlägg</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
