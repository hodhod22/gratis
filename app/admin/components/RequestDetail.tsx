// app/admin/components/RequestDetail.tsx
"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import {
  FiAtSign,
  FiCalendar,
  FiFlag,
  FiMail,
  FiX,
  FiTrash2,
  FiHeart,
  FiSave,
  FiEdit2,
} from "react-icons/fi";
import ProgressBar from "./ProgressBar";
import { getStatusColor, getPriorityColor, formatDate } from "../utils/helpers";

interface RequestDetailProps {
  requestId: string | null;
  onUpdateStatus: (id: Id<"requests">, status: string) => Promise<void>;
  onUpdatePriority: (id: Id<"requests">, priority: number) => Promise<void>;
  onDelete: (id: Id<"requests">) => Promise<void>;
}

export default function RequestDetail({
  requestId,
  onUpdateStatus,
  onUpdatePriority,
  onDelete,
}: RequestDetailProps) {
  const [adminNotes, setAdminNotes] = useState("");
  const [completedUrl, setCompletedUrl] = useState("");
  const [isEditingNotes, setIsEditingNotes] = useState(false);

  const request = useQuery(
    api.admin.getRequestById,
    requestId ? { id: requestId as Id<"requests"> } : "skip",
  );

  const updateRequestStatus = useMutation(api.admin.updateRequestStatus);

  useEffect(() => {
    if (request) {
      setAdminNotes(request.adminNotes || "");
      setCompletedUrl(request.completedUrl || "");
    }
  }, [request]);

  const handleSaveNotes = async () => {
    if (request && adminNotes !== request.adminNotes) {
      await updateRequestStatus({
        id: request._id as Id<"requests">,
        status: request.status,
        adminNotes: adminNotes,
      });
    }
    setIsEditingNotes(false);
  };

  const handleSaveUrl = async () => {
    if (request && completedUrl !== request.completedUrl) {
      await updateRequestStatus({
        id: request._id as Id<"requests">,
        status: request.status,
        completedUrl: completedUrl,
      });
    }
  };

  const getBudgetText = (budget: string) => {
    switch (budget) {
      case "gratis":
        return "🆓 Helt gratis";
      case "donation":
        return "💝 Kan donera frivilligt";
      default:
        return "📋 Ingen budget just nu";
    }
  };

  if (!requestId) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden flex flex-col min-h-125">
        <div className="flex-1 flex items-center justify-center text-slate-500 dark:text-slate-400">
          <div className="text-center p-8">
            <FiHeart className="w-16 h-16 mx-auto mb-4 opacity-30" />
            <p className="font-medium">Välj en förfrågan från listan</p>
            <p className="text-sm mt-1">För att hantera detaljer och status</p>
          </div>
        </div>
      </div>
    );
  }

  if (!request) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden flex flex-col min-h-125">
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden flex flex-col min-h-125">
      {/* Header */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-700 bg-linear-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="font-semibold text-lg flex items-center gap-2 text-slate-800 dark:text-white">
              {request.name}
              <span
                className={`text-xs px-2 py-0.5 rounded-full ${getStatusColor(request.status)}`}
              >
                {request.status === "pending"
                  ? "⏳ Väntar"
                  : request.status === "in-progress"
                    ? "⚙️ Pågår"
                    : request.status === "completed"
                      ? "✅ Klar"
                      : "❌ Avböjd"}
              </span>
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-1">
              <FiAtSign className="w-3 h-3" />
              {request.email}
            </p>
          </div>
          <div className="flex gap-2">
            <a
              href={`mailto:${request.email}`}
              className="p-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950/30 rounded-lg transition"
            >
              <FiMail className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4">
        {/* Projektinfo */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-3">
            <label className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Typ av hemsida
            </label>
            <p className="font-medium mt-1 text-slate-700 dark:text-slate-300">
              {request.websiteType}
            </p>
          </div>
          <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-3">
            <label className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Budget
            </label>
            <p className="font-medium mt-1 text-slate-700 dark:text-slate-300">
              {getBudgetText(request.budget)}
            </p>
          </div>
        </div>

        {/* Beskrivning */}
        <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-3">
          <label className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Beskrivning
          </label>
          <p className="text-sm mt-1 leading-relaxed text-slate-600 dark:text-slate-300">
            {request.description}
          </p>
        </div>

        {/* Krav */}
        {request.requirements && (
          <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-3">
            <label className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Specifika krav
            </label>
            <p className="text-sm mt-1 text-slate-600 dark:text-slate-300">
              {request.requirements}
            </p>
          </div>
        )}

        {/* Deadline */}
        {request.deadline && (
          <div className="flex items-center gap-2 bg-orange-50 dark:bg-orange-950/20 p-3 rounded-lg">
            <FiCalendar className="w-5 h-5 text-orange-500" />
            <div>
              <label className="text-xs text-orange-600 dark:text-orange-400 uppercase tracking-wider">
                Deadline
              </label>
              <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                {request.deadline}
              </p>
            </div>
          </div>
        )}

        {/* Progress Bar */}
        {request.status === "in-progress" && (
          <ProgressBar startDate={request.updatedAt} status={request.status} />
        )}

        {/* Admin Notes */}
        <div className="border dark:border-slate-700 rounded-lg p-3">
          <div className="flex justify-between items-center mb-2">
            <label className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1">
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
                placeholder="Lägg till interna anteckningar..."
              />
              <button
                onClick={handleSaveNotes}
                className="mt-2 px-3 py-1 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600 flex items-center gap-1"
              >
                <FiSave className="w-3 h-3" /> Spara anteckning
              </button>
            </div>
          ) : (
            <p className="text-sm text-slate-600 dark:text-slate-400 whitespace-pre-wrap">
              {request.adminNotes || "Inga anteckningar ännu..."}
            </p>
          )}
        </div>

        {/* Completed URL */}
        {request.status === "completed" && (
          <div className="bg-green-50 dark:bg-green-950/20 rounded-lg p-3">
            <label className="text-xs text-green-600 dark:text-green-400 uppercase tracking-wider">
              Länk till färdig hemsida
            </label>
            <div className="flex gap-2 mt-1">
              <input
                type="url"
                value={completedUrl}
                onChange={(e) => setCompletedUrl(e.target.value)}
                onBlur={handleSaveUrl}
                className="flex-1 px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white dark:placeholder:text-slate-400"
                placeholder="https://..."
              />
            </div>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="p-4 border-t border-slate-200 dark:border-slate-700 space-y-3">
        <div className="flex flex-col sm:flex-row gap-2">
          <select
            value={request.status}
            onChange={(e) =>
              onUpdateStatus(request._id as Id<"requests">, e.target.value)
            }
            className="flex-1 px-3 py-2 text-sm border rounded-lg dark:bg-slate-700 dark:border-slate-600 dark:text-white"
          >
            <option value="pending">📋 Väntar på beslut</option>
            <option value="in-progress">⚙️ Påbörjad</option>
            <option value="completed">✅ Färdigställd</option>
            <option value="rejected">❌ Avböjd</option>
          </select>

          <div className="flex items-center gap-1 px-3 py-2 bg-slate-100 dark:bg-slate-700 rounded-lg">
            <FiFlag
              className={`w-4 h-4 ${getPriorityColor(request.priority)}`}
            />
            <select
              value={request.priority}
              onChange={(e) =>
                onUpdatePriority(
                  request._id as Id<"requests">,
                  parseInt(e.target.value),
                )
              }
              className="bg-transparent text-sm focus:outline-none dark:text-white"
            >
              <option value="1">1 (Låg)</option>
              <option value="2">2</option>
              <option value="3">3 (Normal)</option>
              <option value="4">4</option>
              <option value="5">5 (Hög)</option>
            </select>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          {request.status !== "in-progress" &&
            request.status !== "completed" && (
              <button
                onClick={() =>
                  onUpdateStatus(request._id as Id<"requests">, "in-progress")
                }
                className="flex-1 px-3 py-2 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600 transition"
              >
                ⚙️ Starta projekt
              </button>
            )}
          {request.status !== "completed" && request.status !== "rejected" && (
            <button
              onClick={() => {
                if (confirm("Markera förfrågan som färdig?")) {
                  onUpdateStatus(request._id as Id<"requests">, "completed");
                }
              }}
              className="flex-1 px-3 py-2 bg-green-500 text-white rounded-lg text-sm hover:bg-green-600 transition"
            >
              ✅ Markera som klar
            </button>
          )}
          {request.status !== "rejected" && (
            <button
              onClick={() => {
                if (confirm("Avböj denna förfrågan?")) {
                  onUpdateStatus(request._id as Id<"requests">, "rejected");
                }
              }}
              className="flex-1 px-3 py-2 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600 transition"
            >
              ❌ Avböj
            </button>
          )}
        </div>

        <button
          onClick={() => {
            if (confirm("Radera denna förfrågan?")) {
              onDelete(request._id as Id<"requests">);
            }
          }}
          className="w-full px-3 py-2 text-sm border border-red-500 text-red-600 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors flex items-center justify-center gap-2"
        >
          <FiTrash2 className="w-4 h-4" />
          Radera förfrågan
        </button>
      </div>
    </div>
  );
}
