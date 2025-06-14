"use client";

import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.refresh(); // cập nhật lại layout
  };

  return (
    <button onClick={handleLogout} className="text-red-600">
      Đăng xuất
    </button>
  );
}
