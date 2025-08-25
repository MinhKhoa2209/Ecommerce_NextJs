"use client";

import { Category } from "@/sanity.types";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FaGithub, FaFacebook, FaYoutube } from "react-icons/fa";

function FooterClient({ categories }: { categories: Category[] }) {
  const router = useRouter();

  return (
    <footer className="bg-gray-100 text-gray-800 mt-10">
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {/* Column 1 - Branding */}
          <div className="space-y-4">
            <Link
              href="/"
              className="text-3xl font-extrabold bg-gradient-to-r from-blue-600 to-red-500 bg-clip-text text-transparent tracking-tight"
            >
              TrendyFit
            </Link>

            <p className="text-gray-600 italic max-w-sm text-sm">
              “Discover the perfect blend of style and comfort, only at{" "}
              <span className="font-semibold text-blue-500">TrendyFit</span>.”
            </p>

            <ul className="flex flex-col sm:flex-row sm:space-x-6 space-y-4 sm:space-y-0 text-gray-700">
              <li>
                <Link
                  href="https://github.com/MinhKhoa2209"
                  target="_blank"
                  className="flex items-center space-x-2 hover:text-black transition-colors"
                >
                  <FaGithub className="text-xl" />
                  <span>GitHub</span>
                </Link>
              </li>
              <li>
                <Link
                  href="https://www.facebook.com/minh.khoa.523830"
                  target="_blank"
                  className="flex items-center space-x-2 hover:text-blue-600 transition-colors"
                >
                  <FaFacebook className="text-xl" />
                  <span>Facebook</span>
                </Link>
              </li>
              <li>
                <Link
                  href="https://www.youtube.com/@KhoaMinh-2209"
                  target="_blank"
                  className="flex items-center space-x-2 hover:text-red-600 transition-colors"
                >
                  <FaYoutube className="text-xl" />
                  <span>YouTube</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2 - Quick Links */}
          <div>
            <h3 className="font-bold mb-4 text-lg">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/information/about">About Us</Link>
              </li>
              <li>
                <Link href="/information/contact">Contact us</Link>
              </li>
              <li>
                <Link href="/information/terms_conditions">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href="/information/privacy_policy">Privacy Policy</Link>
              </li>
            </ul>
          </div>

          {/* Column 3 - Dynamic Categories */}
          <div>
            <h3 className="font-bold mb-4 text-lg">Categories</h3>
            <ul className="space-y-2 text-sm">
              {categories.map((category) => (
                <li key={category._id}>
                  <button
                    onClick={() =>
                      router.push(`/categories/${category.slug?.current}`)
                    }
                    className="text-left hover:underline text-sm text-gray-800"
                  >
                    {category.title}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4 - Newsletter */}
          <div className="relative bg-gradient-to-br from-pink-500 via-red-500 to-yellow-500 text-white p-6 rounded-2xl shadow-lg">
            <h3 className="font-extrabold mb-3 text-xl tracking-tight">
              Join the Trend
            </h3>
            <p className="text-sm opacity-95 leading-relaxed">
              Be the first to explore{" "}
              <span className="font-semibold">exclusive drops</span>, special
              discounts, and the latest fashion stories from{" "}
              <span className="font-semibold">TrendyFit</span>.
            </p>
            <p className="mt-4 text-xs italic opacity-80">
              *Style meets comfort — stay inspired with every look.
            </p>
          </div>
        </div>

        {/* Bottom Line */}
        <div className="border-t border-gray-300 mt-10 pt-6 text-sm text-gray-500 flex justify-center items-center">
          <p>&copy; 2025 TrendyFit. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default FooterClient;
