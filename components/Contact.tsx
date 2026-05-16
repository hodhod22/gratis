"use client";

import { useState } from "react";
import {
  FiMail,
  FiGithub,
  FiLinkedin,
  FiSend,
  FiMapPin,
  FiCheck,
} from "react-icons/fi";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isSending, setIsSending] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);

    // Simulera sändning
    setTimeout(() => {
      setIsSending(false);
      setIsSent(true);
      setFormData({ name: "", email: "", message: "" });
      setTimeout(() => setIsSent(false), 5000);
    }, 1500);

    // Verklig sändning till din email
    // await fetch("/api/send-email", {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify(formData),
    // });
  };

  return (
    <section id="contact" className="py-20 bg-white dark:bg-slate-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Kontakta mig</h2>
          <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Intresserad av att jobba tillsammans? Hör av dig!
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div className="space-y-6">
            <div className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
              <FiMail className="w-8 h-8 text-blue-600" />
              <div>
                <h3 className="font-semibold">Email</h3>
                <a
                  href="mailto:din@email.se"
                  className="text-slate-600 dark:text-slate-400 hover:text-blue-600"
                >
                  din@email.se
                </a>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
              <FiGithub className="w-8 h-8 text-blue-600" />
              <div>
                <h3 className="font-semibold">GitHub</h3>
                <a
                  href="https://github.com/hodhod22"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-600 dark:text-slate-400 hover:text-blue-600"
                >
                  /hodhod22
                </a>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
              <FiLinkedin className="w-8 h-8 text-blue-600" />
              <div>
                <h3 className="font-semibold">LinkedIn</h3>
                <a
                  href="https://linkedin.com/in/dittnamn"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-600 dark:text-slate-400 hover:text-blue-600"
                >
                  /in/dittnamn
                </a>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
              <FiMapPin className="w-8 h-8 text-blue-600" />
              <div>
                <h3 className="font-semibold">Plats</h3>
                <p className="text-slate-600 dark:text-slate-400">Sverige</p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Ditt namn"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full px-4 py-3 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <input
              type="email"
              placeholder="Din email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="w-full px-4 py-3 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <textarea
              placeholder="Ditt meddelande"
              rows={5}
              value={formData.message}
              onChange={(e) =>
                setFormData({ ...formData, message: e.target.value })
              }
              className="w-full px-4 py-3 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <button
              type="submit"
              disabled={isSending}
              className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {isSending ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Skickar...
                </>
              ) : isSent ? (
                <>
                  <FiCheck className="w-5 h-5" />
                  Skickat! Jag återkommer snart
                </>
              ) : (
                <>
                  <FiSend />
                  Skicka meddelande
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
