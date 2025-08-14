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

            <ul className="flex space-x-6 text-gray-700">
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
          <div>
            <h3 className="font-bold mb-4 text-lg">Newsletter</h3>
            <p className="text-sm text-gray-600 mb-4">
              Subscribe to our newsletter to receive updates and exclusive
              offers.
            </p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const email = (
                  e.currentTarget.elements.namedItem(
                    "email"
                  ) as HTMLInputElement
                )?.value;
                if (email) {
                  console.log("Subscribed:", email);
                }
              }}
              className="flex flex-col space-y-3"
            >
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-black"
              />
              <button
                type="submit"
                className="bg-black text-white py-2 rounded-md font-semibold hover:bg-gray-800 transition"
              >
                Subscribe
              </button>
            </form>
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
