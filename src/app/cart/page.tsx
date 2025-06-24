"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { useCart } from "@/context/CartContext";

export default function CartPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { items, fetchCart } = useCart(); // ✅ lấy dữ liệu từ context
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
      setLoading(false);
      if (data.user) {
        fetchCart(); // ✅ fetch lại cart
      }
    };
    fetchUser();
  }, []);

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
    fetchCart(); // ✅ đồng bộ lại cart sau xoá
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
    fetchCart(); // ✅ đồng bộ lại cart sau cập nhật
  };

  const placeOrder = async () => {
    if (!user) return;
    const res = await fetch("/api/orders", {
      method: "POST",
      headers: {
        "x-user-id": user.id,
      },
    });

    if (res.ok) {
      alert("Đặt hàng thành công!");
      await fetchCart(); // ✅ Đồng bộ lại cart sau khi đặt hàng
      router.push("/orders");
    } else {
      const data = await res.json();
      alert(data.error || "Lỗi khi đặt hàng.");
    }
  };

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
          <div className="space-y-6">
            {items.map((item) => (
              <div
                key={item.productId._id}
                className="flex items-center gap-4 p-4 border rounded-lg"
              >
                {item.productId.image && (
                  <img
                    src={item.productId.image}
                    alt={item.productId.name}
                    className="w-20 h-20 object-cover rounded"
                  />
                )}
                <div className="flex-1">
                  <h2 className="font-semibold">{item.productId.name}</h2>
                  <p className="text-gray-500">
                    {item.quantity} x{" "}
                    {Number(item.productId.price).toLocaleString()}₫
                  </p>
                  <div className="flex gap-2 items-center mt-2">
                    <button
                      onClick={() =>
                        updateQuantity(item.productId._id, item.quantity - 1)
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
          <div className="mt-6 flex justify-between items-center">
            <p className="text-xl font-bold text-green-700">
              Tổng cộng: {total.toLocaleString()}₫
            </p>
            <button
              onClick={placeOrder}
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
            >
              Đặt hàng
            </button>
          </div>
        </>
      )}
    </div>
  );
}
