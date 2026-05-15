"use client";

import {
  SiNextdotjs,
  SiTypescript,
  SiTailwindcss,
  SiReact,
  SiNodedotjs,
} from "react-icons/si";
import { FaServer, FaDatabase } from "react-icons/fa";

// Använd en annan ikon istället för Convex
import { BsLightningCharge } from "react-icons/bs"; // ← alternativ ikon

const technologies = [
  {
    name: "Next.js 15",
    icon: SiNextdotjs,
    color: "text-black dark:text-white",
  },
  { name: "TypeScript", icon: SiTypescript, color: "text-blue-600" },
  { name: "Tailwind CSS", icon: SiTailwindcss, color: "text-cyan-500" },
  { name: "React", icon: SiReact, color: "text-blue-400" },
  { name: "Node.js", icon: SiNodedotjs, color: "text-green-600" },
  { name: "TanStack Query", icon: FaServer, color: "text-orange-500" },
  { name: "Convex", icon: BsLightningCharge, color: "text-emerald-500" }, // ← Byt till BsLightningCharge
  { name: "PostgreSQL", icon: FaDatabase, color: "text-sky-500" },
];

export default function TechStack() {
  return (
    <section className="py-20 bg-white dark:bg-slate-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Min Teknologi Stack
          </h2>
          <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Moderna verktyg för att bygga snabba och skalbara applikationer
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
          {technologies.map((tech) => (
            <div
              key={tech.name}
              className="flex flex-col items-center p-6 rounded-xl bg-slate-50 dark:bg-slate-800 hover:scale-105 transition-transform"
            >
              <tech.icon className={`w-12 h-12 mb-3 ${tech.color}`} />
              <span className="text-sm font-medium text-center">
                {tech.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
