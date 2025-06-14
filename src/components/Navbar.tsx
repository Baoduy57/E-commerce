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
    <nav className="mb-6 space-x-4">
      {user ? (
        <>
          <Link href="/">Trang chủ</Link>
          <LogoutButton />
        </>
      ) : (
        <>
          <Link href="/login">Đăng nhập</Link>
          <Link href="/register">Đăng ký</Link>
        </>
      )}
    </nav>
  );
}
