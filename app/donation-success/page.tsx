"use client";

import { useEffect, useState } from "react";
import { FiCheck, FiHeart } from "react-icons/fi";
import Link from "next/link";

export default function DonationSuccessPage() {
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          window.location.href = "/";
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="container mx-auto px-4 py-32 max-w-2xl text-center">
      <div className="bg-green-100 dark:bg-green-900/30 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
        <FiCheck className="w-10 h-10 text-green-600" />
      </div>
      <h1 className="text-3xl font-bold mb-4">Tack för din donation! 🎉</h1>
      <div className="flex items-center justify-center gap-2 text-red-500 mb-6">
        <FiHeart className="w-6 h-6 fill-current" />
        <span className="text-lg">Ditt stöd gör skillnad!</span>
        <FiHeart className="w-6 h-6 fill-current" />
      </div>
      <p className="text-slate-600 dark:text-slate-400 mb-6">
        Tack vare din donation kan jag fortsätta bygga gratis hemsidor för
        människor som behöver det.
      </p>
      <p className="text-sm text-slate-500 mb-8">
        Du omdirigeras till startsidan om {countdown} sekunder...
      </p>
      <Link
        href="/"
        className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        Gå till startsidan
      </Link>
    </div>
  );
}
