"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { FiClock, FiInfo } from "react-icons/fi";

export default function WaitingTime() {
  const stats = useQuery(api.stats.getQueueStats);

  const waitingDays = stats?.waitingDays ?? null;
  const queueLength = stats?.queueLength ?? null;

  return (
    <div className="bg-amber-50 dark:bg-amber-950/30 rounded-xl p-4 border border-amber-200 dark:border-amber-800">
      <div className="flex items-center gap-3 flex-wrap justify-between">
        <div className="flex items-center gap-2">
          <FiClock className="w-5 h-5 text-amber-600" />
          <span className="font-medium">Aktuell väntetid:</span>
          {stats === undefined ? (
            <span className="text-slate-500 text-sm">Beräknar...</span>
          ) : (
            <>
              <span className="font-bold text-amber-700 dark:text-amber-400">
                ca {waitingDays} dagar
              </span>
              <span className="text-sm text-slate-500">
                ({queueLength} förfrågningar i kön)
              </span>
            </>
          )}
        </div>
        <div className="flex items-center gap-1 text-xs text-slate-500">
          <FiInfo className="w-3 h-3" />
          <span>Jag jobbar i den ordning förfrågningarna kommer in</span>
        </div>
      </div>
    </div>
  );
}
