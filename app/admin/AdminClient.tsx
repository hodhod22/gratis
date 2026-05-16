"use client";

import { useState, useEffect, useRef } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Doc, Id } from "@/convex/_generated/dataModel";
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
  FiBarChart2,
  FiAlertCircle,
  FiCalendar,
  FiFlag,
  FiEdit,
  FiPlus,
  FiSave,
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
  const [activeTab, setActiveTab] = useState<
    "active" | "closed" | "requests" | "blog"
  >("active");
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);
  const [showRequestDetail, setShowRequestDetail] = useState(false);
  const [requestProgress, setRequestProgress] = useState<{
    [key: string]: number;
  }>({});
  const [notificationSound] = useState(true);
  const [lastUnreadCount, setLastUnreadCount] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Spåra vilka konversationer som redan spelat ljud för admin (15 minuters cooldown)
  const [playedSounds, setPlayedSounds] = useState<Map<string, number>>(
    new Map(),
  );

  // Blogg state
  const [editingBlog, setEditingBlog] = useState<any>(null);
  const [blogForm, setBlogForm] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    category: "",
    tags: "",
    coverImage: "",
  });

  // Hämta konversationer
  const activeConversations = useQuery(api.admin.getActiveConversations) || [];
  const closedConversations = useQuery(api.admin.getClosedConversations) || [];
  const messages = useQuery(
    api.admin.getConversationMessages,
    selectedConversation ? { email: selectedConversation.email } : "skip",
  );

  // Hämta förfrågningar
  const requests = useQuery(api.admin.getAllRequests) || [];

  // Hämta bloggar
  const blogs = useQuery(api.blog.getAllPublished) || [];

  // Mutationer för konversationer
  const openConversation = useMutation(api.admin.openConversation);
  const closeConversation = useMutation(api.admin.closeConversation);
  const markMessagesAsRead = useMutation(api.admin.markMessagesAsRead);
  const sendReply = useMutation(api.chat.sendAdminReply);
  const deleteMessage = useMutation(api.admin.deleteMessage);

  // Mutationer för förfrågningar
  const updateRequestStatus = useMutation(api.admin.updateRequestStatus);
  const updateRequestPriority = useMutation(api.admin.updateRequestPriority);
  const deleteRequest = useMutation(api.admin.deleteRequest);

  // Mutationer för blogg
  const createBlog = useMutation(api.blog.createBlog);
  const updateBlog = useMutation(api.blog.updateBlog);
  const deleteBlog = useMutation(api.blog.deleteBlog);

  // Admin status heartbeat
  const updateAdminStatus = useMutation(api.adminStatus.updateAdminStatus);

  // Heartbeat för admin online status
  useEffect(() => {
    updateAdminStatus({ isOnline: true });
    const interval = setInterval(
      () => updateAdminStatus({ isOnline: true }),
      30000,
    );
    const handleBeforeUnload = () => updateAdminStatus({ isOnline: false });
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      clearInterval(interval);
      window.removeEventListener("beforeunload", handleBeforeUnload);
      updateAdminStatus({ isOnline: false });
    };
  }, [updateAdminStatus]);

  const conversations =
    activeTab === "active" ? activeConversations : closedConversations;
  const totalUnread = activeConversations.reduce(
    (sum, c) => sum + (c.unreadCount || 0),
    0,
  );
  const pendingRequests = requests.filter((r) => r.status === "pending").length;

 useEffect(() => {
   if (totalUnread > 0) {
     document.title = `(${totalUnread}) Admin Panel - FreeWebDev`;
   } else {
     document.title = "Admin Panel - FreeWebDev";
   }
 }, [totalUnread]);

  // Simulera progress för pågående projekt
  useEffect(() => {
    const inProgressReqs = requests.filter((r) => r.status === "in-progress");
    const newProgress: { [key: string]: number } = {};

    inProgressReqs.forEach((req) => {
      const saved = localStorage.getItem(`progress_${req._id}`);
      if (saved) {
        newProgress[req._id] = parseInt(saved);
      } else {
        newProgress[req._id] = Math.floor(Math.random() * 60) + 20;
      }
    });

    setRequestProgress(newProgress);
  }, [requests]);

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

  const handleDeleteMessage = async (messageId: Id<"messages">) => {
    if (confirm("Är du säker på att du vill radera detta meddelande?")) {
      await deleteMessage({ id: messageId });
    }
  };

  // Hantera förfrågningar
  const handleUpdateStatus = async (id: Id<"requests">, status: string) => {
    await updateRequestStatus({ id, status });
    if (status === "in-progress") {
      localStorage.setItem(`progress_${id}`, "25");
      setRequestProgress((prev) => ({ ...prev, [id]: 25 }));
    }
    if (status === "completed") {
      localStorage.removeItem(`progress_${id}`);
    }
  };

  const handleUpdatePriority = async (id: Id<"requests">, priority: number) => {
    await updateRequestPriority({ id, priority });
  };

  const handleUpdateProgress = (id: string, progress: number) => {
    setRequestProgress((prev) => ({ ...prev, [id]: progress }));
    localStorage.setItem(`progress_${id}`, progress.toString());
  };

  const handleDeleteRequest = async (id: Id<"requests">) => {
    if (confirm("Är du säker på att du vill radera denna förfrågan?")) {
      await deleteRequest({ id });
      if (selectedRequest?._id === id) {
        setSelectedRequest(null);
        setShowRequestDetail(false);
      }
    }
  };

  // Hantera blogg
  const handleSaveBlog = async () => {
    const tagsArray = blogForm.tags.split(",").map((t) => t.trim());

    if (editingBlog) {
      await updateBlog({
        id: editingBlog._id,
        title: blogForm.title,
        excerpt: blogForm.excerpt,
        content: blogForm.content,
        category: blogForm.category,
        tags: tagsArray,
        coverImage: blogForm.coverImage,
      });
    } else {
      await createBlog({
        title: blogForm.title,
        slug: blogForm.slug,
        excerpt: blogForm.excerpt,
        content: blogForm.content,
        category: blogForm.category,
        tags: tagsArray,
        coverImage: blogForm.coverImage,
      });
    }

    setEditingBlog(null);
    setBlogForm({
      title: "",
      slug: "",
      excerpt: "",
      content: "",
      category: "",
      tags: "",
      coverImage: "",
    });
  };

  const handleEditBlog = (blog: any) => {
    setEditingBlog(blog);
    setBlogForm({
      title: blog.title,
      slug: blog.slug,
      excerpt: blog.excerpt,
      content: blog.content,
      category: blog.category,
      tags: blog.tags.join(", "),
      coverImage: blog.coverImage || "",
    });
  };

  const handleDeleteBlog = async (id: string) => {
    if (confirm("Är du säker på att du vill radera detta blogginlägg?")) {
      await deleteBlog({ id: id as any });
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

  const getPriorityColor = (priority: number) => {
    if (priority >= 4) return "text-red-600";
    if (priority >= 3) return "text-orange-600";
    return "text-green-600";
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 75) return "bg-green-500";
    if (progress >= 50) return "bg-blue-500";
    if (progress >= 25) return "bg-yellow-500";
    return "bg-red-500";
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
            Hantera konversationer, förfrågningar och blogg
          </p>
          <p className="text-xs text-green-600 mt-1">
            ✅ Inloggad som admin: {adminEmail}
          </p>
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

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <div className="bg-white dark:bg-slate-800 rounded-xl p-3 shadow-lg">
          <div className="flex items-center gap-2">
            <FiUsers className="w-5 h-5 text-blue-500" />
            <div>
              <p className="text-xl font-bold">{activeConversations.length}</p>
              <p className="text-xs text-slate-500">Aktiva konversationer</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl p-3 shadow-lg">
          <div className="flex items-center gap-2">
            <FiArchive className="w-5 h-5 text-orange-500" />
            <div>
              <p className="text-xl font-bold">{closedConversations.length}</p>
              <p className="text-xs text-slate-500">Stängda konversationer</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl p-3 shadow-lg">
          <div className="flex items-center gap-2">
            <FiInbox className="w-5 h-5 text-purple-500" />
            <div>
              <p className="text-xl font-bold">{requests.length}</p>
              <p className="text-xs text-slate-500">Förfrågningar</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl p-3 shadow-lg">
          <div className="flex items-center gap-2">
            <FiEdit className="w-5 h-5 text-green-500" />
            <div>
              <p className="text-xl font-bold">{blogs.length}</p>
              <p className="text-xs text-slate-500">Blogginlägg</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-slate-200 dark:border-slate-700 flex-wrap">
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
            <span className="ml-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full animate-pulse">
              {totalUnread} nya
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
        <button
          onClick={() => setActiveTab("blog")}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === "blog"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-slate-500 hover:text-slate-700"
          }`}
        >
          <FiEdit className="inline mr-2 w-4 h-4" />
          Blogg ({blogs.length})
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
                          className="ml-2 text-red-500 opacity-0 hover:opacity-100 transition-opacity"
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
                      className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-700"
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
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Requests List */}
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden flex flex-col h-150">
            <div className="p-4 border-b border-slate-200 dark:border-slate-700 bg-linear-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20">
              <h2 className="font-semibold flex items-center gap-2">
                <FiHeart className="w-5 h-5" />
                Förfrågningar om gratis hemsidor
              </h2>
            </div>

            <div className="flex-1 overflow-y-auto divide-y divide-slate-200 dark:divide-slate-700">
              {requests.length === 0 ? (
                <div className="p-8 text-center text-slate-500">
                  <FiInbox className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>Inga förfrågningar ännu</p>
                </div>
              ) : (
                requests.map((req) => (
                  <div
                    key={req._id}
                    onClick={() => {
                      setSelectedRequest(req);
                      setShowRequestDetail(true);
                    }}
                    className={`p-4 cursor-pointer transition-all hover:bg-slate-50 dark:hover:bg-slate-700 ${
                      selectedRequest?._id === req._id && showRequestDetail
                        ? "bg-blue-50 dark:bg-blue-950/30 border-l-4 border-blue-500"
                        : ""
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <span className="font-semibold truncate">
                            {req.name}
                          </span>
                          <span
                            className={`text-xs px-2 py-0.5 rounded-full ${getStatusColor(req.status)}`}
                          >
                            {req.status === "pending" && "Väntar"}
                            {req.status === "in-progress" && "Pågår"}
                            {req.status === "completed" && "Klar"}
                            {req.status === "rejected" && "Avböjd"}
                          </span>
                        </div>
                        <p className="text-sm text-slate-500 mb-1 truncate">
                          {req.email}
                        </p>
                        <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">
                          {req.description}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-1 ml-2">
                        <span className="text-xs text-slate-400 flex items-center gap-1 whitespace-nowrap">
                          <FiClock className="w-3 h-3" />
                          {formatDate(req.createdAt)}
                        </span>
                      </div>
                    </div>

                    {/* Progress bar for in-progress requests */}
                    {req.status === "in-progress" &&
                      requestProgress[req._id] && (
                        <div className="mt-3">
                          <div className="flex justify-between text-xs text-slate-500 mb-1">
                            <span>Framsteg</span>
                            <span>{requestProgress[req._id]}%</span>
                          </div>
                          <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(requestProgress[req._id])}`}
                              style={{ width: `${requestProgress[req._id]}%` }}
                            />
                          </div>
                        </div>
                      )}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Request Detail */}
          <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden flex flex-col h-150">
            {selectedRequest && showRequestDetail ? (
              <>
                <div className="p-4 border-b border-slate-200 dark:border-slate-700 bg-linear-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20">
                  <div className="flex justify-between items-center">
                    <div>
                      <h2 className="font-semibold text-lg">
                        {selectedRequest.name}
                      </h2>
                      <p className="text-sm text-slate-500 flex items-center gap-1 mt-1">
                        <FiAtSign className="w-3 h-3" />
                        {selectedRequest.email}
                      </p>
                    </div>
                    <button
                      onClick={() => setShowRequestDetail(false)}
                      className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg"
                    >
                      <FiX className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  <div>
                    <label className="text-xs text-slate-500 uppercase tracking-wider">
                      Typ av hemsida
                    </label>
                    <p className="font-medium">{selectedRequest.websiteType}</p>
                  </div>

                  <div>
                    <label className="text-xs text-slate-500 uppercase tracking-wider">
                      Beskrivning
                    </label>
                    <p className="text-sm">{selectedRequest.description}</p>
                  </div>

                  {selectedRequest.requirements && (
                    <div>
                      <label className="text-xs text-slate-500 uppercase tracking-wider">
                        Specifika krav
                      </label>
                      <p className="text-sm">{selectedRequest.requirements}</p>
                    </div>
                  )}

                  {selectedRequest.deadline && (
                    <div className="flex items-center gap-2">
                      <FiCalendar className="w-4 h-4 text-orange-500" />
                      <div>
                        <label className="text-xs text-slate-500 uppercase tracking-wider">
                          Deadline
                        </label>
                        <p className="text-sm font-medium">
                          {selectedRequest.deadline}
                        </p>
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="text-xs text-slate-500 uppercase tracking-wider">
                      Budget
                    </label>
                    <p className="text-sm">
                      {selectedRequest.budget === "gratis" && "🆓 Helt gratis"}
                      {selectedRequest.budget === "donation" &&
                        "💝 Kan donera frivilligt"}
                      {selectedRequest.budget === "ingen" &&
                        "📋 Ingen budget just nu"}
                    </p>
                  </div>

                  {selectedRequest.status === "in-progress" && (
                    <div>
                      <label className="text-xs text-slate-500 uppercase tracking-wider mb-2 block">
                        Framsteg
                      </label>
                      <div className="flex items-center gap-4">
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={requestProgress[selectedRequest._id] || 0}
                          onChange={(e) =>
                            handleUpdateProgress(
                              selectedRequest._id,
                              parseInt(e.target.value),
                            )
                          }
                          className="flex-1"
                        />
                        <span className="text-sm font-medium w-12 text-center">
                          {requestProgress[selectedRequest._id] || 0}%
                        </span>
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="text-xs text-slate-500 uppercase tracking-wider">
                      Admin anteckning
                    </label>
                    <textarea
                      rows={3}
                      value={selectedRequest.adminNotes || ""}
                      onChange={(e) => {
                        const updated = {
                          ...selectedRequest,
                          adminNotes: e.target.value,
                        };
                        setSelectedRequest(updated);
                      }}
                      onBlur={async () => {
                        if (selectedRequest.adminNotes !== undefined) {
                          await updateRequestStatus({
                            id: selectedRequest._id as Id<"requests">,
                            status: selectedRequest.status,
                            adminNotes: selectedRequest.adminNotes,
                          });
                        }
                      }}
                      className="w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-700"
                      placeholder="Lägg till interna anteckningar..."
                    />
                  </div>

                  {selectedRequest.status === "completed" && (
                    <div>
                      <label className="text-xs text-slate-500 uppercase tracking-wider">
                        Länk till färdig hemsida
                      </label>
                      <input
                        type="url"
                        value={selectedRequest.completedUrl || ""}
                        onChange={(e) => {
                          const updated = {
                            ...selectedRequest,
                            completedUrl: e.target.value,
                          };
                          setSelectedRequest(updated);
                        }}
                        onBlur={async () => {
                          await updateRequestStatus({
                            id: selectedRequest._id as Id<"requests">,
                            status: selectedRequest.status,
                            completedUrl: selectedRequest.completedUrl,
                          });
                        }}
                        className="w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-700"
                        placeholder="https://..."
                      />
                    </div>
                  )}
                </div>

                <div className="p-4 border-t border-slate-200 dark:border-slate-700 space-y-3">
                  <div className="flex gap-2">
                    <select
                      value={selectedRequest.status}
                      onChange={(e) => {
                        const newStatus = e.target.value;
                        handleUpdateStatus(
                          selectedRequest._id as Id<"requests">,
                          newStatus,
                        );
                        setSelectedRequest({
                          ...selectedRequest,
                          status: newStatus,
                        });
                      }}
                      className="flex-1 px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-700"
                    >
                      <option value="pending">📋 Väntar på beslut</option>
                      <option value="in-progress">⚙️ Påbörjad</option>
                      <option value="completed">✅ Färdigställd</option>
                      <option value="rejected">❌ Avböjd</option>
                    </select>

                    <div className="flex items-center gap-1">
                      <FiFlag
                        className={`w-4 h-4 ${getPriorityColor(selectedRequest.priority)}`}
                      />
                      <select
                        value={selectedRequest.priority}
                        onChange={(e) => {
                          const newPriority = parseInt(e.target.value);
                          handleUpdatePriority(
                            selectedRequest._id as Id<"requests">,
                            newPriority,
                          );
                          setSelectedRequest({
                            ...selectedRequest,
                            priority: newPriority,
                          });
                        }}
                        className="px-2 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-700"
                      >
                        <option value="1">⭐ 1 (Låg)</option>
                        <option value="2">⭐⭐ 2</option>
                        <option value="3">⭐⭐⭐ 3 (Normal)</option>
                        <option value="4">⭐⭐⭐⭐ 4</option>
                        <option value="5">⭐⭐⭐⭐⭐ 5 (Hög)</option>
                      </select>
                    </div>
                  </div>

                  <button
                    onClick={() =>
                      handleDeleteRequest(selectedRequest._id as Id<"requests">)
                    }
                    className="w-full px-3 py-2 text-sm border border-red-500 text-red-600 rounded-lg hover:bg-red-50 dark:hover:bg-red-950 transition-colors flex items-center justify-center gap-2"
                  >
                    <FiTrash2 className="w-4 h-4" />
                    Radera förfrågan
                  </button>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-slate-500">
                <div className="text-center">
                  <FiHeart className="w-16 h-16 mx-auto mb-4 opacity-30" />
                  <p>Välj en förfrågan från listan</p>
                  <p className="text-sm">För att hantera detaljer och status</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Blogg sektion */}
      {activeTab === "blog" && (
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <FiEdit className="text-blue-500" /> Blogginlägg
          </h2>

          <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-4 mb-6">
            <h3 className="font-medium mb-3">
              {editingBlog ? "✏️ Redigera inlägg" : "📝 Skapa nytt inlägg"}
            </h3>
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <input
                type="text"
                placeholder="Titel"
                value={blogForm.title}
                onChange={(e) =>
                  setBlogForm({ ...blogForm, title: e.target.value })
                }
                className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-800"
              />
              <input
                type="text"
                placeholder="Slug (url-namn)"
                value={blogForm.slug}
                onChange={(e) =>
                  setBlogForm({ ...blogForm, slug: e.target.value })
                }
                className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-800"
              />
            </div>
            <input
              type="text"
              placeholder="Kort sammanfattning"
              value={blogForm.excerpt}
              onChange={(e) =>
                setBlogForm({ ...blogForm, excerpt: e.target.value })
              }
              className="w-full mb-4 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-800"
            />
            <textarea
              placeholder="Innehåll (Markdown-stöd)"
              rows={8}
              value={blogForm.content}
              onChange={(e) =>
                setBlogForm({ ...blogForm, content: e.target.value })
              }
              className="w-full mb-4 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-800 font-mono text-sm"
            />
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <input
                type="text"
                placeholder="Kategori (t.ex. Next.js)"
                value={blogForm.category}
                onChange={(e) =>
                  setBlogForm({ ...blogForm, category: e.target.value })
                }
                className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-800"
              />
              <input
                type="text"
                placeholder="Taggar (separera med kommatecken)"
                value={blogForm.tags}
                onChange={(e) =>
                  setBlogForm({ ...blogForm, tags: e.target.value })
                }
                className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-800"
              />
            </div>
            <input
              type="text"
              placeholder="Bild-URL (valfritt)"
              value={blogForm.coverImage}
              onChange={(e) =>
                setBlogForm({ ...blogForm, coverImage: e.target.value })
              }
              className="w-full mb-4 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-800"
            />
            <div className="flex gap-2">
              <button
                onClick={handleSaveBlog}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
              >
                <FiSave /> {editingBlog ? "Uppdatera" : "Publicera"}
              </button>
              {editingBlog && (
                <button
                  onClick={() => {
                    setEditingBlog(null);
                    setBlogForm({
                      title: "",
                      slug: "",
                      excerpt: "",
                      content: "",
                      category: "",
                      tags: "",
                      coverImage: "",
                    });
                  }}
                  className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-600"
                >
                  Avbryt
                </button>
              )}
            </div>
          </div>

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
                      onClick={() => handleEditBlog(blog)}
                      className="p-1 text-blue-600 hover:bg-blue-100 rounded"
                    >
                      <FiEdit />
                    </button>
                    <button
                      onClick={() => handleDeleteBlog(blog._id)}
                      className="p-1 text-red-600 hover:bg-red-100 rounded"
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
