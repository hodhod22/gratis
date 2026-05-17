"use client";

import { useEffect, useState } from "react";
import { FiBell } from "react-icons/fi";
import {
  canUseDesktopNotifications,
  getNotificationPermission,
  preloadNotificationSound,
  requestNotificationPermission,
} from "@/lib/notifications";

type Props = {
  className?: string;
};

export default function NotificationEnableBanner({ className = "" }: Props) {
  const [permission, setPermission] = useState<
    NotificationPermission | "unsupported" | "loading"
  >("loading");
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    setPermission(getNotificationPermission());
  }, []);

  if (
    permission === "loading" ||
    permission === "unsupported" ||
    permission === "granted" ||
    permission === "denied" ||
    dismissed
  ) {
    return null;
  }

  return (
    <div
      className={`flex flex-wrap items-center justify-between gap-2 rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-sm text-blue-900 dark:border-blue-800 dark:bg-blue-950/40 dark:text-blue-100 ${className}`}
    >
      <span className="flex items-center gap-2">
        <FiBell className="w-4 h-4 shrink-0" />
        Aktivera desktop-notiser för nya chattmeddelanden
      </span>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={async () => {
            preloadNotificationSound();
            if (!canUseDesktopNotifications()) return;
            await requestNotificationPermission();
            setPermission(getNotificationPermission());
          }}
          className="rounded-md bg-blue-600 px-3 py-1 text-xs font-medium text-white hover:bg-blue-700"
        >
          Tillåt
        </button>
        <button
          type="button"
          onClick={() => setDismissed(true)}
          className="rounded-md px-2 py-1 text-xs text-blue-700 hover:bg-blue-100 dark:text-blue-200 dark:hover:bg-blue-900/50"
        >
          Senare
        </button>
      </div>
    </div>
  );
}
