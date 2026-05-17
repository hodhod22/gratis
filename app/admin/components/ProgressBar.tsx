// app/admin/components/ProgressBar.tsx
"use client";

import { useState, useEffect } from "react";
import { FiClock, FiCalendar, FiAlertCircle } from "react-icons/fi";

interface ProgressBarProps {
  startDate: number;
  status: string;
  onProgressChange?: (progress: number) => void;
}

export default function ProgressBar({
  startDate,
  status,
  onProgressChange,
}: ProgressBarProps) {
  const [progress, setProgress] = useState(0);
  const [daysSinceStart, setDaysSinceStart] = useState(0);
  const [estimatedCompletion, setEstimatedCompletion] = useState<Date | null>(
    null,
  );
  const [isOverdue, setIsOverdue] = useState(false);

  useEffect(() => {
    if (status !== "in-progress") return;

    const calculateProgress = () => {
      const now = Date.now();
      const days = Math.floor((now - startDate) / (1000 * 60 * 60 * 24));
      setDaysSinceStart(days);

      const typicalDays = 14;
      let calculatedProgress = Math.min(
        95,
        Math.floor((days / typicalDays) * 100),
      );
      calculatedProgress = Math.max(5, Math.min(95, calculatedProgress));
      setProgress(calculatedProgress);
      onProgressChange?.(calculatedProgress);

      const remainingDays = Math.max(0, typicalDays - days);
      if (remainingDays > 0) {
        setEstimatedCompletion(
          new Date(now + remainingDays * 24 * 60 * 60 * 1000),
        );
      } else {
        setEstimatedCompletion(null);
      }
      setIsOverdue(days > typicalDays);
    };

    calculateProgress();
    const interval = setInterval(calculateProgress, 60000);

    return () => clearInterval(interval);
  }, [startDate, status, onProgressChange]);

  if (status !== "in-progress") return null;

  const getProgressColor = () => {
    if (isOverdue) return "bg-red-500";
    if (progress >= 75) return "bg-green-500";
    if (progress >= 50) return "bg-blue-500";
    return "bg-yellow-500";
  };

  return (
    <div className="mt-3">
      <div className="flex justify-between text-xs text-slate-500 mb-1">
        <span className="flex items-center gap-1">
          <FiClock className="w-3 h-3" />
          Dag {Math.min(daysSinceStart + 1, 14)}/14
        </span>
        <span
          className={`font-medium ${isOverdue ? "text-red-500" : "text-green-500"}`}
        >
          {progress}%
        </span>
      </div>

      <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
        <div
          className={`h-2 rounded-full transition-all duration-500 ${getProgressColor()}`}
          style={{ width: `${progress}%` }}
        />
      </div>

      {estimatedCompletion && !isOverdue && (
        <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
          <FiCalendar className="w-3 h-3" />
          Beräknat klar: {estimatedCompletion.toLocaleDateString("sv-SE")}
        </p>
      )}

      {isOverdue && (
        <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
          <FiAlertCircle className="w-3 h-3" />
          Försenad! Över 14 dagar.
        </p>
      )}
    </div>
  );
}

