"use client";

import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify"; // 👉 Toastify

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false); // 👉 trạng thái loading

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: "https://e-commerce-vqqd.onrender.com/login",
      },
    });

    if (error) {
      toast.error(`❌ ${error.message}`);
    } else {
      toast.success(
        "✅ Đăng ký thành công! Vui lòng kiểm tra email để xác minh."
      );
      router.push("/login");
    }

    setLoading(false);
  };

  return (
    <form
      onSubmit={handleRegister}
      className="max-w-md mx-auto p-8 bg-white rounded-xl shadow-md space-y-6"
    >
      <h2 className="text-3xl font-bold text-center text-gray-800">
        Tạo tài khoản
      </h2>

      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Email
        </label>
        <input
          id="email"
          type="email"
          placeholder="example@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
          required
        />
      </div>

      <div>
        <label
          htmlFor="password"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Mật khẩu
        </label>
        <input
          id="password"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
          required
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className={`w-full text-white font-semibold py-2 rounded transition ${
          loading
            ? "bg-green-400 cursor-not-allowed"
            : "bg-green-600 hover:bg-green-700"
        }`}
      >
        {loading ? "Đang xử lý..." : "Đăng ký"}
      </button>

      <p className="text-sm text-center text-gray-600">
        Bạn đã có tài khoản?{" "}
        <a href="/login" className="text-green-600 hover:underline font-medium">
          Đăng nhập ngay
        </a>
      </p>
    </form>
  );
}
