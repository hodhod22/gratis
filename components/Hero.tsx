"use client";

import { useState, useEffect } from "react";
import {
  FiArrowRight,
  FiGithub,
  FiLinkedin,
  FiMail,
  FiDownload,
  FiCalendar,
  FiHeart,
} from "react-icons/fi";
import Link from "next/link";
import TypingAnimation from "./TypingAnimation";

export default function Hero() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section className="relative overflow-hidden min-h-screen flex items-center">
      {/* Animerad background gradient */}
      <div className="absolute inset-0 bg-linear-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 animate-pulse-gentle" />

      {/* Floating particles effekt */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
        <div className="text-center max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-linear-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-full text-sm mb-6 animate-slide-down">
            <FiHeart className="w-4 h-4" />
            Helt gratis - Alltid
          </div>

          {/* Main heading med typing animation */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6">
            <span className="block text-slate-800 dark:text-slate-200">
              Frontend-utvecklare
            </span>
            <span className="block bg-linear-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mt-2">
              <TypingAnimation
                words={[
                  "Next.js ✨",
                  "TypeScript 🔷",
                  "React ⚛️",
                  "Modern webb 🚀",
                  "Gratis hemsidor 💝",
                ]}
                typingSpeed={100}
                deletingSpeed={50}
                delayBetweenWords={1500}
              />
            </span>
          </h1>

          {/* Description */}
          <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 mb-8 max-w-2xl mx-auto leading-relaxed">
            Jag bygger moderna, snabba och responsiva webbapplikationer som
            löser verkliga problem.
            <span className="block text-blue-600 dark:text-blue-400 font-medium mt-2">
              💡 Helt gratis för dig som behöver!
            </span>
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link href="/projects">
              <button className="group w-full sm:w-auto px-8 py-4 bg-linear-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 hover:scale-105">
                <span>Se mina projekt</span>
                <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>
            <Link href="/request">
              <button className="group w-full sm:w-auto px-8 py-4 bg-linear-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 hover:scale-105">
                <FiHeart className="group-hover:scale-110 transition-transform" />
                <span>Begär gratis hemsida</span>
              </button>
            </Link>
            <Link href="#contact">
              <button className="w-full sm:w-auto px-8 py-4 border-2 border-slate-300 dark:border-slate-700 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-300 flex items-center justify-center gap-2 hover:scale-105">
                <FiMail />
                <span>Kontakta mig</span>
              </button>
            </Link>
          </div>

          {/* Quick action buttons */}
          <div className="flex flex-wrap gap-3 justify-center mb-12">
            <Link href="/donate">
              <button className="px-4 py-2 text-sm bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-600 dark:text-yellow-400 rounded-full transition-colors flex items-center gap-1">
                <FiHeart className="w-3 h-3" />
                Donera frivilligt
              </button>
            </Link>
            <Link href="/booking">
              <button className="px-4 py-2 text-sm bg-blue-500/10 hover:bg-blue-500/20 text-blue-600 dark:text-blue-400 rounded-full transition-colors flex items-center gap-1">
                <FiCalendar className="w-3 h-3" />
                Boka möte
              </button>
            </Link>
            <button className="px-4 py-2 text-sm bg-green-500/10 hover:bg-green-500/20 text-green-600 dark:text-green-400 rounded-full transition-colors flex items-center gap-1">
              <FiDownload className="w-3 h-3" />
              Ladda ner CV
            </button>
          </div>

          {/* Social Links med tooltip effekt */}
          <div className="flex justify-center gap-8">
            <a
              href="https://github.com/dittanvandarnamn"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-300 hover:scale-110"
            >
              <FiGithub className="w-7 h-7" />
              <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs bg-slate-800 text-white px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                GitHub
              </span>
            </a>
            <a
              href="https://linkedin.com/in/dittnamn"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-300 hover:scale-110"
            >
              <FiLinkedin className="w-7 h-7" />
              <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs bg-slate-800 text-white px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                LinkedIn
              </span>
            </a>
            <a
              href="mailto:din@email.se"
              className="group relative text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-300 hover:scale-110"
            >
              <FiMail className="w-7 h-7" />
              <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs bg-slate-800 text-white px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                Mail
              </span>
            </a>
          </div>

          {/* Scroll indicator */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce hidden md:block">
            <div className="w-6 h-10 border-2 border-slate-400 rounded-full flex justify-center">
              <div className="w-1 h-2 bg-slate-400 rounded-full mt-2 animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
