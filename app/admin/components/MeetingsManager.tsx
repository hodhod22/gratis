// app/admin/components/MeetingsManager.tsx
"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import {
  FiCalendar,
  FiClock,
  FiUser,
  FiMail,
  FiPhone,
  FiVideo,
  FiMapPin,
  FiCheckCircle,
  FiClock as FiPending,
  FiLink,
  FiRefreshCw,
  FiEdit2,
  FiSave,
  FiMessageSquare,
  FiThumbsUp,
  FiThumbsDown,
} from "react-icons/fi";

interface Meeting {
  _id: Id<"meetings">;
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  meetingType: string;
  message: string;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  meetingLink?: string;
  adminNotes?: string;
  createdAt: number;
  updatedAt: number;
}

export default function MeetingsManager() {
  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null);
  const [meetingLink, setMeetingLink] = useState("");
  const [adminNotes, setAdminNotes] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [isEditingNotes, setIsEditingNotes] = useState(false);

  const meetings = useQuery(api.meetings.getAllMeetings) || [];
  const updateMeetingStatus = useMutation(api.meetings.updateMeetingStatus);
  const cancelMeeting = useMutation(api.meetings.cancelMeeting);
  const completeMeeting = useMutation(api.meetings.completeMeeting);

  const filteredMeetings = meetings
    .filter((meeting: Meeting) =>
      statusFilter === "all" ? true : meeting.status === statusFilter,
    )
    .filter(
      (meeting: Meeting) =>
        searchTerm === "" ||
        meeting.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        meeting.email.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    .sort((a: Meeting, b: Meeting) => b.createdAt - a.createdAt);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400";
      case "confirmed":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
      case "completed":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
      case "cancelled":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <FiPending className="w-4 h-4" />;
      case "confirmed":
        return <FiCheckCircle className="w-4 h-4" />;
      case "completed":
        return <FiThumbsUp className="w-4 h-4" />;
      case "cancelled":
        return <FiThumbsDown className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return "Väntar";
      case "confirmed":
        return "Bekräftad";
      case "completed":
        return "Genomförd";
      case "cancelled":
        return "Avbokad";
      default:
        return status;
    }
  };

  const getMeetingTypeIcon = (type: string) => {
    switch (type) {
      case "video":
        return <FiVideo className="w-4 h-4" />;
      case "in-person":
        return <FiMapPin className="w-4 h-4" />;
      case "phone":
        return <FiPhone className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const getMeetingTypeText = (type: string) => {
    switch (type) {
      case "video":
        return "Video";
      case "in-person":
        return "Fysiskt";
      case "phone":
        return "Telefon";
      default:
        return type;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("sv-SE", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleConfirmMeeting = async (id: Id<"meetings">) => {
    try {
      await updateMeetingStatus({
        id,
        status: "confirmed",
        meetingLink: meetingLink || undefined,
      });
      if (selectedMeeting?._id === id) {
        setSelectedMeeting({
          ...selectedMeeting,
          status: "confirmed",
          meetingLink: meetingLink || selectedMeeting.meetingLink,
        });
      }
      setMeetingLink("");
      alert("Mötet har bekräftats!");
      window.location.reload();
    } catch (error) {
      console.error("Fel:", error);
      alert("Kunde inte bekräfta mötet");
    }
  };

  const handleCompleteMeeting = async (id: Id<"meetings">) => {
    const feedback = prompt("Eventuell feedback/anteckning från mötet:");
    try {
      await completeMeeting({
        id,
        feedback: feedback || undefined,
      });
      if (selectedMeeting?._id === id) {
        setSelectedMeeting({
          ...selectedMeeting,
          status: "completed",
          adminNotes: feedback
            ? `Genomfört: ${feedback}\n${selectedMeeting.adminNotes || ""}`
            : selectedMeeting.adminNotes,
        });
      }
      alert("Mötet har markerats som genomfört!");
      window.location.reload();
    } catch (error) {
      console.error("Fel:", error);
      alert("Kunde inte slutföra mötet");
    }
  };

  const handleCancelMeeting = async (id: Id<"meetings">) => {
    const reason = prompt("Anledning till avbokning (valfritt):");
    try {
      await cancelMeeting({
        id,
        reason: reason || undefined,
      });
      if (selectedMeeting?._id === id) {
        setSelectedMeeting(null);
      }
      alert("Mötet har avbokats!");
      window.location.reload();
    } catch (error) {
      console.error("Fel:", error);
      alert("Kunde inte avboka mötet");
    }
  };

  const handleSaveNotes = async (id: Id<"meetings">) => {
    try {
      await updateMeetingStatus({
        id,
        status: selectedMeeting?.status || "pending",
        adminNotes: adminNotes,
      });
      if (selectedMeeting?._id === id) {
        setSelectedMeeting({
          ...selectedMeeting,
          adminNotes: adminNotes,
        });
      }
      setIsEditingNotes(false);
      alert("Anteckningarna har sparats!");
    } catch (error) {
      console.error("Fel:", error);
      alert("Kunde inte spara anteckningar");
    }
  };

  const stats = {
    total: meetings.length,
    pending: meetings.filter((m: Meeting) => m.status === "pending").length,
    confirmed: meetings.filter((m: Meeting) => m.status === "confirmed").length,
    completed: meetings.filter((m: Meeting) => m.status === "completed").length,
    cancelled: meetings.filter((m: Meeting) => m.status === "cancelled").length,
  };

  const getDayName = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("sv-SE", { weekday: "long" });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2 text-slate-800 dark:text-white">
            <FiCalendar className="text-blue-500" />
            Mötesbokningar
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            Hantera inkomna mötesförfrågningar
          </p>
        </div>
        <button
          onClick={() => window.location.reload()}
          className="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition"
        >
          <FiRefreshCw className="w-5 h-5" />
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div
          className="bg-white dark:bg-slate-800 rounded-xl p-3 shadow-lg cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700 transition"
          onClick={() => setStatusFilter("all")}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-slate-800 dark:text-white">
                {stats.total}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Totalt
              </p>
            </div>
            <FiCalendar className="w-8 h-8 text-slate-400" />
          </div>
        </div>
        <div
          className="bg-yellow-50 dark:bg-yellow-950/30 rounded-xl p-3 shadow-lg cursor-pointer hover:bg-yellow-100 dark:hover:bg-yellow-950/50 transition"
          onClick={() => setStatusFilter("pending")}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                {stats.pending}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Väntande
              </p>
            </div>
            <FiPending className="w-8 h-8 text-yellow-500" />
          </div>
        </div>
        <div
          className="bg-green-50 dark:bg-green-950/30 rounded-xl p-3 shadow-lg cursor-pointer hover:bg-green-100 dark:hover:bg-green-950/50 transition"
          onClick={() => setStatusFilter("confirmed")}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                {stats.confirmed}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Bekräftade
              </p>
            </div>
            <FiCheckCircle className="w-8 h-8 text-green-500" />
          </div>
        </div>
        <div
          className="bg-blue-50 dark:bg-blue-950/30 rounded-xl p-3 shadow-lg cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-950/50 transition"
          onClick={() => setStatusFilter("completed")}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {stats.completed}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Genomförda
              </p>
            </div>
            <FiThumbsUp className="w-8 h-8 text-blue-500" />
          </div>
        </div>
        <div
          className="bg-red-50 dark:bg-red-950/30 rounded-xl p-3 shadow-lg cursor-pointer hover:bg-red-100 dark:hover:bg-red-950/50 transition"
          onClick={() => setStatusFilter("cancelled")}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                {stats.cancelled}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Avbokade
              </p>
            </div>
            <FiThumbsDown className="w-8 h-8 text-red-500" />
          </div>
        </div>
      </div>

      {/* Filter och sök */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-4">
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setStatusFilter("all")}
              className={`px-3 py-1.5 rounded-lg text-sm transition ${statusFilter === "all" ? "bg-blue-600 text-white" : "bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300"}`}
            >
              Alla ({stats.total})
            </button>
            <button
              onClick={() => setStatusFilter("pending")}
              className={`px-3 py-1.5 rounded-lg text-sm transition ${statusFilter === "pending" ? "bg-yellow-500 text-white" : "bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300"}`}
            >
              ⏳ Väntande ({stats.pending})
            </button>
            <button
              onClick={() => setStatusFilter("confirmed")}
              className={`px-3 py-1.5 rounded-lg text-sm transition ${statusFilter === "confirmed" ? "bg-green-500 text-white" : "bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300"}`}
            >
              ✅ Bekräftade ({stats.confirmed})
            </button>
            <button
              onClick={() => setStatusFilter("completed")}
              className={`px-3 py-1.5 rounded-lg text-sm transition ${statusFilter === "completed" ? "bg-blue-500 text-white" : "bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300"}`}
            >
              👍 Genomförda ({stats.completed})
            </button>
            <button
              onClick={() => setStatusFilter("cancelled")}
              className={`px-3 py-1.5 rounded-lg text-sm transition ${statusFilter === "cancelled" ? "bg-red-500 text-white" : "bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300"}`}
            >
              👎 Avbokade ({stats.cancelled})
            </button>
          </div>
          <input
            type="text"
            placeholder="Sök efter namn eller e-post..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full sm:w-64 px-3 py-1.5 border rounded-lg text-sm dark:bg-slate-700 dark:border-slate-600 dark:text-white dark:placeholder:text-slate-400"
          />
        </div>
      </div>

      {/* Meetings List - Balanserad layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Lista - Vänster */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden flex flex-col">
          <div className="p-4 border-b border-slate-200 dark:border-slate-700 bg-linear-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20">
            <h3 className="font-semibold text-slate-800 dark:text-white">
              Bokningar ({filteredMeetings.length})
            </h3>
          </div>
          <div className="flex-1 overflow-y-auto divide-y divide-slate-200 dark:divide-slate-700 max-h-125">
            {filteredMeetings.length === 0 ? (
              <div className="p-8 text-center text-slate-500 dark:text-slate-400">
                Inga bokningar att visa
              </div>
            ) : (
              filteredMeetings.map((meeting: Meeting) => (
                <div
                  key={meeting._id}
                  onClick={() => {
                    setSelectedMeeting(meeting);
                    setAdminNotes(meeting.adminNotes || "");
                  }}
                  className={`p-4 cursor-pointer transition-all hover:bg-slate-50 dark:hover:bg-slate-700 ${
                    selectedMeeting?._id === meeting._id
                      ? "bg-blue-50 dark:bg-blue-950/30 border-l-4 border-blue-500"
                      : ""
                  }`}
                >
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <span className="font-semibold text-slate-800 dark:text-white">
                        {meeting.name}
                      </span>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full flex items-center gap-1 ${getStatusColor(meeting.status)}`}
                      >
                        {getStatusIcon(meeting.status)}
                        {getStatusText(meeting.status)}
                      </span>
                    </div>
                    <p className="text-sm text-slate-500 dark:text-slate-400 truncate">
                      {meeting.email}
                    </p>
                    <div className="flex flex-wrap gap-3 text-xs text-slate-400 dark:text-slate-500">
                      <span className="flex items-center gap-1">
                        <FiCalendar className="w-3 h-3" />
                        {getDayName(meeting.date)} {formatDate(meeting.date)}
                      </span>
                      <span className="flex items-center gap-1">
                        <FiClock className="w-3 h-3" />
                        {meeting.time}
                      </span>
                      <span className="flex items-center gap-1">
                        {getMeetingTypeIcon(meeting.meetingType)}
                        {getMeetingTypeText(meeting.meetingType)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Detaljer - Höger (centrerad när ingen är vald) */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden flex flex-col min-h-125">
          {selectedMeeting ? (
            <div className="flex-1 overflow-y-auto p-5">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2 text-slate-800 dark:text-white">
                {getMeetingTypeIcon(selectedMeeting.meetingType)}
                Mötesdetaljer
              </h3>

              <div className="space-y-4">
                {/* Kundinformation */}
                <div className="bg-linear-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 rounded-lg p-4">
                  <h4 className="font-semibold mb-3 text-slate-700 dark:text-slate-300">
                    Kundinformation
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-slate-500 dark:text-slate-400">
                        Namn
                      </label>
                      <p className="font-medium flex items-center gap-1 mt-1 text-slate-700 dark:text-slate-300">
                        <FiUser className="w-3 h-3" />
                        {selectedMeeting.name}
                      </p>
                    </div>
                    <div>
                      <label className="text-xs text-slate-500 dark:text-slate-400">
                        E-post
                      </label>
                      <p className="font-medium flex items-center gap-1 mt-1 text-slate-700 dark:text-slate-300">
                        <FiMail className="w-3 h-3" />
                        {selectedMeeting.email}
                      </p>
                    </div>
                  </div>
                  {selectedMeeting.phone && (
                    <div className="mt-2">
                      <label className="text-xs text-slate-500 dark:text-slate-400">
                        Telefon
                      </label>
                      <p className="font-medium flex items-center gap-1 mt-1 text-slate-700 dark:text-slate-300">
                        <FiPhone className="w-3 h-3" />
                        {selectedMeeting.phone}
                      </p>
                    </div>
                  )}
                </div>

                {/* Mötesinformation */}
                <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-4">
                  <h4 className="font-semibold mb-3 text-slate-700 dark:text-slate-300">
                    Mötesinformation
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-slate-500 dark:text-slate-400">
                        Datum
                      </label>
                      <p className="font-medium flex items-center gap-1 mt-1 text-slate-700 dark:text-slate-300">
                        <FiCalendar className="w-3 h-3" />
                        {formatDate(selectedMeeting.date)}
                      </p>
                      <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                        {getDayName(selectedMeeting.date)}
                      </p>
                    </div>
                    <div>
                      <label className="text-xs text-slate-500 dark:text-slate-400">
                        Tid
                      </label>
                      <p className="font-medium flex items-center gap-1 mt-1 text-slate-700 dark:text-slate-300">
                        <FiClock className="w-3 h-3" />
                        {selectedMeeting.time}
                      </p>
                    </div>
                  </div>
                  <div className="mt-2">
                    <label className="text-xs text-slate-500 dark:text-slate-400">
                      Mötestyp
                    </label>
                    <p className="font-medium flex items-center gap-1 mt-1 text-slate-700 dark:text-slate-300">
                      {getMeetingTypeIcon(selectedMeeting.meetingType)}{" "}
                      {getMeetingTypeText(selectedMeeting.meetingType)}
                    </p>
                  </div>
                </div>

                {/* Meddelande */}
                {selectedMeeting.message && (
                  <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-4">
                    <label className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                      <FiMessageSquare className="w-3 h-3" /> Kundens meddelande
                    </label>
                    <p className="text-sm mt-1 text-slate-600 dark:text-slate-400">
                      {selectedMeeting.message}
                    </p>
                  </div>
                )}

                {/* Möteslänk */}
                {(selectedMeeting.status === "confirmed" ||
                  selectedMeeting.status === "completed") &&
                  selectedMeeting.meetingLink && (
                    <div className="bg-blue-50 dark:bg-blue-950/20 rounded-lg p-4">
                      <label className="text-xs text-blue-600 dark:text-blue-400">
                        Möteslänk
                      </label>
                      <a
                        href={selectedMeeting.meetingLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline text-sm flex items-center gap-1 mt-1 break-all"
                      >
                        <FiLink className="w-3 h-3 shrink-0" />
                        {selectedMeeting.meetingLink}
                      </a>
                    </div>
                  )}

                {/* Admin anteckningar */}
                <div className="border dark:border-slate-700 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                      <FiEdit2 className="w-3 h-3" /> Admin anteckningar
                    </label>
                    <button
                      onClick={() => setIsEditingNotes(!isEditingNotes)}
                      className="text-xs text-blue-500 hover:text-blue-600"
                    >
                      {isEditingNotes ? "Avbryt" : "Redigera"}
                    </button>
                  </div>
                  {isEditingNotes ? (
                    <div>
                      <textarea
                        value={adminNotes}
                        onChange={(e) => setAdminNotes(e.target.value)}
                        rows={3}
                        className="w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white dark:placeholder:text-slate-400"
                        placeholder="Lägg till anteckningar om mötet..."
                      />
                      <button
                        onClick={() => handleSaveNotes(selectedMeeting._id)}
                        className="mt-2 px-3 py-1 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600 flex items-center gap-1"
                      >
                        <FiSave className="w-3 h-3" /> Spara anteckning
                      </button>
                    </div>
                  ) : (
                    <p className="text-sm text-slate-600 dark:text-slate-400 whitespace-pre-wrap">
                      {selectedMeeting.adminNotes ||
                        "Inga anteckningar ännu..."}
                    </p>
                  )}
                </div>

                {/* Status åtgärder */}
                <div className="border-t dark:border-slate-700 pt-4 mt-4">
                  <label className="text-sm font-medium mb-3 block text-slate-700 dark:text-slate-300">
                    Ändra status
                  </label>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
                    <button
                      onClick={() => handleConfirmMeeting(selectedMeeting._id)}
                      disabled={selectedMeeting.status === "confirmed"}
                      className={`px-3 py-2 rounded-lg text-sm flex items-center justify-center gap-2 ${
                        selectedMeeting.status === "confirmed"
                          ? "bg-green-100 text-green-700 cursor-default opacity-50 dark:bg-green-950/50 dark:text-green-400"
                          : "bg-green-500 text-white hover:bg-green-600"
                      }`}
                    >
                      <FiCheckCircle className="w-4 h-4" />
                      Bekräfta möte
                    </button>

                    <button
                      onClick={() => handleCompleteMeeting(selectedMeeting._id)}
                      disabled={selectedMeeting.status === "completed"}
                      className={`px-3 py-2 rounded-lg text-sm flex items-center justify-center gap-2 ${
                        selectedMeeting.status === "completed"
                          ? "bg-blue-100 text-blue-700 cursor-default opacity-50 dark:bg-blue-950/50 dark:text-blue-400"
                          : "bg-blue-500 text-white hover:bg-blue-600"
                      }`}
                    >
                      <FiThumbsUp className="w-4 h-4" />
                      Markera som genomfört
                    </button>

                    <button
                      onClick={() => handleCancelMeeting(selectedMeeting._id)}
                      disabled={selectedMeeting.status === "cancelled"}
                      className={`sm:col-span-2 px-3 py-2 rounded-lg text-sm flex items-center justify-center gap-2 ${
                        selectedMeeting.status === "cancelled"
                          ? "bg-red-100 text-red-700 cursor-default opacity-50 dark:bg-red-950/50 dark:text-red-400"
                          : "bg-red-500 text-white hover:bg-red-600"
                      }`}
                    >
                      <FiThumbsDown className="w-4 h-4" />
                      Avboka möte
                    </button>
                  </div>

                  {/* Möteslänk */}
                  {selectedMeeting.status === "pending" && (
                    <div className="mt-3 p-3 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg">
                      <label className="text-xs text-yellow-600 dark:text-yellow-400">
                        Lägg till möteslänk (valfritt vid bekräftelse)
                      </label>
                      <div className="flex flex-col sm:flex-row gap-2 mt-1">
                        <input
                          type="url"
                          placeholder="https://meet.google.com/..."
                          value={meetingLink}
                          onChange={(e) => setMeetingLink(e.target.value)}
                          className="flex-1 px-3 py-1.5 text-sm border rounded-lg dark:bg-slate-700 dark:border-slate-600 dark:text-white dark:placeholder:text-slate-400"
                        />
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        Du kan lägga till länken nu eller senare efter
                        bekräftelse.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center text-slate-500 dark:text-slate-400">
              <div className="text-center p-8">
                <FiCalendar className="w-16 h-16 mx-auto mb-4 opacity-30" />
                <p className="font-medium">Välj en bokning från listan</p>
                <p className="text-sm mt-1">För att hantera detaljer</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
