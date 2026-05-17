import {
  FiCode,
  FiUsers,
  FiHeart,
  FiAward,
  FiGithub,
  FiLinkedin,
  FiMail,
} from "react-icons/fi";
import Link from "next/link";

export const metadata = {
  title: "Om mig | Min Portfolio",
  description:
    "Frontend-utvecklare med passion för Next.js, TypeScript och modern webbutveckling",
};

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 max-w-4xl">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Om mig
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-400">
          Frontend-utvecklare med passion för moderna webbteknologier
        </p>
      </div>

      <div className="space-y-12">
        {/* Bio */}
        <section>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <FiCode className="text-blue-600" />
            Vem är jag?
          </h2>
          <div className="prose dark:prose-invert max-w-none">
            <p>
              Jag är en passionerad frontend-utvecklare med fokus på att bygga
              moderna, snabba och användarvänliga webbapplikationer. Med starka
              kunskaper i Next.js, TypeScript och modern webbutveckling skapar
              jag lösningar som inte bara ser bra ut utan också presterar i
              toppklass.
            </p>
            <p className="mt-4">
              Jag brinner för att lära mig nya teknologier och dela mina
              kunskaper med andra. Mitt mål är att bygga produkter som gör
              skillnad och skapar värde för användarna.
            </p>
          </div>
        </section>

        {/* Values */}
        <section>
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <FiHeart className="text-red-500" />
            Mina värderingar
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-6 bg-slate-50 dark:bg-slate-800 rounded-xl">
              <FiCode className="w-8 h-8 text-blue-600 mb-3" />
              <h3 className="font-semibold mb-2">Kvalitet</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Jag skriver ren, underhållbar och testbar kod med TypeScript.
              </p>
            </div>
            <div className="p-6 bg-slate-50 dark:bg-slate-800 rounded-xl">
              <FiUsers className="w-8 h-8 text-green-600 mb-3" />
              <h3 className="font-semibold mb-2">Användarfokus</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Användarupplevelsen är alltid i centrum för mina lösningar.
              </p>
            </div>
            <div className="p-6 bg-slate-50 dark:bg-slate-800 rounded-xl">
              <FiAward className="w-8 h-8 text-yellow-600 mb-3" />
              <h3 className="font-semibold mb-2">Lärande</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Jag håller mig alltid uppdaterad med de senaste teknologierna.
              </p>
            </div>
          </div>
        </section>

        {/* Tech Stack */}
        <section>
          <h2 className="text-2xl font-bold mb-4">
            Teknologier jag arbetar med
          </h2>
          <div className="flex flex-wrap gap-2">
            {[
              "Next.js",
              "React",
              "TypeScript",
              "Tailwind CSS",
              "Node.js",
              "Convex",
              "Prisma",
              "PostgreSQL",
              "Git",
              "Figma",
              "MongoDb",
              "TanStack Start",
              "SQL",
              "three.js",
              "Python",
              "C#",
              "React-Native"
            ].map((tech) => (
              <span
                key={tech}
                className="px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-full text-sm"
              >
                {tech}
              </span>
            ))}
          </div>
        </section>

        {/* Contact Links */}
        <section className="pt-8 border-t border-slate-200 dark:border-slate-700">
          <h2 className="text-2xl font-bold mb-4">Kontakta mig</h2>
          <div className="flex gap-4 justify-center md:justify-start">
            <a
              href="https://github.com/hodhod22"
              target="_blank"
              className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              <FiGithub className="w-5 h-5" />
              GitHub
            </a>
            <a
              href="https://www.linkedin.com/in/ali-utvecklare-966349404"
              target="_blank"
              className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              <FiLinkedin className="w-5 h-5" />
              LinkedIn
            </a>
           
          </div>
        </section>
      </div>
    </div>
  );
}
