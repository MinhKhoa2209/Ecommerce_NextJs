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
import { TrolleyIcon, PackageIcon } from "@sanity/icons";
import useBasketStore from "@/store/store";
function Header() {
  const { user } = useUser();
  const itemCount = useBasketStore((state) =>
    state.items.reduce((total, item) => total + item.quantity, 0)
  );
  const createClerkPasskey = async () => {
    try {
      const respone = await user?.createPasskey();
      console.log(respone);
    } catch (err) {
      console.error("Error creating passkey:", JSON.stringify(err, null, 2));
    }
  };
  return (
    <header className="flex justify-between items-center px-4 py-4">
      <div className="flex w-full items-center justify-between gap-4 flex-wrap px-4">
        <Link
          href="/"
          className="text-4xl font-extrabold text-blue-600 hover:text-red-500 transition-all"
        >
          Trendy<span className="text-red-500">Fit</span>
        </Link>
        <Form
          action="/search"
          className="w-1/2 sm:w-auto sm:flex-1 sm:mx-4 mt-2 sm:mt-0"
        >
          <input
            type="text"
            name="query"
            placeholder="Search for products"
            className="bg-gray-100 text-gray-800 px-4 py-2 rounded focus:outline-none focus:ring-2
     focus:ring-blue-500 focus:ring-opacity-50 border w-1/2"
          />
        </Form>
        <div className="flex items-center space-x-4 mt-4 sm:mt-0 flex-1 sm:flex-none">
          <Link
            href="/basket"
            className="flex-1 relative flex justify-center sm:justify-start sm:flex-none items-center
    space-x-2 bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-700"
          >
            <TrolleyIcon className="h-6 w-6" />
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
              {itemCount}
            </span>
            <span>My basket</span>
          </Link>
          <ClerkLoaded>
            <SignedIn>
              <Link
                href="/orders"
                className="flex-1 relative flex justify-center sm:justify-start sm:flex-none items-center space-x-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
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

export default Header;
