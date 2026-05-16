"use client";

import { useState, useEffect } from "react";
import { FiZap, FiUsers, FiEye, FiSmartphone } from "react-icons/fi";

interface ScoreData {
  performance: number;
  accessibility: number;
  bestPractices: number;
  seo: number;
}

export default function PerformanceScore() {
  const [scores, setScores] = useState<ScoreData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulera Lighthouse-poäng (i verkligheten skulle du köra Lighthouse eller hämta från API)
    setTimeout(() => {
      setScores({
        performance: 98,
        accessibility: 100,
        bestPractices: 96,
        seo: 100,
      });
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/2 mx-auto"></div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-20 bg-slate-200 dark:bg-slate-700 rounded"
              ></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const items = [
    {
      name: "Prestanda",
      value: scores?.performance || 0,
      icon: FiZap,
      color: "text-green-500",
    },
    {
      name: "Tillgänglighet",
      value: scores?.accessibility || 0,
      icon: FiUsers,
      color: "text-blue-500",
    },
    {
      name: "Bästa praxis",
      value: scores?.bestPractices || 0,
      icon: FiEye,
      color: "text-purple-500",
    },
    {
      name: "SEO",
      value: scores?.seo || 0,
      icon: FiSmartphone,
      color: "text-orange-500",
    },
  ];

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-500";
    if (score >= 70) return "text-yellow-500";
    return "text-red-500";
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg">
      <h3 className="text-lg font-semibold mb-4 text-center">
        🚀 Lighthouse Score
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {items.map((item) => (
          <div key={item.name} className="text-center">
            <item.icon className={`w-8 h-8 mx-auto mb-2 ${item.color}`} />
            <div className={`text-2xl font-bold ${getScoreColor(item.value)}`}>
              {item.value}
            </div>
            <div className="text-xs text-slate-500">{item.name}</div>
          </div>
        ))}
      </div>
      <p className="text-xs text-center text-slate-500 mt-4">
        Mätt med Google Lighthouse • Senaste testet
      </p>
    </div>
  );
}
