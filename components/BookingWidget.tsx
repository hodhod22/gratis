"use client";

import { useState } from "react";
import {
  FiCalendar,
  FiClock,
  FiUser,
  FiMail,
  FiSend,
  FiCheck,
} from "react-icons/fi";

export default function BookingWidget() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    date: "",
    time: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulera bokning - ersätt med riktig API-anrop
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setTimeout(() => setIsSubmitted(false), 5000);
    }, 1500);
  };

  if (isSubmitted) {
    return (
      <div className="text-center p-6 bg-green-50 dark:bg-green-950/30 rounded-xl">
        <FiCheck className="w-12 h-12 text-green-600 mx-auto mb-3" />
        <h3 className="text-lg font-semibold mb-2">Bokning mottagen!</h3>
        <p className="text-slate-600 dark:text-slate-400">
          Jag återkommer inom kort för att bekräfta din tid.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1 items-center gap-2">
            <FiUser /> Namn
          </label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-slate-800"
            placeholder="Ditt namn"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 items-center gap-2">
            <FiMail /> Email
          </label>
          <input
            type="email"
            required
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-slate-800"
            placeholder="din@email.se"
          />
        </div>
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1 items-center gap-2">
            <FiCalendar /> Datum
          </label>
          <input
            type="date"
            required
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-slate-800"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 items-center gap-2">
            <FiClock /> Tid
          </label>
          <select
            required
            value={formData.time}
            onChange={(e) => setFormData({ ...formData, time: e.target.value })}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-slate-800"
          >
            <option value="">Välj tid</option>
            <option value="09:00">09:00</option>
            <option value="10:00">10:00</option>
            <option value="11:00">11:00</option>
            <option value="13:00">13:00</option>
            <option value="14:00">14:00</option>
            <option value="15:00">15:00</option>
            <option value="16:00">16:00</option>
            <option value="17:00">17:00</option>
          </select>
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">
          Meddelande (valfritt)
        </label>
        <textarea
          rows={3}
          value={formData.message}
          onChange={(e) =>
            setFormData({ ...formData, message: e.target.value })
          }
          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-slate-800"
          placeholder="Vad vill du prata om?"
        />
      </div>
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
      >
        {isSubmitting ? (
          "Bokar..."
        ) : (
          <>
            <FiSend />
            Boka möte (30 min gratis)
          </>
        )}
      </button>
      <p className="text-xs text-center text-slate-500">
        📅 Gratis 30-minuters konsultation • Online via Google Meet
      </p>
    </form>
  );
}
