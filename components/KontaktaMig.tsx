// app/components/KontaktaMig.tsx
"use client";

import { useState } from "react";

export default function KontaktaMig() {
  const [kopierat, setKopierat] = useState(false);
  const email = "ezadkhahaali@gmail.com";

  const kopieraEmail = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setKopierat(true);
      setTimeout(() => setKopierat(false), 3000); // Försvinner efter 3 sekunder
    } catch (err) {
      console.error("Kopiering misslyckades:", err);
      setKopierat(false);
    }
  };

  return (
    <div className="inline-block">
      <button
        onClick={kopieraEmail}
        className="text-cyan-500 hover:text-blue-300 dark:text-white cursor-pointer bg-transparent border-none p-0"
      >
        Kontakta mig
      </button>

      {kopierat && (
        <span className="text-green-600 ml-2 text-sm">
          E-postadressen har kopierats!
        </span>
      )}
    </div>
  );
}
