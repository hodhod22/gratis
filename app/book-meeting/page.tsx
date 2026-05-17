// app/book-meeting/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import {
  FiCalendar,
  FiClock,
  FiUser,
  FiMail,
  FiPhone,
  FiMessageSquare,
  FiCheckCircle,
  FiAlertCircle,
  FiVideo,
  FiMapPin,
} from "react-icons/fi";

interface FormData {
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  meetingType: "video" | "in-person" | "phone";
  message: string;
}

const availableTimeSlots = [
  "09:00",
  "10:00",
  "11:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
];

// Hjälpfunktion för att formatera datum för display
const formatDateForDisplay = (date: Date): string => {
  return date.toLocaleDateString("sv-SE", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

// Hjälpfunktion för att få datum som YYYY-MM-DD för value i select
const getDateValue = (date: Date): string => {
  return date.toISOString().split("T")[0];
};

export default function BookMeetingPage() {
  const { user, isLoaded } = useUser();
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    date: "",
    time: "",
    meetingType: "video",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });

  const bookMeeting = useMutation(api.meetings.bookMeeting);

  // Generera tillgängliga datum
  const getAvailableDates = () => {
    const dates = [];
    const today = new Date();
    for (let i = 1; i <= 14; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      date.setHours(0, 0, 0, 0);
      // Skip weekends (lördag och söndag)
      if (date.getDay() !== 0 && date.getDay() !== 6) {
        dates.push(date);
      }
    }
    return dates;
  };

  const availableDates = getAvailableDates();

  // Fyll i användardata om tillgängligt
  useEffect(() => {
    if (user && isLoaded) {
      setFormData((prev) => ({
        ...prev,
        name: user.fullName || "",
        email: user.emailAddresses[0]?.emailAddress || "",
      }));
    }
  }, [user, isLoaded]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validera att datum och tid är valda
    if (!formData.date || !formData.time) {
      setSubmitStatus({
        type: "error",
        message: "Vänligen välj både datum och tid.",
      });
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: "" });

    try {
      // Hitta det valda datumet för att spara som ISO-string
      const selectedDate = availableDates.find(
        (d) => getDateValue(d) === formData.date,
      );

      await bookMeeting({
        ...formData,
        date: selectedDate ? selectedDate.toISOString() : formData.date,
      });

      setSubmitStatus({
        type: "success",
        message: "Mötet är bokat! Du kommer få en bekräftelse via email.",
      });

      // Reset form
      setFormData((prev) => ({
        ...prev,
        date: "",
        time: "",
        message: "",
      }));
    } catch (error) {
      console.error("Error booking meeting:", error);
      setSubmitStatus({
        type: "error",
        message: "Något gick fel. Försök igen eller kontakta admin direkt.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Boka ett möte
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Välj en tid som passar dig så ses vi!
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Info panel */}
          <div className="md:col-span-1 space-y-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-5">
              <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                <FiCalendar className="text-blue-500" />
                Om mötet
              </h3>
              <ul className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
                <li className="flex items-start gap-2">
                  <FiClock className="w-4 h-4 mt-0.5 text-blue-500" />
                  <span>30-60 minuters möte</span>
                </li>
                <li className="flex items-start gap-2">
                  <FiVideo className="w-4 h-4 mt-0.5 text-blue-500" />
                  <span>Via WhatsApp, Google Meet, Zoom eller fysiskt</span>
                </li>
                <li className="flex items-start gap-2">
                  <FiMapPin className="w-4 h-4 mt-0.5 text-blue-500" />
                  <span>Flexibelt efter dina önskemål</span>
                </li>
              </ul>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-5">
              <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                <FiMessageSquare className="text-blue-500" />
                Inför mötet
              </h3>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400 list-disc list-inside">
                <li>Förbered dina frågor</li>
                <li>Ha din projektidé redo</li>
                <li>Var gärna 5 minuter tidig</li>
              </ul>
            </div>
          </div>

          {/* Booking form */}
          <div className="md:col-span-2">
            <form
              onSubmit={handleSubmit}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
            >
              <h2 className="text-xl font-semibold mb-4">
                Bokningsinformation
              </h2>

              {/* Name */}
              <div className="mb-4">
                <label className="text-sm font-medium mb-1 flex items-center gap-1">
                  <FiUser className="w-4 h-4" /> Namn *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none dark:bg-gray-700 dark:border-gray-600"
                  placeholder="Ditt namn"
                />
              </div>

              {/* Email */}
              <div className="mb-4">
                <label className="text-sm font-medium mb-1 flex items-center gap-1">
                  <FiMail className="w-4 h-4" /> E-post *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none dark:bg-gray-700 dark:border-gray-600"
                  placeholder="din@email.se"
                />
              </div>

              {/* Phone */}
              <div className="mb-4">
                <label className="text-sm font-medium mb-1 flex items-center gap-1">
                  <FiPhone className="w-4 h-4" /> Telefon (valfritt)
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none dark:bg-gray-700 dark:border-gray-600"
                  placeholder="076-123 45 67"
                />
              </div>

              {/* Date */}
              <div className="mb-4">
                <label className="text-sm font-medium mb-1 flex items-center gap-1">
                  <FiCalendar className="w-4 h-4" /> Datum *
                </label>
                <select
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none dark:bg-gray-700 dark:border-gray-600"
                >
                  <option value="">Välj datum</option>
                  {availableDates.map((date) => (
                    <option key={getDateValue(date)} value={getDateValue(date)}>
                      {formatDateForDisplay(date)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Time */}
              <div className="mb-4">
                <label className="text-sm font-medium mb-1 flex items-center gap-1">
                  <FiClock className="w-4 h-4" /> Tid *
                </label>
                <select
                  name="time"
                  value={formData.time}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none dark:bg-gray-700 dark:border-gray-600"
                >
                  <option value="">Välj tid</option>
                  {availableTimeSlots.map((time) => (
                    <option key={time} value={time}>
                      {time}
                    </option>
                  ))}
                </select>
              </div>

              {/* Meeting Type */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">
                  Mötestyp
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="meetingType"
                      value="video"
                      checked={formData.meetingType === "video"}
                      onChange={handleChange}
                      className="text-blue-500"
                    />
                    <FiVideo className="w-4 h-4" /> Video
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="meetingType"
                      value="in-person"
                      checked={formData.meetingType === "in-person"}
                      onChange={handleChange}
                      className="text-blue-500"
                    />
                    <FiMapPin className="w-4 h-4" /> Fysiskt
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="meetingType"
                      value="phone"
                      checked={formData.meetingType === "phone"}
                      onChange={handleChange}
                      className="text-blue-500"
                    />
                    <FiPhone className="w-4 h-4" /> Telefon
                  </label>
                </div>
              </div>

              {/* Message */}
              <div className="mb-6">
                <label className="text-sm font-medium mb-1 flex items-center gap-1">
                  <FiMessageSquare className="w-4 h-4" /> Meddelande (valfritt)
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none dark:bg-gray-700 dark:border-gray-600"
                  placeholder="Berätta gärna lite om vad du vill prata om..."
                />
              </div>

              {/* Status message */}
              {submitStatus.type && (
                <div
                  className={`mb-4 p-3 rounded-lg flex items-center gap-2 ${
                    submitStatus.type === "success"
                      ? "bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                      : "bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                  }`}
                >
                  {submitStatus.type === "success" ? (
                    <FiCheckCircle className="w-5 h-5" />
                  ) : (
                    <FiAlertCircle className="w-5 h-5" />
                  )}
                  {submitStatus.message}
                </div>
              )}

              {/* Submit button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 bg-linear-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Bokar...
                  </div>
                ) : (
                  "Boka möte"
                )}
              </button>

              <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-4">
                * Obligatoriska fält
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
