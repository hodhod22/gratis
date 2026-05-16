"use client";

import { FiGithub, FiLinkedin, FiMapPin } from "react-icons/fi";

export default function Contact() {
  return (
    <section id="contact" className="py-20 bg-white dark:bg-slate-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Kontakt</h2>
          <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Har du frågor? Använd chatten längst ner till höger – jag svarar så
            snart jag kan!
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-6">
          <div className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
            <FiGithub className="w-8 h-8 text-blue-600" />
            <div>
              <h3 className="font-semibold">GitHub</h3>
              <a
                href="https://github.com/hodhod22"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-600 dark:text-slate-400 hover:text-blue-600"
              >
                /hodhod22
              </a>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
            <FiLinkedin className="w-8 h-8 text-blue-600" />
            <div>
              <h3 className="font-semibold">LinkedIn</h3>
              <a
                href="https://linkedin.com/in/dittnamn"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-600 dark:text-slate-400 hover:text-blue-600"
              >
                /in/dittnamn
              </a>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
            <FiMapPin className="w-8 h-8 text-blue-600" />
            <div>
              <h3 className="font-semibold">Plats</h3>
              <p className="text-slate-600 dark:text-slate-400">Sverige</p>
            </div>
          </div>
        </div>

        <div className="text-center mt-8">
          <p className="text-sm text-slate-500">
            💬 Klicka på chat-ikonen längst ner till höger för att kontakta mig
            direkt!
          </p>
        </div>
      </div>
    </section>
  );
}
