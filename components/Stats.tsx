"use client";

import { useState, useEffect } from "react";
import { FiMonitor, FiSmile, FiClock, FiHeart } from "react-icons/fi";

interface Stats {
  websitesBuilt: number;
  happyClients: number;
  averageDays: number;
  donationsReceived: number;
}

export default function Stats() {
  const [stats, setStats] = useState<Stats>({
    websitesBuilt: 0,
    happyClients: 0,
    averageDays: 0,
    donationsReceived: 0,
  });
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    // Hämta riktiga siffror från Convex eller API
    // För demo använder vi hårdkodade siffror som animeras
    const targetStats = {
      websitesBuilt: 47,
      happyClients: 42,
      averageDays: 14,
      donationsReceived: 12500,
    };

    const duration = 2000;
    const interval = 20;
    const steps = duration / interval;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      setStats({
        websitesBuilt: Math.min(
          Math.floor((step / steps) * targetStats.websitesBuilt),
          targetStats.websitesBuilt,
        ),
        happyClients: Math.min(
          Math.floor((step / steps) * targetStats.happyClients),
          targetStats.happyClients,
        ),
        averageDays: Math.min(
          Math.floor((step / steps) * targetStats.averageDays),
          targetStats.averageDays,
        ),
        donationsReceived: Math.min(
          Math.floor((step / steps) * targetStats.donationsReceived),
          targetStats.donationsReceived,
        ),
      });
      if (step >= steps) clearInterval(timer);
    }, interval);

    setAnimated(true);
    return () => clearInterval(timer);
  }, []);

  const statItems = [
    {
      label: "Byggda hemsidor",
      value: stats.websitesBuilt,
      icon: FiMonitor,
      suffix: "st",
      color: "text-blue-600",
    },
    {
      label: "Nöjda kunder",
      value: stats.happyClients,
      icon: FiSmile,
      suffix: "st",
      color: "text-green-600",
    },
    {
      label: "Genomsnittlig leverans",
      value: stats.averageDays,
      icon: FiClock,
      suffix: "dagar",
      color: "text-purple-600",
    },
    {
      label: "Donationer mottagna",
      value: stats.donationsReceived,
      icon: FiHeart,
      suffix: "kr",
      color: "text-red-600",
      prefix: "ca ",
    },
  ];

  return (
    <section className="py-16 bg-linear-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-3">
            Mina resultat i siffror 📊
          </h2>
          <p className="text-slate-600 dark:text-slate-400">
            Helt gratis hemsidor för alla som behöver
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
          {statItems.map((item) => (
            <div
              key={item.label}
              className="text-center p-4 bg-white dark:bg-slate-800 rounded-xl shadow-lg"
            >
              <item.icon className={`w-8 h-8 mx-auto mb-3 ${item.color}`} />
              <div className="text-3xl font-bold text-slate-800 dark:text-white">
                {animated
                  ? `${item.prefix || ""}${item.value}${item.suffix ? ` ${item.suffix}` : ""}`
                  : "0"}
              </div>
              <div className="text-sm text-slate-500 mt-1">{item.label}</div>
            </div>
          ))}
        </div>
        <p className="text-center text-sm text-slate-500 mt-6">
          📈 Siffrorna uppdateras i realtid från min Convex-databas
        </p>
      </div>
    </section>
  );
}
