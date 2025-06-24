"use client";

import Link from "next/link";
import LogoutButton from "./LogoutButton";
import CartButton from "./CartButton";
import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";

interface Props {
  user: { id: string; email?: string } | null;
}

export default function NavbarClient({ user }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="mb-8 flex justify-between items-center px-4 py-3 bg-white shadow-md rounded-lg relative">
      <div className="text-lg font-bold text-blue-600">
        <Link href="/">E-Commerce</Link>
      </div>

      <div className="flex items-center gap-4 relative" ref={dropdownRef}>
        {user ? (
          <>
            <Link
              href="/"
              className="text-gray-700 hover:text-blue-600 font-medium transition"
            >
              Trang chủ
            </Link>

            <CartButton />

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="flex items-center gap-2 text-gray-700 hover:text-blue-600 font-medium transition focus:outline-none"
            >
              👤 {user.email?.split("@")[0] || "Tài khoản"}
              <ChevronDown
                size={16}
                className={`transition-transform duration-300 ${
                  isOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            <div
              className={`absolute right-0 top-full mt-2 w-48 bg-white border border-gray-200 rounded-xl shadow-xl transition-all duration-300 ease-in-out transform z-30
                ${
                  isOpen
                    ? "opacity-100 translate-y-0 scale-100"
                    : "opacity-0 -translate-y-2 scale-95 pointer-events-none"
                }`}
            >
              <Link
                href="/orders"
                onClick={() => setIsOpen(false)}
                className="block px-4 py-3 text-sm text-gray-700 hover:text-blue-600 font-medium transition"
              >
                📦 Đơn mua
              </Link>
              <div className="border-t px-4 py-3">
                <LogoutButton />
              </div>
            </div>
          </>
        ) : (
          <>
            <Link
              href="/login"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition"
            >
              Đăng nhập
            </Link>
            <Link
              href="/register"
              className="border border-blue-600 text-blue-600 hover:bg-blue-50 px-4 py-2 rounded transition"
            >
              Đăng ký
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
