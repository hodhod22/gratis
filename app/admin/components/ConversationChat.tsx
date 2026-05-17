// app/admin/components/ConversationChat.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import Attachment from "@/components/chat/Attachment";
import { useChatFileUpload } from "@/components/chat/useChatFileUpload";
import {
  FiAtSign,
  FiSend,
  FiPaperclip,
  FiImage,
  FiFile,
  FiTrash2,
  FiArchive,
  FiMessageSquare,
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

interface ConversationChatProps {
  conversationId: string | null;
  onSendMessage: (
    email: string,
    name: string,
    message: string,
    attachments: any[],
  ) => Promise<void>;
  onMarkAsRead: (email: string) => Promise<void>;
  onClose: (email: string) => Promise<void>;
}

export default function ConversationChat({
  conversationId,
  onSendMessage,
  onMarkAsRead,
  onClose,
}: ConversationChatProps) {
  const [replyText, setReplyText] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { uploadFiles } = useChatFileUpload();

  // Fix: Använd rätt typ för args
  const conversationData = useQuery(
    api.admin.getConversationById,
    conversationId ? { id: conversationId as Id<"conversations"> } : "skip",
  );

  const messages = useQuery(
    api.admin.getConversationMessages,
    conversation?.email ? { email: conversation.email } : "skip",
  );

  const deleteMessage = useMutation(api.admin.deleteMessage);

  // Uppdatera conversation när data kommer
  useEffect(() => {
    if (conversationData) {
      setConversation(conversationData as Conversation);
    }
  }, [conversationData]);

  // Scrolla till botten när nya meddelanden kommer
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Markera som läst när konversation öppnas
  useEffect(() => {
    if (conversation?.email && conversation.unreadCount > 0) {
      onMarkAsRead(conversation.email);
    }
  }, [conversation, onMarkAsRead]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (selectedFiles.length + files.length > 3) {
      alert("Max 3 filer per meddelande");
      return;
    }
    const tooLarge = files.filter((f) => f.size > 5 * 1024 * 1024);
    if (tooLarge.length > 0) {
      alert(`"${tooLarge[0].name}" är för stor (max 5MB)`);
      return;
    }
    setSelectedFiles([...selectedFiles, ...files]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if ((!replyText.trim() && selectedFiles.length === 0) || !conversation)
      return;

    setIsSending(true);
    setUploading(true);
    try {
      const attachments =
        selectedFiles.length > 0 ? await uploadFiles(selectedFiles) : [];
      await onSendMessage(
        conversation.email,
        conversation.name,
        replyText.trim() ||
          (attachments.length > 0 ? "📎 Skickade fil(er)" : ""),
        attachments,
      );
      setReplyText("");
      setSelectedFiles([]);
    } catch (error) {
      console.error("Failed to send:", error);
      alert("Kunde inte skicka meddelandet.");
    } finally {
      setIsSending(false);
      setUploading(false);
    }
  };

  const handleDeleteMessage = async (messageId: Id<"messages">) => {
    if (confirm("Radera meddelandet?")) {
      await deleteMessage({ id: messageId });
    }
  };

  if (!conversationId) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden flex flex-col h-150">
        <div className="flex-1 flex items-center justify-center text-slate-500">
          <div className="text-center">
            <FiMessageSquare className="w-16 h-16 mx-auto mb-4 opacity-30" />
            <p>Välj en konversation från listan</p>
          </div>
        </div>
      </div>
    );
  }

  if (!conversation) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden flex flex-col h-150">
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden flex flex-col h-150">
      {/* Header */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-700 bg-linear-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="font-semibold text-lg">{conversation.name}</h2>
            <p className="text-sm text-slate-500 flex items-center gap-1 mt-1">
              <FiAtSign className="w-3 h-3" />
              {conversation.email}
            </p>
          </div>
          <button
            onClick={() => onClose(conversation.email)}
            className="px-3 py-1 text-sm bg-orange-500 text-white rounded-lg hover:bg-orange-600 flex items-center gap-1"
          >
            <FiArchive className="w-4 h-4" />
            Stäng
          </button>
        </div>
      </div>

      {/* Messages */}
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
              className={`max-w-[80%] rounded-lg p-3 ${msg.isFromAdmin ? "bg-slate-100 dark:bg-slate-700 rounded-bl-none" : "bg-blue-600 text-white rounded-br-none"}`}
            >
              <div className="flex items-center gap-2 mb-1 flex-wrap">
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

      {/* File previews */}
      {selectedFiles.length > 0 && (
        <div className="px-4 pt-2 flex flex-wrap gap-2 border-t border-slate-200 dark:border-slate-700">
          {selectedFiles.map((file, idx) => (
            <div
              key={idx}
              className="bg-slate-100 dark:bg-slate-700 rounded-lg p-2 text-xs flex items-center gap-2"
            >
              {file.type.startsWith("image/") ? (
                <FiImage className="w-4 h-4" />
              ) : (
                <FiFile className="w-4 h-4" />
              )}
              <span className="max-w-25 truncate">{file.name}</span>
              <button
                onClick={() =>
                  setSelectedFiles(selectedFiles.filter((_, i) => i !== idx))
                }
                className="text-red-500"
              >
                <FiTrash2 className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Input form */}
      <form
        onSubmit={handleSend}
        className="p-4 border-t border-slate-200 dark:border-slate-700"
      >
        <div className="flex gap-2">
          <input
            type="text"
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder="Skriv ditt svar..."
            className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-700"
            disabled={uploading}
          />
          <label className="px-3 py-2 bg-slate-200 dark:bg-slate-600 rounded-lg cursor-pointer hover:bg-slate-300">
            <FiPaperclip className="w-4 h-4" />
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*,video/mp4,application/pdf,.txt,.doc,.docx"
              onChange={handleFileSelect}
              className="hidden"
            />
          </label>
          <button
            type="submit"
            disabled={
              isSending ||
              uploading ||
              (!replyText.trim() && selectedFiles.length === 0)
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
        <p className="text-xs text-slate-500 mt-2">📎 Max 3 filer, 5MB/fil</p>
      </form>
    </div>
  );
}
