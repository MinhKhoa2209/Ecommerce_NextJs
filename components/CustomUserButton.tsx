import { useState, useEffect, useRef } from "react";
import { useUser, useClerk } from "@clerk/nextjs";
import Link from "next/link";

export default function CustomUserButton() {
  const { user } = useUser();
  const { signOut, openUserProfile } = useClerk();
  const [open, setOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  // Tự động đóng dropdown khi reload trang
  useEffect(() => {
    const handleRouteChange = () => setOpen(false);

    window.addEventListener("beforeunload", handleRouteChange);
    return () => {
      window.removeEventListener("beforeunload", handleRouteChange);
    };
  }, []);

  if (!user) return null;

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Avatar */}
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center rounded-full"
      >
        <img
          src={user.imageUrl}
          alt="User Avatar"
          className="w-8 h-8 rounded-full"
        />
      </button>

      {/* Dropdown Menu */}
      {open && (
        <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg overflow-hidden z-50">
          {/* Header */}
          <div className="px-4 py-3 border-b">
            <p className="text-sm font-semibold">{user.fullName}</p>
            <p className="text-xs text-gray-500">
              {user.primaryEmailAddress?.emailAddress}
            </p>
          </div>

          {/* Default Manage account */}
          <button
            onClick={() => {
              openUserProfile();
              setOpen(false);
            }}
            className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
          >
            Manage account
          </button>

          {/* Custom Menu Items */}
          <Link
            href="/profile/address-book"
            className="block px-4 py-2 text-sm hover:bg-gray-100"
            onClick={() => setOpen(false)} 
          >
            Manage addresses
          </Link>

          {/* Sign Out */}
          <button
            onClick={() => signOut()}
            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 border-t"
          >
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}
