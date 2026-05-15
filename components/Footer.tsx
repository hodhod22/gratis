import { FiHeart } from "react-icons/fi";

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 dark:border-slate-700 py-6">
      <div className="container mx-auto px-4 text-center text-slate-600 dark:text-slate-400 text-sm">
        <p className="flex items-center justify-center gap-1">
          Byggt med Next.js, TypeScript & Convex
        </p>
        <p className="mt-2 flex items-center justify-center gap-1">
          © {new Date().getFullYear()} Din Portfolio | Gjort med{" "}
          <FiHeart className="text-red-500 w-3 h-3" /> för modern webbutveckling
        </p>
      </div>
    </footer>
  );
}
