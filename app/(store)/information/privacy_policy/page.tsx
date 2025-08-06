"use client";

import { motion } from "framer-motion";

export default function PrivacyPolicyPage() {
  return (
    <motion.div
      className="max-w-5xl mx-auto px-4 py-12 text-gray-800"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <h1 className="text-4xl font-bold mb-6 text-black">Privacy Policy</h1>

      <section className="space-y-6">
        <div>
          <h2 className="text-2xl font-semibold text-black">
            1. Data Collection
          </h2>
          <p className="text-gray-600 mt-2">
            We collect personal data including name, email, phone number, and
            shipping address to process your orders and improve our services.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold text-black">2. Use of Data</h2>
          <p className="text-gray-600 mt-2">
            Your data helps us enhance your experience, fulfill orders, provide
            customer service, and communicate about promotions.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold text-black">
            3. Data Protection
          </h2>
          <p className="text-gray-600 mt-2">
            We implement strong security measures and encrypt sensitive
            information to safeguard your data.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold text-black">4. Cookies</h2>
          <p className="text-gray-600 mt-2">
            We use cookies to personalize content and track usage data. You can
            modify cookie preferences through your browser settings.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold text-black">5. Contact</h2>
          <p className="text-gray-600 mt-2">
            For questions or concerns regarding our privacy practices, contact
            us at{" "}
            <a
              href="mailto:khoadm.23it@vku.udn.vn"
              className="underline text-blue-600"
            >
              khoadm.23it@vku.udn.vn
            </a>
            .
          </p>
        </div>
      </section>
    </motion.div>
  );
}
