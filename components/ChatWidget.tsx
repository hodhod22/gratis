"use client";

import { useState, useEffect, useRef } from "react";
import { useMutation, useQuery } from "convex/react";
import { useUser, SignInButton } from "@clerk/nextjs";
import { api } from "@/convex/_generated/api";
import Attachment from "@/components/chat/Attachment";
import { useChatFileUpload } from "@/components/chat/useChatFileUpload";
import {
  notifyChatEvent,
  preloadNotificationSound,
  requestNotificationPermission,
} from "@/lib/notifications";
import NotificationEnableBanner from "@/components/NotificationEnableBanner";
import {
  FiMessageSquare,
  FiX,
  FiSend,
  FiMinimize2,
  FiLogIn,
  FiPaperclip,
  FiImage,
  FiFile,
  FiTrash2,
} from "react-icons/fi";


export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const adminMessagesInitialized = useRef(false);
  const seenAdminMessageIds = useRef<Set<string>>(new Set());

  const { isSignedIn, user } = useUser();
  const userEmail = user?.primaryEmailAddress?.emailAddress;
  const userName =
    user?.fullName || user?.firstName || user?.username || "Användare";
  const userImage = user?.imageUrl;

  const ADMIN_EMAIL =
    process.env.NEXT_PUBLIC_ADMIN_EMAIL || "ezadkhahaali@gmail.com";
  const isAdmin = userEmail === ADMIN_EMAIL;

  const { uploadFiles } = useChatFileUpload();
  const sendMessage = useMutation(api.chat.sendMessage);
  const recordCustomerOnline = useMutation(api.chat.recordCustomerOnline);
  const markCustomerRead = useMutation(api.chat.markCustomerMessagesRead);
  const customerUnread =
    useQuery(
      api.chat.getCustomerUnreadCount,
      userEmail ? { email: userEmail } : "skip",
    ) ?? 0;
  const adminStatus = useQuery(api.adminStatus.getAdminStatus);
  const isAdminOnline = adminStatus?.isOnline ?? false;
  const messages = useQuery(
    api.chat.getMessagesByEmail,
    userEmail ? { email: userEmail } : "skip",
  );

  useEffect(() => {
    if (isAdmin || !isOpen || !userEmail) return;
    void markCustomerRead({ email: userEmail });
  }, [isAdmin, isOpen, userEmail, markCustomerRead]);

  // Meddela admin att kunden är inloggad (ping var 5:e min)
  useEffect(() => {
    if (isAdmin || !isSignedIn || !userEmail) return;
    void recordCustomerOnline({ email: userEmail, name: userName });
    const interval = setInterval(
      () => void recordCustomerOnline({ email: userEmail, name: userName }),
      5 * 60 * 1000,
    );
    return () => clearInterval(interval);
  }, [isAdmin, isSignedIn, userEmail, userName, recordCustomerOnline]);

  // Ljud för varje nytt meddelande från admin
  useEffect(() => {
    if (isAdmin || !messages) return;
    if (!adminMessagesInitialized.current) {
      for (const msg of messages) {
        if (msg.isFromAdmin) seenAdminMessageIds.current.add(msg._id);
      }
      adminMessagesInitialized.current = true;
      return;
    }
    for (const msg of messages) {
      if (msg.isFromAdmin && !seenAdminMessageIds.current.has(msg._id)) {
        seenAdminMessageIds.current.add(msg._id);
        const preview =
          msg.message?.trim() ||
          (msg.attachments?.length ? "📎 Skickade en bilaga" : "Nytt meddelande");
        notifyChatEvent({
          soundVolume: 0.4,
          skipDesktop: isOpen && !isMinimized,
          desktop: {
            title: "Nytt meddelande från Admin",
            body: preview.slice(0, 140),
            tag: `admin-msg-${msg._id}`,
            onClick: () => setIsOpen(true),
          },
        });
      }
    }
  }, [isAdmin, messages, isOpen, isMinimized]);

  useEffect(() => {
    if (isAdmin || !messagesEndRef.current) return;
    messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
  }, [isAdmin, messages]);

  // ADMIN SER INGEN WIDGET
  if (isAdmin) {
    return null;
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (selectedFiles.length + files.length > 3) {
      alert("Du kan bara skicka max 3 filer per meddelande");
      return;
    }

    const tooLarge = files.filter((f) => f.size > 5 * 1024 * 1024);
    if (tooLarge.length > 0) {
      alert(`Filen "${tooLarge[0].name}" är för stor. Max 5MB per fil.`);
      return;
    }

    setSelectedFiles([...selectedFiles, ...files]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeFile = (index: number) => {
    setSelectedFiles(selectedFiles.filter((_, i) => i !== index));
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      (!message.trim() && selectedFiles.length === 0) ||
      !isSignedIn ||
      !userEmail
    )
      return;

    setIsSending(true);
    setUploading(true);

    try {
      const attachments =
        selectedFiles.length > 0 ? await uploadFiles(selectedFiles) : [];

      await sendMessage({
        name: userName,
        email: userEmail,
        message:
          message.trim() ||
          (attachments.length > 0 ? "📎 Skickade fil(er)" : ""),
        attachments: attachments,
      });

      setMessage("");
      setSelectedFiles([]);
    } catch (error) {
      console.error("Failed to send message:", error);
      alert("Kunde inte skicka meddelandet. Försök igen.");
    } finally {
      setIsSending(false);
      setUploading(false);
    }
  };

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

  return (
    <>
      <button
        onClick={() => {
          preloadNotificationSound();
          void requestNotificationPermission();
          setIsOpen(true);
        }}
        className="fixed bottom-6 right-6 z-50 p-4 bg-linear-to-r from-blue-600 to-purple-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-110"
      >
        <FiMessageSquare className="w-6 h-6" />
        {isAdminOnline ? (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full animate-pulse" />
        ) : (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full" />
        )}
        {customerUnread > 0 && (
          <span className="absolute -bottom-1 -left-1 min-w-5 h-5 px-1 bg-blue-600 text-white text-xs rounded-full flex items-center justify-center font-semibold">
            {customerUnread > 9 ? "9+" : customerUnread}
          </span>
        )}
      </button>

      {isOpen && (
        <div
          className={`fixed bottom-24 right-6 z-50 w-96 max-w-[calc(100vw-2rem)] bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 transition-all duration-300 flex flex-col ${isMinimized ? "h-14" : "max-h-[80vh] h-125"}`}
        >
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
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-white">Live Chat</h3>
                  <span
                    className={`w-2.5 h-2.5 rounded-full shrink-0 ${isAdminOnline ? "bg-green-400 animate-pulse" : "bg-slate-400"}`}
                    title={isAdminOnline ? "Admin online" : "Admin offline"}
                  />
                </div>
                <p className="text-xs text-white/80">
                  {isAdminOnline ? "Admin är online" : "Admin är offline"} ·{" "}
                  {userName}
                </p>
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
              <NotificationEnableBanner className="mx-4 mt-3 shrink-0" />
              <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-0">
                {messages && messages.length === 0 && (
                  <div className="text-center text-slate-500 mt-8">
                    <p>Inga meddelanden ännu</p>
                    <p className="text-sm">
                      Skriv något eller skicka en bild 📎
                    </p>
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
                      {msg.message && (
                        <p className="text-sm wrap-break-word">{msg.message}</p>
                      )}
                      {msg.attachments && msg.attachments.length > 0 && (
                        <div className="mt-2 space-y-2">
                          {msg.attachments.map((file: any, idx: number) => (
                            <Attachment key={idx} file={file} />
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {selectedFiles.length > 0 && (
                <div className="px-4 pt-2 pb-1 flex flex-wrap gap-2 border-t border-slate-200 dark:border-slate-700">
                  {selectedFiles.map((file, idx) => (
                    <div
                      key={idx}
                      className="relative bg-slate-100 dark:bg-slate-700 rounded-lg p-2 text-xs flex items-center gap-2"
                    >
                      {file.type.startsWith("image/") ? (
                        <FiImage className="w-4 h-4" />
                      ) : (
                        <FiFile className="w-4 h-4" />
                      )}
                      <span className="max-w-25 truncate">
                        {file.name}
                      </span>
                      <button
                        onClick={() => removeFile(idx)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <FiTrash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

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
                        : "Admin är offline, du kan skriva meddelande..."
                    }
                    className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-700"
                    disabled={uploading}
                  />
                  <label
                    htmlFor="file-upload-chat"
                    className="px-3 py-2 bg-slate-200 dark:bg-slate-600 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-500 cursor-pointer transition-colors"
                  >
                    <FiPaperclip className="w-4 h-4" />
                  </label>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileSelect}
                    multiple
                    accept="image/*,video/mp4,application/pdf,.txt,.doc,.docx"
                    className="hidden"
                    id="file-upload-chat"
                  />
                  <button
                    type="submit"
                    disabled={
                      isSending ||
                      (!message.trim() && selectedFiles.length === 0)
                    }
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                  >
                    {uploading ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <FiSend className="w-4 h-4" />
                    )}
                  </button>
                </div>
                <div className="flex justify-between text-xs text-slate-500 mt-2">
                  <span>🔒 {userEmail}</span>
                  <span>📎 Max 3 filer, 5MB/fil</span>
                </div>
              </form>
            </>
          )}
        </div>
      )}
    </>
  );
}
