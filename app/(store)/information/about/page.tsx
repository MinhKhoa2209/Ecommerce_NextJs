
"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white text-gray-900">
      <section className="max-w-5xl mx-auto px-6 py-20">
        <motion.h1
          className="text-5xl font-extrabold mb-8 text-center tracking-tight"
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Welcome to TrendyFit
        </motion.h1>

        <motion.p
          className="text-lg text-gray-600 mb-6 text-center leading-relaxed"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          Your go-to destination for premium gear, lifestyle essentials, and the bold spirit of modern fashion. At TrendyFit, we’re driven by innovation and empowered by design — made for athletes, creators, and trendsetters like you.
        </motion.p>

        <motion.div
          className="grid md:grid-cols-2 gap-10 mt-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
        >
          <div>
            <h2 className="text-2xl font-bold mb-4">Our Vision</h2>
            <p className="text-gray-700 leading-relaxed">
              From day one, we’ve believed in pushing boundaries — blending performance with style, and boldness with authenticity. We're here to elevate not just your outfit, but your mindset. Every piece is crafted to empower you to go further, train harder, and live bolder.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-4">Where We Are</h2>
            <p className="text-gray-700 leading-relaxed">
              Whether you're browsing the latest drops or hunting for essentials, our digital shelves are stocked with curated collections just for you. Every promo or campaign will be announced through our **official channels only**:
            </p>
            <ul className="mt-4 text-gray-800 list-disc list-inside space-y-2">
              <li>
                Website:{" "}
                <Link
                  href="https://trendyfit.vercel.app/"
                  target="_blank"
                  className="text-blue-600 hover:underline"
                >
                  trendyfit.vercel.app
                </Link>
              </li>
              <li>
                Facebook:{" "}
                <Link
                  href="https://www.facebook.com/minh.khoa.523830/"
                  target="_blank"
                  className="text-blue-600 hover:underline"
                >
                  facebook.com/minh.khoa.523830
                </Link>
              </li>
              <li>
                Email:{" "}
                <a
                  href="mailto:khoadm.23it@vku.udn.vn"
                  className="text-blue-600 hover:underline"
                >
                  khoadm.23it@vku.udn.vn
                </a>
              </li>
            </ul>
          </div>
        </motion.div>

        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.6 }}
        >
          <p className="text-gray-600 text-lg">
            Thank you for being part of the TrendyFit journey. Let’s move — together.
          </p>
        </motion.div>
      </section>
    </main>
  );
}
