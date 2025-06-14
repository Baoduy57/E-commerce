// src/components/Navbar.tsx
import Link from "next/link";
import LogoutButton from "./LogoutButton";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export default async function Navbar() {
  const supabase = createServerComponentClient({ cookies });
  const { data } = await supabase.auth.getUser();
  const user = data?.user;

  return (
    <nav className="mb-8 flex justify-between items-center px-4 py-3 bg-white shadow-md rounded-lg">
      <div className="text-lg font-bold text-blue-600">
        <Link href="/">E-Commerce</Link>
      </div>

      <div className="space-x-4">
        {user ? (
          <>
            <Link
              href="/"
              className="text-gray-700 hover:text-blue-600 font-medium transition"
            >
              Trang chủ
            </Link>
            <LogoutButton />
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
