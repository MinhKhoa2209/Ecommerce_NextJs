"use client";

import {
  SignInButton,
  useUser,
  ClerkLoaded,
  SignedIn,
} from "@clerk/nextjs";
import Link from "next/link";
import React from "react";
import Form from "next/form";
import { TrolleyIcon, PackageIcon, HeartIcon, SearchIcon } from "@sanity/icons";
import useStore from "@/store/store";
import { CategorySelectorComponent } from "./ui/category-selector";
import { Category } from "@/sanity.types";
import CustomUserButton from "./CustomUserButton";

function HeaderClient({ categories }: { categories: Category[] }) {
  const { user } = useUser();

  const itemCount = useStore((state) =>
    state.items.reduce((total, item) => total + item.quantity, 0)
  );

  const wishlistCount = useStore((state) => state.favoriteProduct.length);

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-white px-6 py-4 shadow">
      <div className="flex items-center justify-between gap-4 flex-wrap">

        {/* Logo */}
        <Link
          href="/"
          className="text-3xl font-extrabold bg-gradient-to-r from-blue-600 to-red-500 bg-clip-text text-transparent tracking-tight"
        >
          TrendyFit
        </Link>

        {/* Search Form */}
        <Form
          action="/search"
          className="flex items-center flex-1 max-w-xl bg-gray-100 rounded-full px-4 py-2 border border-gray-300 focus-within:ring-2 focus-within:ring-blue-500"
        >
          <SearchIcon className="w-5 h-5 text-gray-500 mr-2" />
          <input
            type="text"
            name="query"
            placeholder="Search for products"
            className="bg-transparent flex-1 outline-none text-gray-800"
          />
        </Form>

        {/* Action Buttons */}
        <div className="flex items-center gap-5">

          <div className="hidden sm:block">
            <CategorySelectorComponent categories={categories} />
          </div>

          <ClerkLoaded>
            <SignedIn>
              {/* Wishlist */}
              <Link href="/wishlist" className="relative group">
                <HeartIcon className="w-6 h-6 text-gray-700 hover:text-pink-500 transition-colors" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                    {wishlistCount}
                  </span>
                )}
                <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-black text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition">
                  Wishlist
                </span>
              </Link>

              {/* Basket */}
              <Link href="/basket" className="relative group">
                <TrolleyIcon className="w-6 h-6 text-gray-700 hover:text-blue-600 transition-colors" />
                {itemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                    {itemCount}
                  </span>
                )}
                <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-black text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition">
                  Basket
                </span>
              </Link>

              {/* Orders */}
              <Link href="/orders" className="relative group">
                <PackageIcon className="w-6 h-6 text-gray-700 hover:text-green-600 transition-colors" />
                <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-black text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition">
                  Orders
                </span>
              </Link>
            </SignedIn>

            {user ? (
              <CustomUserButton />
            ) : (
              <SignInButton mode="modal" />
            )}
          </ClerkLoaded>
        </div>
      </div>
    </header>
  );
}

export default HeaderClient;
