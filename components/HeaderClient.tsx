"use client";

import {
  SignInButton,
  UserButton,
  useUser,
  ClerkLoaded,
  SignedIn,
} from "@clerk/nextjs";
import Link from "next/link";
import React from "react";
import Form from "next/form";
import { TrolleyIcon, PackageIcon, HeartIcon } from "@sanity/icons";
import useStore from "@/store/store";
import { CategorySelectorComponent } from "./ui/category-selector";
import { Category } from "@/sanity.types";

function HeaderClient({ categories }: { categories: Category[] }) {
  const { user } = useUser();

  const itemCount = useStore((state) =>
    state.items.reduce((total, item) => total + item.quantity, 0)
  );

  const wishlistCount = useStore((state) => state.favoriteProduct.length);

  const createClerkPasskey = async () => {
    try {
      const response = await user?.createPasskey();
      console.log(response);
    } catch (err) {
      console.error("Error creating passkey:", JSON.stringify(err, null, 2));
    }
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-white px-4 py-4 shadow">
      <div className="flex w-full items-center justify-between gap-4 flex-wrap">
        {/* Logo */}
        <Link
          href="/"
          className="text-4xl font-extrabold text-blue-600 hover:text-red-500 transition-all"
        >
          Trendy<span className="text-red-500">Fit</span>
        </Link>

        {/* Search Form */}
        <Form
          action="/search"
          className="w-1/2 sm:w-auto sm:flex-1 sm:mx-4 mt-2 sm:mt-0"
        >
          <input
            type="text"
            name="query"
            placeholder="Search for products"
            className="bg-gray-100 text-gray-800 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 border w-1/2"
          />
        </Form>

        {/* Buttons */}
        <div className="flex items-center space-x-4 mt-4 sm:mt-0 flex-1 sm:flex-none">
          <div className="flex-1 relative flex justify-center sm:justify-start sm:flex-none items-center space-x-2 py-2 px-1 rounded">
            <CategorySelectorComponent categories={categories} />
          </div>
          <ClerkLoaded>
            <SignedIn>
              {/* Wishlist */}
              <Link
                href="/wishlist"
                className="flex-1 relative flex justify-center sm:justify-start sm:flex-none items-center space-x-2 bg-pink-400 hover:bg-pink-600 text-white font-bold py-2 px-4 rounded"
              >
                <HeartIcon className="w-6 h-6" />
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                  {wishlistCount}
                </span>
                <span>Wishlist</span>
              </Link>

              {/* Basket */}
              <Link
                href="/basket"
                className="flex-1 relative flex justify-center sm:justify-start sm:flex-none items-center space-x-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                <TrolleyIcon className="h-6 w-6" />
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                  {itemCount}
                </span>
                <span>My Basket</span>
              </Link>

              <Link
                href="/orders"
                className="flex-1 relative flex justify-center sm:justify-start sm:flex-none items-center space-x-2 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
              >
                <PackageIcon className="w-6 h-6" />
                <span>My Orders</span>
              </Link>
            </SignedIn>

            {user ? (
              <div className="flex items-center space-x-2">
                <UserButton />
                <div className="hidden sm:block text-xs">
                  <p className="text-gray-400">Welcome Back</p>
                  <p className="font-bold">{user.fullName}!</p>
                </div>
              </div>
            ) : (
              <SignInButton mode="modal" />
            )}

            {user?.passkeys?.length === 0 && (
              <button
                onClick={createClerkPasskey}
                className="bg-white text-blue-500 font-bold py-2 px-4 rounded border border-blue-300 hover:bg-blue-700 hover:text-white animate-pulse"
              >
                Create a passkey
              </button>
            )}
          </ClerkLoaded>
        </div>
      </div>
    </header>
  );
}

export default HeaderClient;
