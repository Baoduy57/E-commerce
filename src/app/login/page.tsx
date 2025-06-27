"use client";

import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      toast.error(`❌ ${error.message}`);
      setIsLoading(false);
    } else {
      toast.success("🎉 Đăng nhập thành công!");
      router.push("/");
      router.refresh();
    }
  };

  return (
    <form
      onSubmit={handleLogin}
      className="max-w-md mx-auto p-8 bg-white rounded-xl shadow-md space-y-6"
    >
      <h2 className="text-3xl font-bold text-center text-gray-800">
        Đăng nhập
      </h2>

      {error && (
        <div className="bg-red-100 text-red-700 px-4 py-2 rounded text-sm">
          {error}
        </div>
      )}

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
          className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
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
          className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className={`w-full font-semibold py-2 rounded transition text-white ${
          isLoading
            ? "bg-blue-400 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        {isLoading ? "Đang đăng nhập..." : "Đăng nhập"}
      </button>

      <p className="text-sm text-center text-gray-600">
        Chưa có tài khoản?{" "}
        <a
          href="/register"
          className="text-blue-600 hover:underline font-medium"
        >
          Đăng ký ngay
        </a>
      </p>
    </form>
  );
}
