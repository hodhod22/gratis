"use client";

import { useState, useEffect } from "react";
import { SignInButton, UserButton, useUser } from "@clerk/nextjs";
import Link from "next/link";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import {
  FiMenu,
  FiX,
  FiSun,
  FiMoon,
  FiCode,
  FiHome,
  FiUser,
  FiLayers,
  FiFolder,
  FiHeart,
  FiBell,
} from "react-icons/fi";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { isSignedIn, user } = useUser();

  const ADMIN_EMAIL =
    process.env.NEXT_PUBLIC_ADMIN_EMAIL || "ezadkhahaali@gmail.com";
  const userEmail = user?.primaryEmailAddress?.emailAddress;
  const isAdmin = userEmail === ADMIN_EMAIL;

  const unreadCount =
    useQuery(api.admin.getUnreadCount, isAdmin ? {} : "skip") ?? 0;

  useEffect(() => {
    setMounted(true);
    const isDarkMode =
      localStorage.getItem("theme") === "dark" ||
      (!("theme" in localStorage) &&
        window.matchMedia("(prefers-color-scheme: dark)").matches);
    setIsDark(isDarkMode);
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleTheme = () => {
    const newDark = !isDark;
    setIsDark(newDark);
    if (newDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  const navItems = [
    { name: "Hem", href: "/", icon: FiHome },
    { name: "Projekt", href: "/projects", icon: FiFolder },
    { name: "Blogg", href: "/blog", icon: FiLayers },
    { name: "Gratis hemsida", href: "/request", icon: FiHeart },
    { name: "Om mig", href: "/about", icon: FiUser }, // ← TILLBAKA!
  ];

  const logoCss =
    "flex items-center gap-2 text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent";

  if (!mounted) {
    return (
      <header className="sticky top-0 z-50 backdrop-blur-md bg-white/80 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-700">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className={logoCss}>
              <FiCode className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              <span>FreeWebDev</span>
            </Link>
            <div className="hidden md:flex items-center gap-8">
              {navItems.map((_, i) => (
                <div key={i} className="w-20 h-4" />
              ))}
              <div className="w-8 h-4" />
              <div className="w-16 h-4" />
            </div>
            <div className="w-8 h-8" />
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-white/80 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-700">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className={logoCss}>
            <FiCode className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            <span>FreeWebDev</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="flex items-center gap-2 text-slate-600 dark:text-slate-300 hover:text-blue-600 transition-colors"
              >
                <item.icon className="w-4 h-4" />
                <span>{item.name}</span>
              </Link>
            ))}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
            >
              {isDark ? (
                <FiSun className="w-5 h-5" />
              ) : (
                <FiMoon className="w-5 h-5" />
              )}
            </button>
            {isSignedIn && isAdmin && (
              <Link href="/admin" className="relative">
                <button className="p-2 rounded-lg hover:bg-slate-100 transition-colors relative">
                  <FiBell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center animate-pulse">
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                  )}
                </button>
              </Link>
            )}
            {isSignedIn ? (
              <UserButton />
            ) : (
              <SignInButton mode="modal">
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  Logga in
                </button>
              </SignInButton>
            )}
          </div>

          <div className="md:hidden flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-slate-100"
            >
              {isDark ? (
                <FiSun className="w-5 h-5" />
              ) : (
                <FiMoon className="w-5 h-5" />
              )}
            </button>
            {isSignedIn && isAdmin && (
              <Link href="/admin" className="relative">
                <button className="p-2 rounded-lg hover:bg-slate-100 relative">
                  <FiBell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                  )}
                </button>
              </Link>
            )}
            <button onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? (
                <FiX className="w-6 h-6" />
              ) : (
                <FiMenu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {isOpen && (
          <div className="md:hidden py-4 border-t border-slate-200">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-slate-50 rounded-lg"
              >
                <item.icon className="w-5 h-5" />
                <span>{item.name}</span>
              </Link>
            ))}
            {isSignedIn && isAdmin && (
              <Link
                href="/admin"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-slate-50 rounded-lg"
              >
                <FiBell className="w-5 h-5" />
                <span>
                  Admin Panel {unreadCount > 0 && `(${unreadCount} nya)`}
                </span>
              </Link>
            )}
            <div className="px-4 pt-3">
              {isSignedIn ? (
                <UserButton />
              ) : (
                <SignInButton mode="modal">
                  <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                    Logga in
                  </button>
                </SignInButton>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
