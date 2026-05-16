"use client";

import { useState, useEffect } from "react";
import { FiClock, FiInfo } from "react-icons/fi";

export default function WaitingTime() {
  const [waitingDays, setWaitingDays] = useState(0);
  const [requestsInQueue, setRequestsInQueue] = useState(0);

  useEffect(() => {
    // Hämta från Convex (exempelvärden)
    const fetchQueueInfo = async () => {
      // Här skulle du hämta från din Convex-databas
      setRequestsInQueue(12);
      setWaitingDays(21);
    };
    fetchQueueInfo();
  }, []);

  return (
    <div className="bg-amber-50 dark:bg-amber-950/30 rounded-xl p-4 border border-amber-200 dark:border-amber-800">
      <div className="flex items-center gap-3 flex-wrap justify-between">
        <div className="flex items-center gap-2">
          <FiClock className="w-5 h-5 text-amber-600" />
          <span className="font-medium">Aktuell väntetid:</span>
          <span className="font-bold text-amber-700 dark:text-amber-400">
            ca {waitingDays} dagar
          </span>
          <span className="text-sm text-slate-500">
            ({requestsInQueue} förfrågningar i kön)
          </span>
        </div>
        <div className="flex items-center gap-1 text-xs text-slate-500">
          <FiInfo className="w-3 h-3" />
          <span>Jag jobbar i den ordning förfrågningarna kommer in</span>
        </div>
      </div>
    </div>
  );
}
