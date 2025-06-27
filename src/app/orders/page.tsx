"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";
import { toast } from "react-toastify";

export default function OrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  /* ---------- fetch danh sách ---------- */
  useEffect(() => {
    if (!user) return;

    const fetchOrders = async () => {
      const res = await fetch("/api/orders", {
        headers: { "x-user-id": user.id },
      });
      if (!res.ok) throw new Error("Không thể lấy đơn hàng");
      setOrders(await res.json());
      setLoading(false);
    };

    toast.promise(
      fetchOrders(),
      {
        pending: "🔄 Đang tải đơn hàng...",
        success: "✅ Lấy đơn hàng thành công!",
        error: "❌ Không thể lấy đơn",
      },
      { toastId: "orders-fetch" }
    );
  }, [user?.id]);

  /* ---------- xoá đơn đã huỷ ---------- */
  const deleteOrder = async (id: string) => {
    if (!confirm("Xoá vĩnh viễn đơn hàng này?")) return;
    const res = await fetch(`/api/orders/${id}`, {
      method: "DELETE",
      headers: { "x-user-id": user!.id },
    });
    const data = await res.json();

    if (res.ok) {
      toast.success("🗑️ Đã xoá đơn hàng");
      setOrders((prev) => prev.filter((o) => o._id !== id));
    } else {
      toast.error(data.error || "Không xoá được đơn");
    }
  };

  /* ---------- UI ---------- */
  if (!user) return <p className="p-6">Vui lòng đăng nhập để xem đơn hàng.</p>;
  if (loading)
    return (
      <p className="p-6 animate-pulse text-gray-500">Đang tải đơn hàng...</p>
    );
  if (orders.length === 0)
    return <p className="p-6">Bạn chưa có đơn hàng nào.</p>;

  return (
    <div className="max-w-5xl mx-auto py-10 px-6">
      <h1 className="text-3xl font-bold mb-8">📦 Lịch sử đơn hàng</h1>

      <div className="space-y-6">
        {orders.map((order) => (
          <div
            key={order._id}
            className="border rounded-lg p-4 bg-white shadow-sm"
          >
            {/* Header */}
            <div className="flex justify-between items-center mb-2">
              <Link
                href={`/orders/${order._id}`}
                className="text-blue-600 font-semibold hover:underline"
              >
                Xem chi tiết đơn #{order._id.slice(-6).toUpperCase()}
              </Link>
              <span className="text-sm text-gray-500">
                {new Date(order.createdAt).toLocaleString("vi-VN")}
              </span>
            </div>

            {/* Items */}
            <div className="divide-y divide-gray-100">
              {order.items.map((item: any, idx: number) => (
                <div key={idx} className="py-3 flex items-center gap-4">
                  <img
                    src={item.productId?.image || "/placeholder.png"}
                    alt={item.productId?.name || "Sản phẩm"}
                    className="w-16 h-16 object-cover border rounded bg-gray-100"
                    onError={(e) => (e.currentTarget.src = "/placeholder.png")}
                  />
                  <div className="flex-1">
                    <p className="font-medium truncate">
                      {item.productId?.name || "Sản phẩm"}
                    </p>
                    <p className="text-sm text-gray-500">
                      SL: {item.quantity} × {item.price.toLocaleString("vi-VN")}
                      ₫
                    </p>
                  </div>
                  <p className="min-w-[80px] text-right font-semibold text-green-700">
                    {(item.quantity * item.price).toLocaleString("vi-VN")}₫
                  </p>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="flex justify-between items-center pt-4 mt-4 border-t text-sm">
              {/* ----- gán màu theo status ----- */}
              {(() => {
                const cls =
                  order.status === "Đã hủy"
                    ? "bg-red-100 text-red-700"
                    : order.status === "Đã giao"
                    ? "bg-green-100 text-green-700"
                    : order.status === "Đã thanh toán"
                    ? "bg-blue-100 text-blue-700"
                    : "bg-yellow-100 text-yellow-800"; // Chờ * hay Đã đặt
                return (
                  <span
                    className={`font-semibold px-3 py-1 rounded-full ${cls}`}
                  >
                    {order.status || "Đã đặt"}
                  </span>
                );
              })()}

              {/* Nút xoá hoặc tổng tiền */}
              {order.status === "Đã hủy" ? (
                <button
                  onClick={() => deleteOrder(order._id)}
                  className="flex items-center gap-1 px-3 py-1.5 bg-red-50 text-red-600 border border-red-300 rounded-full
               hover:bg-red-100 hover:border-red-400 transition text-sm font-medium"
                >
                  <span className="text-base">🗑️</span>
                  <span>Xoá đơn</span>
                </button>
              ) : (
                <span className="text-lg font-bold text-green-700">
                  Tổng: {Number(order.totalAmount).toLocaleString("vi-VN")}₫
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
