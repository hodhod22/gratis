// app/components/MeetingWidget.tsx - Enkel widget för att visa "Boka möte" knapp
"use client";

import Link from "next/link";
import { FiCalendar } from "react-icons/fi";

export default function MeetingWidget() {
  return (
    <Link
      href="/book-meeting"
      className="fixed bottom-6 right-6 bg-linear-to-r from-blue-600 to-purple-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all group z-50"
    >
      <div className="flex items-center gap-2">
        <FiCalendar className="w-6 h-6 group-hover:scale-110 transition" />
        <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 whitespace-nowrap">
          Boka möte
        </span>
      </div>
    </Link>
  );
}
