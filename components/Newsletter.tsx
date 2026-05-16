"use client";

import { useState } from "react";
import { FiMail, FiSend, FiCheck } from "react-icons/fi";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulera prenumeration
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubscribed(true);
      setEmail("");
      setTimeout(() => setIsSubscribed(false), 5000);
    }, 1000);
  };

  return (
    <div className="bg-linear-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold mb-2">📧 Håll dig uppdaterad</h3>
        <p className="text-white/80">
          Få tips om webbutveckling, gratis hemsidor och erbjudanden direkt i
          din inbox
        </p>
      </div>
      <form onSubmit={handleSubmit} className="max-w-md mx-auto">
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Din email"
              className="w-full pl-10 pr-4 py-3 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-white"
            />
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-slate-100 transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {isSubmitting ? "..." : isSubscribed ? <FiCheck /> : <FiSend />}
          </button>
        </div>
        <p className="text-xs text-center text-white/70 mt-3">
          Ingen spam. Avsluta när som helst.
        </p>
      </form>
    </div>
  );
}
