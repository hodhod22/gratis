"use client";

import { useState } from "react";
import { FiDownload, FiCheck } from "react-icons/fi";

export default function CVButton() {
  const [isDownloading, setIsDownloading] = useState(false);
  const [isDownloaded, setIsDownloaded] = useState(false);

  const handleDownload = async () => {
    setIsDownloading(true);

    try {
      // Hämta CV-filen från public mappen
      const response = await fetch("/cv.pdf");

      if (!response.ok) {
        throw new Error("CV file not found");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "Ali_CV.pdf"; // Namnet som filen får vid nedladdning
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      setIsDownloaded(true);
      setTimeout(() => setIsDownloaded(false), 3000);
    } catch (error) {
      console.error("Download failed:", error);
      alert("Kunde inte ladda ner CV. Kontakta mig direkt istället.");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <button
      onClick={handleDownload}
      disabled={isDownloading}
      className="inline-flex items-center gap-2 px-6 py-3 bg-linear-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all hover:scale-105 disabled:opacity-70"
    >
      {isDownloading ? (
        <>
          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          Laddar ner...
        </>
      ) : isDownloaded ? (
        <>
          <FiCheck className="w-5 h-5" />
          Nedladdad!
        </>
      ) : (
        <>
          <FiDownload className="w-5 h-5" />
          Ladda ner CV
        </>
      )}
    </button>
  );
}
