"use client";

import { useState, useEffect, useRef } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Doc } from "@/convex/_generated/dataModel";
import {
  FiMail,
  FiCheck,
  FiTrash2,
  FiMessageSquare,
  FiUser,
  FiAtSign,
  FiSend,
  FiBell,
  FiClock,
  FiUsers,
  FiMinimize2,
  FiX,
  FiArchive,
  FiRefreshCw,
  FiInbox,
  FiHeart,
  FiStar,
} from "react-icons/fi";

interface Conversation {
  _id: string;
  email: string;
  name: string;
  isActive: boolean;
  lastMessageAt: number;
  unreadCount: number;
  lastMessage?: string;
}

interface Request {
  _id: string;
  name: string;
  email: string;
  websiteType: string;
  description: string;
  requirements: string;
  deadline?: string;
  budget: string;
  status: string;
  priority: number;
  createdAt: number;
  updatedAt: number;
  adminNotes?: string;
  completedUrl?: string;
}

interface AdminClientProps {
  adminEmail: string;
}

export default function AdminClient({ adminEmail }: AdminClientProps) {
  const [selectedConversation, setSelectedConversation] =
    useState<Conversation | null>(null);
  const [replyText, setReplyText] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [activeTab, setActiveTab] = useState<"active" | "closed" | "requests">(
    "active",
  );
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Hämta konversationer
  const activeConversations = useQuery(api.admin.getActiveConversations) || [];
  const closedConversations = useQuery(api.admin.getClosedConversations) || [];
  const messages = useQuery(
    api.admin.getConversationMessages,
    selectedConversation ? { email: selectedConversation.email } : "skip",
  );

  // Hämta förfrågningar
  const requests = useQuery(api.admin.getAllRequests) || [];

  // Mutationer för konversationer
  const openConversation = useMutation(api.admin.openConversation);
  const closeConversation = useMutation(api.admin.closeConversation);
  const markMessagesAsRead = useMutation(api.admin.markMessagesAsRead);
  const sendReply = useMutation(api.chat.sendAdminReply);
  const deleteMessage = useMutation(api.admin.deleteMessage);

  // Mutationer för förfrågningar
  const updateRequestStatus = useMutation(api.admin.updateRequestStatus);
  const deleteRequest = useMutation(api.admin.deleteRequest);

  const conversations =
    activeTab === "active" ? activeConversations : closedConversations;
  const totalUnread = activeConversations.reduce(
    (sum, c) => sum + (c.unreadCount || 0),
    0,
  );
  const pendingRequests = requests.filter((r) => r.status === "pending").length;

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) {
      return date.toLocaleTimeString("sv-SE", {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else if (days === 1) {
      return "Igår";
    } else if (days < 7) {
      return `${days} dagar sedan`;
    } else {
      return date.toLocaleDateString("sv-SE", {
        month: "short",
        day: "numeric",
      });
    }
  };

  // Hantera konversationer
  const handleSelectConversation = async (conv: Conversation) => {
    setSelectedConversation(conv);

    if (!conv.isActive) {
      await openConversation({ email: conv.email });
      conv.isActive = true;
    }

    if (conv.unreadCount > 0) {
      await markMessagesAsRead({ email: conv.email });
      conv.unreadCount = 0;
    }
  };

  const handleCloseConversation = async () => {
    if (!selectedConversation) return;
    await closeConversation({ email: selectedConversation.email });
    setSelectedConversation(null);
    setTimeout(() => window.location.reload(), 500);
  };

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !selectedConversation) return;

    setIsSending(true);
    try {
      await sendReply({
        toEmail: selectedConversation.email,
        toName: selectedConversation.name,
        message: replyText,
      });
      setReplyText("");
    } catch (error) {
      console.error("Failed to send reply:", error);
    } finally {
      setIsSending(false);
    }
  };

  const handleDeleteMessage = async (messageId: string) => {
    if (confirm("Är du säker på att du vill radera detta meddelande?")) {
      await deleteMessage({ id: messageId as any });
    }
  };

  // Hantera förfrågningar
  const handleUpdateStatus = async (id: string, status: string) => {
    await updateRequestStatus({ id: id as any, status });
  };

  const handleDeleteRequest = async (id: string) => {
    if (confirm("Är du säker på att du vill radera denna förfrågan?")) {
      await deleteRequest({ id: id as any });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400";
      case "in-progress":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
      case "completed":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
      case "rejected":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityStars = (priority: number) => {
    return "⭐".repeat(priority);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="mb-6 flex justify-between items-center flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Admin Panel
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-sm">
            Hantera konversationer och förfrågningar
          </p>
          <p className="text-xs text-green-600 mt-1">
            ✅ Inloggad som admin: {adminEmail}
          </p>
        </div>

        {/* Notification Badge */}
        {totalUnread > 0 && (
          <div className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-full animate-pulse">
            <FiBell className="w-5 h-5" />
            <span className="font-semibold">{totalUnread} nya meddelanden</span>
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
        <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-lg">
          <div className="flex items-center gap-3">
            <FiUsers className="w-8 h-8 text-blue-500" />
            <div>
              <p className="text-2xl font-bold">{activeConversations.length}</p>
              <p className="text-xs text-slate-500">Aktiva konversationer</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-lg">
          <div className="flex items-center gap-3">
            <FiArchive className="w-8 h-8 text-orange-500" />
            <div>
              <p className="text-2xl font-bold">{closedConversations.length}</p>
              <p className="text-xs text-slate-500">Stängda konversationer</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-lg">
          <div className="flex items-center gap-3">
            <FiInbox className="w-8 h-8 text-purple-500" />
            <div>
              <p className="text-2xl font-bold">{requests.length}</p>
              <p className="text-xs text-slate-500">Totala förfrågningar</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-lg">
          <div className="flex items-center gap-3">
            <FiHeart className="w-8 h-8 text-red-500" />
            <div>
              <p className="text-2xl font-bold">{pendingRequests}</p>
              <p className="text-xs text-slate-500">Väntande förfrågningar</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-slate-200 dark:border-slate-700">
        <button
          onClick={() => setActiveTab("active")}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === "active"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-slate-500 hover:text-slate-700"
          }`}
        >
          <FiMessageSquare className="inline mr-2 w-4 h-4" />
          Aktiva ({activeConversations.length})
          {totalUnread > 0 && (
            <span className="ml-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
              {totalUnread}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab("closed")}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === "closed"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-slate-500 hover:text-slate-700"
          }`}
        >
          <FiArchive className="inline mr-2 w-4 h-4" />
          Stängda ({closedConversations.length})
        </button>
        <button
          onClick={() => setActiveTab("requests")}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === "requests"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-slate-500 hover:text-slate-700"
          }`}
        >
          <FiHeart className="inline mr-2 w-4 h-4" />
          Förfrågningar ({requests.length})
          {pendingRequests > 0 && (
            <span className="ml-2 bg-yellow-500 text-white text-xs px-2 py-0.5 rounded-full">
              {pendingRequests} nya
            </span>
          )}
        </button>
      </div>

      {/* Chat Area för konversationer */}
      {(activeTab === "active" || activeTab === "closed") && (
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Conversations List */}
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden flex flex-col h-150">
            <div className="p-4 border-b border-slate-200 dark:border-slate-700 bg-linear-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20">
              <h2 className="font-semibold flex items-center gap-2">
                {activeTab === "active" ? (
                  <FiMessageSquare className="w-5 h-5" />
                ) : (
                  <FiArchive className="w-5 h-5" />
                )}
                {activeTab === "active"
                  ? "Aktiva konversationer"
                  : "Stängda konversationer"}
              </h2>
            </div>

            <div className="flex-1 overflow-y-auto divide-y divide-slate-200 dark:divide-slate-700">
              {conversations.length === 0 ? (
                <div className="p-8 text-center text-slate-500">
                  <FiInbox className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>
                    Inga {activeTab === "active" ? "aktiva" : "stängda"}{" "}
                    konversationer
                  </p>
                </div>
              ) : (
                conversations.map((conv) => (
                  <div
                    key={conv._id}
                    onClick={() => handleSelectConversation(conv)}
                    className={`p-4 cursor-pointer transition-all hover:bg-slate-50 dark:hover:bg-slate-700 ${
                      selectedConversation?.email === conv.email
                        ? "bg-blue-50 dark:bg-blue-950/30 border-l-4 border-blue-500"
                        : ""
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <span className="font-semibold truncate">
                            {conv.name}
                          </span>
                          {conv.unreadCount > 0 && (
                            <span className="text-xs bg-red-500 text-white px-2 py-0.5 rounded-full">
                              {conv.unreadCount}
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

          {/* Chat Area */}
          <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden flex flex-col h-150">
            {selectedConversation ? (
              <>
                <div className="p-4 border-b border-slate-200 dark:border-slate-700 bg-linear-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20">
                  <div className="flex justify-between items-center">
                    <div>
                      <h2 className="font-semibold text-lg">
                        {selectedConversation.name}
                      </h2>
                      <p className="text-sm text-slate-500 flex items-center gap-1 mt-1">
                        <FiAtSign className="w-3 h-3" />
                        {selectedConversation.email}
                      </p>
                    </div>
                    <button
                      onClick={handleCloseConversation}
                      className="px-3 py-1 text-sm bg-orange-500 text-white rounded-lg hover:bg-orange-600 flex items-center gap-1"
                    >
                      <FiArchive className="w-4 h-4" />
                      Stäng
                    </button>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {messages?.length === 0 && (
                    <div className="text-center text-slate-500 mt-8">
                      <p>Inga meddelanden ännu</p>
                    </div>
                  )}
                  {messages?.map((msg: any) => (
                    <div
                      key={msg._id}
                      className={`flex ${msg.isFromAdmin ? "justify-start" : "justify-end"}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-lg p-3 ${
                          msg.isFromAdmin
                            ? "bg-slate-100 dark:bg-slate-700 rounded-bl-none"
                            : "bg-blue-600 text-white rounded-br-none"
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <span className="text-xs opacity-75">{msg.name}</span>
                          <span className="text-xs opacity-50">
                            {new Date(msg.createdAt).toLocaleTimeString()}
                          </span>
                        </div>
                        <p className="text-sm wrap-break-word">{msg.message}</p>
                      </div>
                      {!msg.isFromAdmin && (
                        <button
                          onClick={() => handleDeleteMessage(msg._id)}
                          className="ml-2 text-red-500"
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>

                <form
                  onSubmit={handleSendReply}
                  className="p-4 border-t border-slate-200 dark:border-slate-700"
                >
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder="Skriv ditt svar..."
                      className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      autoFocus
                    />
                    <button
                      type="submit"
                      disabled={isSending || !replyText.trim()}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                    >
                      <FiSend className="w-4 h-4" />
                    </button>
                  </div>
                </form>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-slate-500">
                <div className="text-center">
                  <FiMessageSquare className="w-16 h-16 mx-auto mb-4 opacity-30" />
                  <p>Välj en konversation från listan</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Förfrågningar */}
      {activeTab === "requests" && (
        <div className="space-y-4">
          {requests.length === 0 ? (
            <div className="bg-white dark:bg-slate-800 rounded-xl p-12 text-center">
              <FiInbox className="w-16 h-16 mx-auto mb-4 text-slate-400 opacity-50" />
              <p className="text-slate-500">Inga förfrågningar ännu</p>
            </div>
          ) : (
            requests.map((req: Request) => (
              <div
                key={req._id}
                className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg"
              >
                <div className="flex justify-between items-start flex-wrap gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                      <h3 className="font-semibold text-lg">{req.name}</h3>
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${getStatusColor(req.status)}`}
                      >
                        {req.status === "pending" && "Väntar"}
                        {req.status === "in-progress" && "Påbörjad"}
                        {req.status === "completed" && "Klar"}
                        {req.status === "rejected" && "Avböjd"}
                      </span>
                      <span className="text-xs text-slate-500">
                        {getPriorityStars(req.priority)} Prioritet{" "}
                        {req.priority}/5
                      </span>
                    </div>
                    <p className="text-sm text-slate-500 mb-2">{req.email}</p>
                    <p className="text-slate-600 dark:text-slate-400 mb-3">
                      {req.description}
                    </p>
                    {req.requirements && (
                      <p className="text-sm text-slate-500 mb-2">
                        <strong>Krav:</strong> {req.requirements}
                      </p>
                    )}
                    <div className="flex gap-2 mt-2">
                      <span className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900 rounded-full">
                        {req.websiteType}
                      </span>
                      <span className="text-xs px-2 py-1 bg-green-100 dark:bg-green-900 rounded-full">
                        {req.budget === "gratis"
                          ? "Gratis"
                          : req.budget === "donation"
                            ? "Donation möjlig"
                            : "Ingen budget"}
                      </span>
                      {req.deadline && (
                        <span className="text-xs px-2 py-1 bg-orange-100 dark:bg-orange-900 rounded-full">
                          Deadline: {req.deadline}
                        </span>
                      )}
                    </div>
                    <div className="mt-3 text-xs text-slate-400">
                      Skickades:{" "}
                      {new Date(req.createdAt).toLocaleDateString("sv-SE")}
                    </div>
                    {req.adminNotes && (
                      <div className="mt-3 p-2 bg-slate-100 dark:bg-slate-700 rounded text-sm">
                        <strong>Admin anteckning:</strong> {req.adminNotes}
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <select
                      value={req.status}
                      onChange={(e) =>
                        handleUpdateStatus(req._id, e.target.value)
                      }
                      className="text-sm border rounded-lg px-2 py-1 bg-white dark:bg-slate-900"
                    >
                      <option value="pending">Väntar</option>
                      <option value="in-progress">Påbörjad</option>
                      <option value="completed">Klar</option>
                      <option value="rejected">Avböjd</option>
                    </select>
                    <button
                      onClick={() => handleDeleteRequest(req._id)}
                      className="text-red-500 hover:text-red-700 p-1"
                    >
                      <FiTrash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
