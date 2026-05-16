"use client";

import { useState, useEffect } from "react";
import { FaStar, FaQuoteLeft } from "react-icons/fa";

interface Testimonial {
  id: number;
  name: string;
  role: string;
  content: string;
  rating: number;
  avatar?: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Anna Svensson",
    role: "Småföretagare",
    content:
      "Ali byggde en fantastisk hemsida åt mitt företag helt gratis! Jag är så tacksam för hennes professionella arbete och hennes engagemang.",
    rating: 5,
  },
  {
    id: 2,
    name: "Mohammed Alii",
    role: "Startup grundare",
    content:
      "Otroligt duktig utvecklare! Hemsidan blev precis som jag ville ha den. Rekommenderas varmt!",
    rating: 5,
  },
  {
    id: 3,
    name: "Erik Johansson",
    role: "Frilansfotograf",
    content:
      "Min portfolio ser fantastisk ut! Ali förstod precis vad jag behövde. Tack så mycket!",
    rating: 5,
  },
  {
    id: 4,
    name: "Lisa Andersson",
    role: "Ideell förening",
    content:
      "Vi fick en proffsig hemsida till vår ideella förening helt gratis. Ali är en ängel!",
    rating: 5,
  },
];

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const testimonial = testimonials[currentIndex];

  return (
    <section className="py-20 bg-linear-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Vad andra säger 💬
          </h2>
          <p className="text-slate-600 dark:text-slate-400">
            Här är vad några av mina kunder tycker om mitt arbete
          </p>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-xl">
          <FaQuoteLeft className="text-4xl text-blue-500 mb-4 opacity-50" />
          <p className="text-lg md:text-xl text-slate-700 dark:text-slate-300 mb-6 italic">
            "{testimonial.content}"
          </p>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold">{testimonial.name}</p>
              <p className="text-sm text-slate-500">{testimonial.role}</p>
            </div>
            <div className="flex gap-1">
              {[...Array(testimonial.rating)].map((_, i) => (
                <FaStar key={i} className="text-yellow-500" />
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-center gap-2 mt-6">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentIndex
                  ? "bg-blue-600 w-6"
                  : "bg-slate-300 dark:bg-slate-600"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
