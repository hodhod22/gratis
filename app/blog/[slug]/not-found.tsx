import Link from "next/link";
import { FiHome } from "react-icons/fi";

export default function BlogNotFound() {
  return (
    <div className="container mx-auto px-4 py-32 text-center">
      <h1 className="text-4xl font-bold mb-4">404</h1>
      <h2 className="text-2xl font-semibold mb-4">Blogginlägg ej hittat</h2>
      <p className="text-slate-600 dark:text-slate-400 mb-8">
        Det blogginlägg du letar efter finns inte.
      </p>
      <Link
        href="/blog"
        className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        <FiHome />
        Tillbaka till bloggen
      </Link>
    </div>
  );
}
