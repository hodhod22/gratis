import { FiStar } from "react-icons/fi";

const testimonials = [
  {
    name: "Sara K.",
    role: "Småföretagare",
    text: "Fick en snygg hemsida helt gratis. Snabb kommunikation och tydlig process från start till mål.",
  },
  {
    name: "Marcus L.",
    role: "Förening",
    text: "Perfekt för vår ideella verksamhet. Modern design och enkelt att uppdatera innehåll senare.",
  },
  {
    name: "Amina H.",
    role: "Privatperson",
    text: "Professionellt resultat utan att betala en krona. Rekommenderar varmt till alla som behöver komma igång online.",
  },
];

export default function SocialProof() {
  return (
    <section className="py-16 bg-white dark:bg-slate-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-3">Det säger kunderna</h2>
          <p className="text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
            Riktiga projekt, nöjda användare — helt utan kostnad
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {testimonials.map((t) => (
            <blockquote
              key={t.name}
              className="p-6 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm"
            >
              <div className="flex gap-0.5 text-yellow-500 mb-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <FiStar key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed mb-4">
                &ldquo;{t.text}&rdquo;
              </p>
              <footer>
                <p className="font-semibold text-slate-900 dark:text-white">
                  {t.name}
                </p>
                <p className="text-xs text-slate-500">{t.role}</p>
              </footer>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}
