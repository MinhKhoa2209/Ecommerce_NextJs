"use client";

import { motion } from "framer-motion";

export default function TermsPage() {
  return (
    <motion.div
      className="max-w-5xl mx-auto px-4 py-12 text-gray-800"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <h1 className="text-4xl font-bold mb-6 text-black">Terms & Conditions</h1>

      <section className="space-y-6">
        <div>
          <h2 className="text-2xl font-semibold text-black">1. Introduction</h2>
          <p className="text-gray-600 mt-2">
            Welcome to TrendyFit. By accessing or using our services, you agree
            to be bound by these Terms and all applicable laws and regulations.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold text-black">2. Eligibility</h2>
          <p className="text-gray-600 mt-2">
            You must be at least 18 years old to use our services or have the
            supervision of a parent or guardian.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold text-black">
            3. Use of Services
          </h2>
          <p className="text-gray-600 mt-2">
            You agree not to misuse the services or help anyone else to do so.
            Misuse includes harming or attempting to harm our platform, users,
            or services.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold text-black">
            4. Intellectual Property
          </h2>
          <p className="text-gray-600 mt-2">
            All content on our website is the intellectual property of TrendyFit
            or its licensors. You may not reuse, copy, or distribute any content
            without permission.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold text-black">5. Termination</h2>
          <p className="text-gray-600 mt-2">
            We may suspend or terminate your access if you violate these terms
            or engage in prohibited conduct.
          </p>
        </div>
      </section>
    </motion.div>
  );
}
