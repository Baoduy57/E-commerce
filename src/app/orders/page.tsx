"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";

export default function OrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    fetch("/api/orders", {
      headers: { "x-user-id": user.id },
    })
      .then((res) => res.json())
      .then((data) => {
        setOrders(data || []);
        setLoading(false);
      });
  }, [user]);

  if (!user) return <p className="p-6">Vui lòng đăng nhập để xem đơn hàng.</p>;
  if (loading) return <p className="p-6">Đang tải đơn hàng...</p>;
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
            <div className="flex justify-between items-center mb-2">
              <Link
                href={`/orders/${order._id}`}
                className="text-blue-600 font-semibold hover:underline"
              >
                Xem chi tiết đơn hàng #{order._id.slice(-6).toUpperCase()}
              </Link>
              <span className="text-sm text-gray-500">
                {new Date(order.createdAt).toLocaleString("vi-VN")}
              </span>
            </div>

            <div className="divide-y divide-gray-100">
              {order.items.map((item: any, index: number) => (
                <div key={index} className="py-3 flex items-center gap-4">
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
                  <p className="text-right font-semibold text-green-700 min-w-[80px]">
                    {(item.quantity * item.price).toLocaleString("vi-VN")}₫
                  </p>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center pt-4 mt-4 border-t text-sm">
              <span
                className={`font-semibold px-3 py-1 rounded-full ${
                  order.status === "Đã hủy"
                    ? "bg-red-100 text-red-700"
                    : order.status === "Đã giao"
                    ? "bg-green-100 text-green-700"
                    : "bg-yellow-100 text-yellow-800"
                }`}
              >
                {order.status || "Đã đặt"}
              </span>
              <span className="text-lg font-bold text-green-700">
                Tổng cộng: {Number(order.totalAmount).toLocaleString("vi-VN")}₫
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
