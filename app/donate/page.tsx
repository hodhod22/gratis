"use client";

import { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { FaHeart, FaStar, FaGift, FaShieldAlt } from "react-icons/fa";
import { motion } from "framer-motion";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
);

const donationAmounts = [5, 10, 20, 50, 100];

function DonationForm() {
  const stripe = useStripe();
  const elements = useElements();
  const [amount, setAmount] = useState(10);
  const [customAmount, setCustomAmount] = useState("");
  const [donorName, setDonorName] = useState("");
  const [donorEmail, setDonorEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isStripeReady, setIsStripeReady] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Detektera dark mode
  useEffect(() => {
    const isDark = document.documentElement.classList.contains("dark");
    setIsDarkMode(isDark);

    // Lyssna på dark mode ändringar
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === "class") {
          const isDarkNow = document.documentElement.classList.contains("dark");
          setIsDarkMode(isDarkNow);
        }
      });
    });

    observer.observe(document.documentElement, { attributes: true });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (stripe && elements) {
      setIsStripeReady(true);
    }
  }, [stripe, elements]);

  // Dynamisk styling för CardElement baserat på dark mode
  const cardElementOptions = {
    style: {
      base: {
        fontSize: "16px",
        color: isDarkMode ? "#f1f5f9" : "#1f2937", // Ljus text i dark mode
        backgroundColor: isDarkMode ? "#1e293b" : "#ffffff",
        "::placeholder": {
          color: isDarkMode ? "#64748b" : "#9ca3af",
        },
        ":-webkit-autofill": {
          color: isDarkMode ? "#f1f5f9" : "#1f2937",
        },
      },
      invalid: {
        color: "#ef4444",
        iconColor: "#ef4444",
      },
    },
    hidePostalCode: true,
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!stripe || !elements) {
      setError("Stripe is not ready. Please wait.");
      return;
    }

    setLoading(true);

    try {
      const cardElement = elements.getElement(CardElement);
      if (!cardElement) {
        throw new Error("Card element not found");
      }

      const { error: cardError, paymentMethod } =
        await stripe.createPaymentMethod({
          type: "card",
          card: cardElement,
          billing_details: {
            name: isAnonymous ? "Anonymous Donor" : donorName,
            email: donorEmail,
          },
        });

      if (cardError) {
        console.error("Card error:", cardError);
        setError(
          cardError.message || "Ett fel uppstod med kortet. Försök igen.",
        );
        setLoading(false);
        return;
      }

      const response = await fetch("/api/stripe/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: amount,
          paymentMethodId: paymentMethod.id,
          donorName: isAnonymous ? "Anonymous" : donorName,
          donorEmail: donorEmail,
          message: message,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Payment failed");
      }

      const { error: confirmError } = await stripe.confirmCardPayment(
        data.clientSecret,
      );

      if (confirmError) {
        setError(
          confirmError.message ||
            "Betalningen kunde inte slutföras. Försök igen.",
        );
        setLoading(false);
      } else {
        window.location.href = "/donate/success";
      }
    } catch (err) {
      console.error("Payment error:", err);
      setError(
        err instanceof Error ? err.message : "Ett oväntat fel inträffade",
      );
      setLoading(false);
    }
  };

  const handleAmountSelect = (amt: number) => {
    setAmount(amt);
    setCustomAmount("");
  };

  const handleCustomAmount = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCustomAmount(value);
    if (value) {
      setAmount(parseFloat(value));
    }
  };

  if (!isStripeReady) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-slate-600 dark:text-slate-400">
          Laddar betalningsformulär...
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium mb-3 text-slate-700 dark:text-slate-300">
          Välj donationsbelopp (SEK)
        </label>
        <div className="grid grid-cols-5 gap-2 mb-3">
          {donationAmounts.map((amt) => (
            <button
              key={amt}
              type="button"
              onClick={() => handleAmountSelect(amt)}
              className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                amount === amt && !customAmount
                  ? "bg-linear-to-r from-blue-600 to-purple-600 text-white shadow-lg scale-105"
                  : "bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-blue-100 dark:hover:bg-blue-900"
              }`}
            >
              {amt} kr
            </button>
          ))}
        </div>
        <input
          type="number"
          value={customAmount}
          onChange={handleCustomAmount}
          placeholder="Eget belopp"
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-slate-800 text-slate-900 dark:text-white"
          min="5"
          step="5"
        />
      </div>

      {!isAnonymous && (
        <>
          <div>
            <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">
              Ditt namn
            </label>
            <input
              type="text"
              value={donorName}
              onChange={(e) => setDonorName(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-slate-800 text-slate-900 dark:text-white"
              required={!isAnonymous}
              placeholder="Namn"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">
              Din e-post
            </label>
            <input
              type="email"
              value={donorEmail}
              onChange={(e) => setDonorEmail(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-slate-800 text-slate-900 dark:text-white"
              required
              placeholder="email@exempel.se"
            />
          </div>
        </>
      )}

      <div>
        <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">
          Meddelande (Valfritt)
        </label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={3}
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-slate-800 text-slate-900 dark:text-white"
          placeholder="Skriv ett stödjande meddelande..."
        />
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="anonymous"
          checked={isAnonymous}
          onChange={(e) => setIsAnonymous(e.target.checked)}
          className="w-4 h-4 text-blue-600"
        />
        <label
          htmlFor="anonymous"
          className="text-sm text-slate-700 dark:text-slate-300"
        >
          Donera anonymt
        </label>
      </div>

      <div className="border rounded-lg p-4 bg-white dark:bg-slate-800 transition-colors">
        <label className="block text-sm font-medium mb-3 text-slate-700 dark:text-slate-300">
          Kortuppgifter
        </label>
        <div className="dark:text-white">
          <CardElement options={cardElementOptions} />
        </div>
      </div>

      {error && (
        <div className="p-3 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded-lg text-sm">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading || !isStripeReady}
        className="w-full bg-linear-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition"
      >
        {loading ? "Bearbetar..." : `Donera ${amount} kr`}
      </button>

      <p className="text-xs text-center text-slate-500 dark:text-slate-400 flex items-center justify-center gap-1">
        <FaShieldAlt />
        Säkra betalningar via Stripe
      </p>
    </form>
  );
}

export default function DonatePage() {
  if (!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <div className="bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 p-4 rounded-lg">
          <h2 className="font-bold mb-2">Konfigurationsfel</h2>
          <p>Stripe nyckel saknas. Kontrollera din miljökonfiguration.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto"
      >
        <div className="text-center mb-8">
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 0.5 }}
          >
            <FaHeart className="text-6xl text-red-500 mx-auto mb-4" />
          </motion.div>
          <h1 className="text-4xl font-bold mb-4 bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Stöd Mitt Arbete
          </h1>
          <p className="text-slate-600 dark:text-slate-300">
            Alla hemsidor är helt gratis. Men om du vill stödja mig så att jag
            kan hjälpa fler, är donationer varmt välkomna!
          </p>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 md:p-8">
          <Elements stripe={stripePromise}>
            <DonationForm />
          </Elements>
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4">
            <FaStar className="text-3xl text-yellow-500 mx-auto mb-3" />
            <h3 className="font-semibold mb-2 text-slate-900 dark:text-white">
              Helt Gratis
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Ingen behöver donera. Alla hemsidor är gratis.
            </p>
          </div>
          <div className="text-center p-4">
            <FaGift className="text-3xl text-purple-500 mx-auto mb-3" />
            <h3 className="font-semibold mb-2 text-slate-900 dark:text-white">
              Frivilligt Stöd
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Donationer hjälper mig att hjälpa fler människor.
            </p>
          </div>
          <div className="text-center p-4">
            <FaHeart className="text-3xl text-red-500 mx-auto mb-3" />
            <h3 className="font-semibold mb-2 text-slate-900 dark:text-white">
              Göra Skillnad
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Varje bidrag gör det möjligt för mig att fortsätta.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
