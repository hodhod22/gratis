"use client";

import { useState } from "react";
import { FiDownload, FiFileText, FiCheck } from "react-icons/fi";

export default function DownloadCVButton() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const generatePDF = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch("/api/generate-cv", {
        method: "POST",
      });
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "Cecilia_Wiklund_CV.pdf";
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      setIsComplete(true);
      setTimeout(() => setIsComplete(false), 3000);
    } catch (error) {
      console.error("Failed to generate PDF:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4 justify-center">
      <button
        onClick={generatePDF}
        disabled={isGenerating}
        className="px-6 py-3 bg-linear-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all flex items-center justify-center gap-2"
      >
        {isGenerating ? (
          <>
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Genererar CV...
          </>
        ) : isComplete ? (
          <>
            <FiCheck />
            Klar!
          </>
        ) : (
          <>
            <FiDownload />
            Ladda ner CV (PDF)
          </>
        )}
      </button>
      <button className="px-6 py-3 border border-slate-300 dark:border-slate-700 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center justify-center gap-2">
        <FiFileText />
        Visa CV online
      </button>
    </div>
  );
}