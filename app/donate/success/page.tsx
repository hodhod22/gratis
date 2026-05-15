"use client";

import Link from "next/link";
import { FaHeart, FaCheckCircle } from "react-icons/fa";
import { motion } from "framer-motion";

export default function DonateSuccessPage() {
  return (
    <div className="container mx-auto px-4 py-24 max-w-2xl text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex justify-center mb-6">
          <FaCheckCircle className="text-6xl text-green-500" />
        </div>

        <h1 className="text-3xl font-bold mb-4 bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Tack för din donation! 💝
        </h1>

        <p className="text-slate-600 dark:text-slate-400 mb-6">
          Ditt stöd betyder otroligt mycket och hjälper mig att fortsätta bygga
          gratis hemsidor för människor som behöver det.
        </p>

        <div className="flex items-center justify-center gap-2 text-red-500 mb-8">
          <FaHeart className="text-2xl" />
          <span className="text-lg">Tusen tack!</span>
          <FaHeart className="text-2xl" />
        </div>

        <Link
          href="/"
          className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Gå till startsidan
        </Link>
      </motion.div>
    </div>
  );
}
