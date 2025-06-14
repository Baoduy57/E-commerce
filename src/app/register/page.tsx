"use client";

import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: "https://e-commerce-vqqd.onrender.com/login",
      },
    });

    if (error) {
      setError(error.message);
    } else {
      alert("Đăng ký thành công! Vui lòng kiểm tra email để xác minh.");
      router.push("/login");
    }
  };

  return (
    <form onSubmit={handleRegister} className="max-w-sm mx-auto p-6 space-y-4">
      <h2 className="text-2xl font-bold">Đăng ký</h2>
      {error && <p className="text-red-600">{error}</p>}
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full p-2 border rounded"
        required
      />
      <input
        type="password"
        placeholder="Mật khẩu"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full p-2 border rounded"
        required
      />
      <button
        type="submit"
        className="bg-green-600 text-white px-4 py-2 rounded"
      >
        Đăng ký
      </button>
    </form>
  );
}
