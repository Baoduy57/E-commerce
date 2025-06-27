"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { IProduct } from "@/models/Product";
import { useCart } from "@/context/CartContext";
import { toast } from "react-toastify"; // 👈 Toastify

export default function ClientProductDetails({
  product,
}: {
  product: IProduct;
}) {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [updating, setUpdating] = useState(false);
  const { fetchCart } = useCart();

  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
      setLoading(false);
    })();
  }, []);

  // ------------------ HANDLERS ------------------
  const handleAddToCart = async (redirectToCart: boolean) => {
    if (!user) {
      toast.info("Vui lòng đăng nhập trước khi mua hàng");
      router.push("/login");
      return;
    }

    setUpdating(true);

    try {
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": user.id,
        },
        body: JSON.stringify({ productId: product._id, quantity }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Không thể thêm vào giỏ");

      await fetchCart(); // đồng bộ cart
      toast.success("🛒 Đã thêm vào giỏ!");

      if (redirectToCart) router.push("/cart");
    } catch (err: any) {
      toast.error(`❌ ${err.message || "Có lỗi xảy ra"}`);
    } finally {
      setUpdating(false);
    }
  };

  // ------------------ UI ------------------
  const increment = () => setQuantity((q) => q + 1);
  const decrement = () => setQuantity((q) => (q > 1 ? q - 1 : 1));

  if (loading) return <p className="p-6">Đang kiểm tra đăng nhập...</p>;

  if (!user) {
    return (
      <div className="text-center py-20">
        <h2 className="text-xl font-semibold text-gray-600">
          Bạn cần đăng nhập để xem chi tiết sản phẩm.
        </h2>
        <button
          onClick={() => router.push("/login")}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
        >
          Đăng nhập
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        {product.image && (
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-[400px] object-cover rounded-lg shadow-md"
          />
        )}

        <div className="space-y-6">
          <h1 className="text-4xl font-bold text-gray-800">{product.name}</h1>
          <p className="text-gray-600 leading-relaxed text-lg">
            {product.description}
          </p>
          <div className="text-green-700 font-extrabold text-3xl">
            {Number(product.price).toLocaleString()}₫
          </div>

          {/* Số lượng */}
          <div className="flex items-center gap-4">
            <span className="text-gray-700 font-medium">Số lượng:</span>
            <div className="flex items-center gap-2">
              <button
                onClick={decrement}
                className="w-8 h-8 rounded bg-gray-200 hover:bg-gray-300 font-bold"
              >
                −
              </button>
              <span className="w-6 text-center">{quantity}</span>
              <button
                onClick={increment}
                className="w-8 h-8 rounded bg-gray-200 hover:bg-gray-300 font-bold"
              >
                +
              </button>
            </div>
          </div>

          {/* Nút hành động */}
          <div className="flex gap-4 pt-4">
            <button
              disabled={updating}
              onClick={() => handleAddToCart(true)}
              className={`px-6 py-2 rounded-md text-sm font-medium text-white transition
                ${
                  updating
                    ? "bg-blue-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
            >
              {updating ? "Đang xử lý..." : "Mua ngay"}
            </button>

            <button
              disabled={updating}
              onClick={() => handleAddToCart(false)}
              className={`px-6 py-2 rounded-md text-sm font-medium transition
                ${
                  updating
                    ? "bg-gray-300 cursor-not-allowed text-gray-500"
                    : "bg-gray-200 hover:bg-gray-300 text-gray-700"
                }`}
            >
              {updating ? "..." : "Thêm vào giỏ"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
