"use client";

import { useState, useEffect, useRef } from "react";
import { useMutation, useQuery } from "convex/react";
import { useUser, SignInButton } from "@clerk/nextjs";
import { api } from "@/convex/_generated/api";
import {
  FiMessageSquare,
  FiX,
  FiSend,
  FiMinimize2,
  FiLogIn,
  FiCircle,
} from "react-icons/fi";

// Admin heartbeat – ALLTID samma hooks oavsett admin eller inte
function AdminHeartbeatInner() {
  const { isSignedIn, user } = useUser();
  const updateAdminStatus = useMutation(api.adminStatus.updateAdminStatus);

  const ADMIN_EMAIL =
    process.env.NEXT_PUBLIC_ADMIN_EMAIL || "ezadkhahaali@gmail.com";
  const isAdmin = user?.primaryEmailAddress?.emailAddress === ADMIN_EMAIL;

  useEffect(() => {
    if (!isSignedIn || !isAdmin) return;

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
  }, [isSignedIn, isAdmin, updateAdminStatus]);

  return null;
}

// ChatWidget komponent – ALLTID samma hooks (returnerar aldrig null, använder CSS display istället)
function ChatWidgetInner() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isAdminOnline, setIsAdminOnline] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [lastUnreadCount, setLastUnreadCount] = useState(0);

  const { isSignedIn, user } = useUser();
  const userEmail = user?.primaryEmailAddress?.emailAddress;
  const userName =
    user?.fullName || user?.firstName || user?.username || "Användare";
  const userImage = user?.imageUrl;

  const ADMIN_EMAIL =
    process.env.NEXT_PUBLIC_ADMIN_EMAIL || "ezadkhahaali@gmail.com";
  const isAdmin = userEmail === ADMIN_EMAIL;

  const sendMessage = useMutation(api.chat.sendMessage);
  const messages = useQuery(
    api.chat.getMessagesByEmail,
    userEmail ? { email: userEmail } : "skip",
  );

  const adminStatusData = useQuery(api.adminStatus.getAdminStatus);

  // Använd Convex admin status
  useEffect(() => {
    if (adminStatusData?.isOnline !== undefined) {
      setIsAdminOnline(adminStatusData.isOnline);
    }
  }, [adminStatusData]);

  // Ljudsignal
  useEffect(() => {
    if (isAdmin) return;

    if (messages && messages.length > 0) {
      const unreadMessages = messages.filter(
        (msg: any) => !msg.isRead && msg.isFromAdmin,
      );
      const currentUnreadCount = unreadMessages.length;

      if (currentUnreadCount > lastUnreadCount && currentUnreadCount > 0) {
        try {
          const audio = new Audio("/sound.mp3");
          audio.volume = 0.3;
          audio.play().catch((e) => console.log("Audio play failed:", e));
        } catch (e) {
          console.log("Audio not supported");
        }
      }
      setLastUnreadCount(currentUnreadCount);
    }
  }, [messages, isAdmin, lastUnreadCount]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !isSignedIn || !userEmail) return;

    setIsSending(true);
    try {
      await sendMessage({
        name: userName,
        email: userEmail,
        message: message,
      });
      setMessage("");
    } catch (error) {
      console.error("Failed to send message:", error);
      alert("Kunde inte skicka meddelandet. Försök igen.");
    } finally {
      setIsSending(false);
    }
  };

  // ANVÄND CSS DISPLAY ISTÄLLET FÖR RETURN NULL – behåller hooks ordningen
  if (isAdmin) {
    return null;
  }

  // Inte inloggad
  if (!isSignedIn) {
    return (
      <>
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 p-4 bg-linear-to-r from-blue-600 to-purple-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-110"
        >
          <FiMessageSquare className="w-6 h-6" />
        </button>
        {isOpen && (
          <div className="fixed bottom-24 right-6 z-50 w-96 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700">
            <div className="flex justify-between items-center p-4 border-b bg-linear-to-r from-blue-600 to-purple-600 rounded-t-2xl">
              <h3 className="font-semibold text-white">Live Chat</h3>
              <button onClick={() => setIsOpen(false)} className="text-white">
                <FiX className="w-5 h-5" />
              </button>
            </div>
            <div className="p-8 text-center">
              <FiLogIn className="w-12 h-12 mx-auto mb-4 text-slate-400" />
              <p className="text-slate-600 dark:text-slate-400 mb-4">
                Logga in för att chatta med oss
              </p>
              <SignInButton mode="modal">
                <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  Logga in
                </button>
              </SignInButton>
            </div>
          </div>
        )}
      </>
    );
  }

  // KUND-VY – med fixad höjd så att stängknappen alltid syns
  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 p-4 bg-linear-to-r from-blue-600 to-purple-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-110"
      >
        <FiMessageSquare className="w-6 h-6" />
        {isAdminOnline ? (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full animate-pulse" />
        ) : (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full" />
        )}
        <span className="absolute -bottom-5 left-1/2 transform -translate-x-1/2 text-[10px] whitespace-nowrap bg-black/70 text-white px-2 py-0.5 rounded-full">
          {isAdminOnline ? "🟢 Online" : "🔴 Offline"}
        </span>
      </button>

      {isOpen && (
        <div
          className={`fixed bottom-24 right-6 z-50 w-96 max-w-[calc(100vw-2rem)] bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 transition-all duration-300 flex flex-col ${
            isMinimized ? "h-14" : "max-h-[80vh] h-125"
          }`}
        >
          {/* Header */}
          <div className="flex justify-between items-center p-4 border-b bg-linear-to-r from-blue-600 to-purple-600 rounded-t-2xl shrink-0">
            <div className="flex items-center gap-2">
              {userImage && (
                <img
                  src={userImage}
                  alt={userName}
                  className="w-8 h-8 rounded-full border-2 border-white"
                />
              )}
              <div>
                <h3 className="font-semibold text-white">Live Chat</h3>
                <p className="text-xs text-white/80">{userName}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="p-1 hover:bg-white/20 rounded-lg"
              >
                <FiMinimize2 className="w-4 h-4 text-white" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-white/20 rounded-lg"
              >
                <FiX className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Messages - scrollbar område med fast höjd */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-0">
                {messages && messages.length === 0 && (
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
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs opacity-75">{msg.name}</span>
                        <span className="text-xs opacity-50">
                          {new Date(msg.createdAt).toLocaleTimeString()}
                        </span>
                      </div>
                      <p className="text-sm wrap-break-word">{msg.message}</p>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Input - fixed at bottom */}
              <form
                onSubmit={handleSendMessage}
                className="p-4 border-t border-slate-200 dark:border-slate-700 shrink-0"
              >
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder={
                      isAdminOnline
                        ? "Skriv ditt meddelande..."
                        : "Admin offline, du kan skriva..."
                    }
                    className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-700"
                  />
                  <button
                    type="submit"
                    disabled={isSending || !message.trim()}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                  >
                    {isSending ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <FiSend className="w-4 h-4" />
                    )}
                  </button>
                </div>
                <p className="text-xs text-slate-500 text-center mt-2">
                  🔒 {userEmail}
                </p>
              </form>
            </>
          )}
        </div>
      )}
    </>
  );
}

// Huvudkomponent
export default function ClientWidgets() {
  return (
    <>
      <AdminHeartbeatInner />
      <ChatWidgetInner />
    </>
  );
}
