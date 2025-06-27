"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { useCart } from "@/context/CartContext";
import { toast } from "react-toastify";

export default function CartPage() {
  /* -------------------- state -------------------- */
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [payMethod, setPayMethod] = useState<"cod" | "online">("cod"); // 👈 phương thức
  const [placing, setPlacing] = useState(false); // loading khi đặt

  const { items, fetchCart } = useCart();
  const router = useRouter();

  /* ------------------- auth ---------------------- */
  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
      setLoading(false);
      if (data.user) fetchCart();
    })();
  }, []);

  /* ------------------ cart ops ------------------- */
  const removeFromCart = async (productId: string) => {
    if (!user) return;
    await fetch("/api/cart", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "x-user-id": user.id,
      },
      body: JSON.stringify({ productId }),
    });
    await fetchCart();
    toast.info("🗑️ Đã xoá sản phẩm khỏi giỏ");
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    if (!user) return;
    await fetch("/api/cart", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "x-user-id": user.id,
      },
      body: JSON.stringify({ productId, quantity }),
    });
    fetchCart();
  };

  /* ------------------ place order ---------------- */
  const placeOrder = async () => {
    if (!user) return;
    if (items.length === 0) return toast.error("Giỏ hàng trống!");

    setPlacing(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": user.id,
        },
        body: JSON.stringify({ paymentMethod: payMethod }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Không thể tạo đơn");

      toast.success("🎉 Đặt hàng thành công!");
      await fetchCart(); // làm trống giỏ
      router.push(`/orders/${data._id}`); // chuyển tới chi tiết đơn
    } catch (err: any) {
      toast.error(`❌ ${err.message}`);
    } finally {
      setPlacing(false);
    }
  };

  /* -------------------- render ------------------- */
  if (loading) return <p className="p-6">Đang tải...</p>;
  if (!user) return <p className="p-6">Vui lòng đăng nhập để xem giỏ hàng.</p>;

  const total = items.reduce(
    (sum, item) => sum + item.quantity * item.productId.price,
    0
  );

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold mb-6">🛒 Giỏ hàng của bạn</h1>

      {items.length === 0 ? (
        <p className="text-gray-500">Giỏ hàng của bạn đang trống.</p>
      ) : (
        <>
          {/* Danh sách sản phẩm */}
          <div className="space-y-6">
            {items.map((item) => (
              <div
                key={item.productId._id}
                className="flex items-center gap-4 p-4 border rounded-lg"
              >
                <img
                  src={item.productId.image || "/placeholder.png"}
                  alt={item.productId.name}
                  className="w-20 h-20 object-cover rounded"
                />
                <div className="flex-1">
                  <h2 className="font-semibold truncate">
                    {item.productId.name}
                  </h2>
                  <p className="text-gray-500">
                    {item.quantity} ×{" "}
                    {Number(item.productId.price).toLocaleString()}₫
                  </p>
                  <div className="flex gap-2 items-center mt-2">
                    <button
                      onClick={() =>
                        updateQuantity(
                          item.productId._id,
                          Math.max(1, item.quantity - 1)
                        )
                      }
                      disabled={item.quantity <= 1}
                      className="w-8 h-8 bg-gray-200 rounded hover:bg-gray-300 font-bold"
                    >
                      −
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      onClick={() =>
                        updateQuantity(item.productId._id, item.quantity + 1)
                      }
                      className="w-8 h-8 bg-gray-200 rounded hover:bg-gray-300 font-bold"
                    >
                      +
                    </button>
                  </div>
                </div>
                <button
                  onClick={() => removeFromCart(item.productId._id)}
                  className="text-red-600 hover:underline"
                >
                  Xoá
                </button>
              </div>
            ))}
          </div>

          {/* Chọn phương thức thanh toán */}
          <div className="mt-6 space-y-2">
            <p className="font-medium">Chọn phương thức thanh toán:</p>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                value="cod"
                checked={payMethod === "cod"}
                onChange={() => setPayMethod("cod")}
              />
              Thanh toán khi nhận hàng (COD)
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                value="online"
                checked={payMethod === "online"}
                onChange={() => setPayMethod("online")}
              />
              Thanh toán online
            </label>
          </div>

          {/* Tổng & nút đặt hàng */}
          <div className="mt-6 flex justify-between items-center">
            <p className="text-xl font-bold text-green-700">
              Tổng cộng: {total.toLocaleString()}₫
            </p>
            <button
              onClick={placeOrder}
              disabled={placing}
              className={`px-6 py-2 rounded text-white transition ${
                placing
                  ? "bg-blue-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {placing ? "Đang đặt..." : "Đặt hàng"}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
