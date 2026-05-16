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
import {
  FiPhone,
  FiCopy,
  FiCheck,
  FiSmartphone,
  FiCreditCard,
} from "react-icons/fi";
import { motion } from "framer-motion";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
);

const donationAmounts = [50, 100, 200, 500, 1000];

// Swish och Revolut uppgifter
const SWISH_NUMBER = "0722972894"; // Byt till ditt Swish-nummer
const REVOLUT_USERNAME = "@aezadkhaha"; // Byt till ditt Revolut användarnamn
const REVOLUT_LINK = "https://revolut.me/aezadkhaha"; // Byt till din Revolut-länk

function DonationForm() {
  const stripe = useStripe();
  const elements = useElements();
  const [amount, setAmount] = useState(100);
  const [customAmount, setCustomAmount] = useState("");
  const [donorName, setDonorName] = useState("");
  const [donorEmail, setDonorEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isStripeReady, setIsStripeReady] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [copiedSwish, setCopiedSwish] = useState(false);
  const [copiedRevolut, setCopiedRevolut] = useState(false);

  useEffect(() => {
    if (stripe && elements) {
      setIsStripeReady(true);
    }
  }, [stripe, elements]);

  useEffect(() => {
    const isDark = document.documentElement.classList.contains("dark");
    setIsDarkMode(isDark);

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === "class") {
          setIsDarkMode(document.documentElement.classList.contains("dark"));
        }
      });
    });

    observer.observe(document.documentElement, { attributes: true });
    return () => observer.disconnect();
  }, []);

  const cardElementOptions = {
    style: {
      base: {
        fontSize: "16px",
        color: isDarkMode ? "#f1f5f9" : "#1f2937",
        backgroundColor: isDarkMode ? "#1e293b" : "#ffffff",
        "::placeholder": {
          color: isDarkMode ? "#64748b" : "#9ca3af",
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

  const copySwishNumber = () => {
    navigator.clipboard.writeText(SWISH_NUMBER.replace(/\s/g, ""));
    setCopiedSwish(true);
    setTimeout(() => setCopiedSwish(false), 2000);
  };

  const copyRevolutUsername = () => {
    navigator.clipboard.writeText(REVOLUT_USERNAME);
    setCopiedRevolut(true);
    setTimeout(() => setCopiedRevolut(false), 2000);
  };

  const openSwish = () => {
    const cleanNumber = SWISH_NUMBER.replace(/\s/g, "");
    window.location.href = `swish://payment?data=${cleanNumber}`;
    setTimeout(() => copySwishNumber(), 1000);
  };

  const openRevolut = () => {
    window.open(REVOLUT_LINK, "_blank");
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
    <div className="space-y-8">
      {/* Stripe Card Form */}
      <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <FiCreditCard className="text-blue-600" />
          Kortbetalning (Stripe)
        </h3>
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
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-slate-800"
              min="5"
              step="5"
            />
          </div>

          {!isAnonymous && (
            <>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Ditt namn
                </label>
                <input
                  type="text"
                  value={donorName}
                  onChange={(e) => setDonorName(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-slate-800"
                  required={!isAnonymous}
                  placeholder="Namn"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Din e-post
                </label>
                <input
                  type="email"
                  value={donorEmail}
                  onChange={(e) => setDonorEmail(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-slate-800"
                  required
                  placeholder="email@exempel.se"
                />
              </div>
            </>
          )}

          <div>
            <label className="block text-sm font-medium mb-2">
              Meddelande (Valfritt)
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={2}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-slate-800"
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
            <label htmlFor="anonymous" className="text-sm">
              Donera anonymt
            </label>
          </div>

          <div className="border rounded-lg p-4 bg-white dark:bg-slate-800">
            <label className="block text-sm font-medium mb-3">
              Kortuppgifter
            </label>
            <CardElement options={cardElementOptions} />
          </div>

          {error && (
            <div className="p-3 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded-lg text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-linear-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:opacity-90 disabled:opacity-50"
          >
            {loading ? "Bearbetar..." : `Donera ${amount} kr`}
          </button>
        </form>
      </div>

      {/* Swish Donation */}
      <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg border-2 border-green-500">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
            <FiPhone className="w-5 h-5 text-green-600" />
          </div>
          <h3 className="text-lg font-semibold">Donera via Swish</h3>
        </div>
        <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
          Swisha valfritt belopp direkt från din mobil. Inga avgifter, direkt
          till mig.
        </p>
        <div className="bg-green-50 dark:bg-green-950/50 p-4 rounded-lg mb-4 text-center">
          <p className="text-2xl font-mono font-bold text-green-700 dark:text-green-400">
            {SWISH_NUMBER}
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={openSwish}
            className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
          >
            <FiPhone className="w-4 h-4" />
            Öppna Swish
          </button>
          <button
            onClick={copySwishNumber}
            className="px-4 py-2 border border-green-600 text-green-600 rounded-lg hover:bg-green-50 dark:hover:bg-green-950 transition-colors flex items-center gap-2"
          >
            {copiedSwish ? (
              <FiCheck className="w-4 h-4" />
            ) : (
              <FiCopy className="w-4 h-4" />
            )}
            {copiedSwish ? "Kopierat!" : "Kopiera"}
          </button>
        </div>
        <p className="text-xs text-slate-500 mt-3 text-center">
          💡 Swisha valfritt belopp. Skriv "Donation" i meddelandet.
        </p>
      </div>

      {/* Revolut Donation */}
      <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg border-2 border-blue-400">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
            <FiSmartphone className="w-5 h-5 text-blue-600" />
          </div>
          <h3 className="text-lg font-semibold">Donera via Revolut</h3>
        </div>
        <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
          Donera internationellt via Revolut. Snabbt och enkelt.
        </p>
        <div className="bg-blue-50 dark:bg-blue-950/50 p-4 rounded-lg mb-4 text-center">
          <p className="text-lg font-mono font-bold text-blue-700 dark:text-blue-400 break-all">
            {REVOLUT_USERNAME}
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={openRevolut}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
          >
            <FiSmartphone className="w-4 h-4" />
            Öppna Revolut
          </button>
          <button
            onClick={copyRevolutUsername}
            className="px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-950 transition-colors flex items-center gap-2"
          >
            {copiedRevolut ? (
              <FiCheck className="w-4 h-4" />
            ) : (
              <FiCopy className="w-4 h-4" />
            )}
            {copiedRevolut ? "Kopierat!" : "Kopiera"}
          </button>
        </div>
        <p className="text-xs text-slate-500 mt-3 text-center">
          💡 Klicka på Revolut-knappen för att donera via Revolut-appen eller
          webben.
        </p>
      </div>

      <p className="text-xs text-center text-slate-500 flex items-center justify-center gap-1">
        <FaShieldAlt />
        Säkra betalningar via Stripe • Swish • Revolut
      </p>
    </div>
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
    <div className="container mx-auto px-4 py-12 max-w-2xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
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
          <p className="text-slate-600 dark:text-slate-400">
            Alla hemsidor är helt gratis. Men om du vill stödja mig så att jag
            kan hjälpa fler, är donationer varmt välkomna!
          </p>
        </div>

        <Elements stripe={stripePromise}>
          <DonationForm />
        </Elements>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4">
            <FaStar className="text-3xl text-yellow-500 mx-auto mb-3" />
            <h3 className="font-semibold mb-2">Helt Gratis</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Ingen behöver donera
            </p>
          </div>
          <div className="text-center p-4">
            <FaGift className="text-3xl text-purple-500 mx-auto mb-3" />
            <h3 className="font-semibold mb-2">Frivilligt Stöd</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Donationer hjälper mig hjälpa fler
            </p>
          </div>
          <div className="text-center p-4">
            <FaHeart className="text-3xl text-red-500 mx-auto mb-3" />
            <h3 className="font-semibold mb-2">Göra Skillnad</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Varje bidrag räknas
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
