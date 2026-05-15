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
} from "react-icons/fi";

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Hämta inloggad användare från Clerk
  const { isSignedIn, user } = useUser();

  // Användarens riktiga email och namn från Clerk (kan inte fejkas!)
  const userEmail = user?.primaryEmailAddress?.emailAddress;
  const userName = user?.fullName || user?.firstName || "Användare";

  const sendMessage = useMutation(api.chat.sendMessage);
  const messages = useQuery(
    api.chat.getMessagesByEmail,
    userEmail ? { email: userEmail } : "skip",
  );

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
    } finally {
      setIsSending(false);
    }
  };

  // Om användaren inte är inloggad - visa inloggningsknapp
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
          <div className="fixed bottom-24 right-6 z-50 w-96 max-w-[calc(100vw-2rem)] bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700">
            <div className="flex justify-between items-center p-4 border-b border-slate-200 dark:border-slate-700 bg-linear-to-r from-blue-600 to-purple-600 rounded-t-2xl">
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
              <p className="text-xs text-slate-500 mt-4">
                🔒 Vi använder din verifierade email för att kunna svara dig
              </p>
            </div>
          </div>
        )}
      </>
    );
  }

  // Huvud-chatten (inloggad användare)
  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 p-4 bg-linear-to-r from-blue-600 to-purple-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-110"
      >
        <FiMessageSquare className="w-6 h-6" />
        {messages &&
          messages.length > 0 &&
          !messages[messages.length - 1].isRead &&
          !messages[messages.length - 1].isFromAdmin && (
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse" />
          )}
      </button>

      {isOpen && (
        <div
          className={`fixed bottom-24 right-6 z-50 w-96 max-w-[calc(100vw-2rem)] bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 transition-all duration-300 ${
            isMinimized ? "h-14" : "h-125"
          }`}
        >
          {/* Header */}
          <div className="flex justify-between items-center p-4 border-b border-slate-200 dark:border-slate-700 bg-linear-to-r from-blue-600 to-purple-600 rounded-t-2xl">
            <div>
              <h3 className="font-semibold text-white">Live Chat</h3>
              <p className="text-xs text-white/80">Inloggad som {userName}</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="p-1 hover:bg-white/20 rounded-lg transition-colors text-white"
              >
                <FiMinimize2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-white/20 rounded-lg transition-colors text-white"
              >
                <FiX className="w-4 h-4" />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3 h-90">
                {messages && messages.length === 0 && (
                  <div className="text-center text-slate-500 mt-8">
                    <p>Inga meddelanden ännu</p>
                    <p className="text-sm">
                      Skriv något för att starta konversationen
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
                      <p className="text-sm">{msg.message}</p>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <form
                onSubmit={handleSendMessage}
                className="p-4 border-t border-slate-200 dark:border-slate-700"
              >
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Skriv ditt meddelande..."
                    className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="submit"
                    disabled={isSending || !message.trim()}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                  >
                    <FiSend className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-xs text-slate-500 text-center mt-2">
                  🔒 Inloggad som{" "}
                  <span className="font-medium">{userEmail}</span>
                </p>
              </form>
            </>
          )}
        </div>
      )}
    </>
  );
}
