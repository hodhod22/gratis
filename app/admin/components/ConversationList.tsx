// app/admin/components/ConversationList.tsx
"use client";

import { FiMessageSquare, FiArchive, FiInbox, FiClock } from "react-icons/fi";
import { formatDate } from "../utils/helpers";

interface Conversation {
  _id: string;
  email: string;
  name: string;
  isActive: boolean;
  lastMessageAt: number;
  unreadCount: number;
  lastMessage?: string;
}

interface ConversationListProps {
  conversations: Conversation[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  isActive: boolean;
}

export default function ConversationList({
  conversations,
  selectedId,
  onSelect,
  isActive,
}: ConversationListProps) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden flex flex-col h-150">
      <div className="p-4 border-b border-slate-200 dark:border-slate-700 bg-linear-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20">
        <h2 className="font-semibold flex items-center gap-2">
          {isActive ? (
            <FiMessageSquare className="w-5 h-5" />
          ) : (
            <FiArchive className="w-5 h-5" />
          )}
          {isActive ? "Aktiva konversationer" : "Stängda konversationer"}
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto divide-y divide-slate-200 dark:divide-slate-700">
        {conversations.length === 0 ? (
          <div className="p-8 text-center text-slate-500">
            <FiInbox className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>Inga {isActive ? "aktiva" : "stängda"} konversationer</p>
          </div>
        ) : (
          conversations.map((conv) => (
            <div
              key={conv._id}
              onClick={() => onSelect(conv._id)}
              className={`p-4 cursor-pointer transition-all hover:bg-slate-50 dark:hover:bg-slate-700 ${
                selectedId === conv._id
                  ? "bg-blue-50 dark:bg-blue-950/30 border-l-4 border-blue-500"
                  : conv.unreadCount > 0
                    ? "bg-red-50 dark:bg-red-950/20 border-l-4 border-red-500"
                    : ""
              }`}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span
                      className={`font-semibold truncate ${conv.unreadCount > 0 ? "text-red-600 dark:text-red-400" : ""}`}
                    >
                      {conv.name}
                    </span>
                    {conv.unreadCount > 0 && (
                      <span className="text-xs bg-red-500 text-white px-2 py-0.5 rounded-full animate-pulse">
                        {conv.unreadCount} ny
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-slate-500 mb-1 truncate">
                    {conv.email}
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400 truncate">
                    {conv.lastMessage || "..."}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-1 ml-2">
                  <span className="text-xs text-slate-400 flex items-center gap-1 whitespace-nowrap">
                    <FiClock className="w-3 h-3" />
                    {formatDate(conv.lastMessageAt)}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
