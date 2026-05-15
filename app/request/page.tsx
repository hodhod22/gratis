"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import {
  FiSend,
  FiHeart,
  FiCheck,
  FiAlertCircle,
  FiCreditCard,
  FiPhone,
} from "react-icons/fi";

export default function RequestPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    websiteType: "",
    description: "",
    requirements: "",
    deadline: "",
    budget: "gratis",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const submitRequest = useMutation(api.requests.submitRequest);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      await submitRequest(formData);
      setIsSubmitted(true);
      setFormData({
        name: "",
        email: "",
        websiteType: "",
        description: "",
        requirements: "",
        deadline: "",
        budget: "gratis",
      });
    } catch (err) {
      setError("Något gick fel. Försök igen senare.");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDonation = () => {
    // Öppna donationssidan
    window.location.href = "/donate";
  };

  if (isSubmitted) {
    return (
      <div className="container mx-auto px-4 py-32 max-w-2xl text-center">
        <div className="bg-green-100 dark:bg-green-900/30 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
          <FiCheck className="w-10 h-10 text-green-600" />
        </div>
        <h1 className="text-3xl font-bold mb-4">Tack för din förfrågan! 🎉</h1>
        <p className="text-slate-600 dark:text-slate-400 mb-6">
          Jag har mottagit din förfrågan och kommer att granska den så snart som
          möjligt. Du kommer att få ett svar via email inom några dagar.
        </p>
        <p className="text-sm text-slate-500">
          💡 Just nu är det många som hör av sig - jag jobbar i den ordning jag
          kan.
        </p>
        <button
          onClick={() => setIsSubmitted(false)}
          className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Skicka en ny förfrågan
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16 max-w-3xl">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 bg-linear-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-full text-sm mb-4">
          <FiHeart className="w-4 h-4" />
          Helt gratis - Alltid
        </div>
        <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Få en gratis hemsida
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          Jag bygger hemsidor helt gratis för att jag älskar det jag gör. Fyll i
          formuläret så kontaktar jag dig!
        </p>
      </div>

      {/* Info Cards */}
      <div className="grid md:grid-cols-3 gap-4 mb-8">
        <div className="bg-blue-50 dark:bg-blue-950/30 p-4 rounded-xl text-center">
          <div className="text-2xl mb-2">🎯</div>
          <h3 className="font-semibold">Helt gratis</h3>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Inga dolda kostnader
          </p>
        </div>
        <div className="bg-purple-50 dark:bg-purple-950/30 p-4 rounded-xl text-center">
          <div className="text-2xl mb-2">⚡</div>
          <h3 className="font-semibold">Modern teknik</h3>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Next.js, TypeScript
          </p>
        </div>
        <div className="bg-green-50 dark:bg-green-950/30 p-4 rounded-xl text-center">
          <div className="text-2xl mb-2">💝</div>
          <h3 className="font-semibold">Donationer välkomna</h3>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Frivilligt stöd
          </p>
        </div>
      </div>

      {/* Formulär */}
      <form
        onSubmit={handleSubmit}
        className="space-y-6 bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-6 md:p-8"
      >
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-1">
              Ditt namn *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:border-slate-600"
              placeholder="Anna Svensson"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Din email *
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:border-slate-600"
              placeholder="anna@example.com"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Typ av hemsida *
          </label>
          <select
            required
            value={formData.websiteType}
            onChange={(e) =>
              setFormData({ ...formData, websiteType: e.target.value })
            }
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:border-slate-600"
          >
            <option value="">Välj...</option>
            <option value="portfolio">Portfolio / CV</option>
            <option value="blogg">Blogg</option>
            <option value="foretag">Företagshemsida</option>
            <option value="e-handel">E-handel</option>
            <option value="landing">Landningssida</option>
            <option value="annat">Annat</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Beskriv din idé *
          </label>
          <textarea
            required
            rows={3}
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:border-slate-600"
            placeholder="Berätta om din verksamhet, vad du vill uppnå med hemsidan..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Specifika krav / funktioner
          </label>
          <textarea
            rows={3}
            value={formData.requirements}
            onChange={(e) =>
              setFormData({ ...formData, requirements: e.target.value })
            }
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:border-slate-600"
            placeholder="Kontaktformulär, bildgalleri, bokningssystem, integrationer..."
          />
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-1">
              Deadline (valfritt)
            </label>
            <input
              type="text"
              value={formData.deadline}
              onChange={(e) =>
                setFormData({ ...formData, deadline: e.target.value })
              }
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:border-slate-600"
              placeholder="T.ex. om 2 månader"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Budget *</label>
            <select
              required
              value={formData.budget}
              onChange={(e) =>
                setFormData({ ...formData, budget: e.target.value })
              }
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:border-slate-600"
            >
              <option value="gratis">Helt gratis (standard)</option>
              <option value="donation">Jag kan donera frivilligt</option>
              <option value="ingen">Ingen budget just nu</option>
            </select>
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-2 text-red-600 bg-red-50 dark:bg-red-950/30 p-3 rounded-lg">
            <FiAlertCircle className="w-5 h-5" />
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3 bg-linear-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Skickar...
            </>
          ) : (
            <>
              <FiSend />
              Skicka förfrågan (helt gratis)
            </>
          )}
        </button>

        <p className="text-xs text-center text-slate-500">
          🔒 Din information används endast för att kontakta dig om hemsidan.
          Jag säljer aldrig din data till tredje part.
        </p>
      </form>

      {/* Donation Section */}
      <div className="mt-12">
        <div className="bg-linear-to-r from-yellow-50 to-orange-50 dark:from-yellow-950/20 dark:to-orange-950/20 rounded-2xl p-6 md:p-8">
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-2 bg-yellow-500 text-white px-4 py-2 rounded-full text-sm mb-4">
              <FiHeart className="w-4 h-4" />
              Frivilligt stöd
            </div>
            <h2 className="text-2xl font-bold mb-2">Stöd mitt arbete 💝</h2>
            <p className="text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
              Alla hemsidor är helt gratis. Ingen behöver donera för att få sin
              hemsida. Men om du har möjlighet och vill stödja mig så att jag
              kan hjälpa fler, är donationer varmt välkomna!
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            {/* Stripe / Kortbetalning */}
            <div className="bg-white dark:bg-slate-800 rounded-xl p-6 text-center shadow-lg">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full mb-4">
                <FiCreditCard className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold mb-2">Donera via kort</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                Säker betalning med Visa/Mastercard
              </p>
              <button
                onClick={handleDonation}
                disabled={isLoading}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                Donera med kort
              </button>
            </div>

            {/* Swish */}
            <div className="bg-white dark:bg-slate-800 rounded-xl p-6 text-center shadow-lg">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full mb-4">
                <FiPhone className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-semibold mb-2">Donera via Swish</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">
                Swisha valfritt belopp till:
              </p>
              <div className="bg-green-50 dark:bg-green-950/50 p-3 rounded-lg mb-4">
                <p className="text-2xl font-mono font-bold text-green-700 dark:text-green-400">
                  123 456 78 90
                </p>
              </div>
              <p className="text-xs text-slate-500">
                Swisha valfritt belopp. Skriv "Donation" i meddelandet.
              </p>
            </div>
          </div>

          <div className="text-center mt-6 pt-4 border-t border-yellow-200 dark:border-yellow-800/50">
            <p className="text-xs text-slate-500">
              💡 <strong>Ingen behöver donera</strong> - din hemsida är helt
              gratis oavsett om du donerar eller inte. Donationer används för
              att täcka kostnader för server, domän och för att jag ska kunna
              hjälpa fler.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
