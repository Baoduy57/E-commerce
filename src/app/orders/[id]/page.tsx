"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

export default function OrderDetailsPage() {
  const { user } = useAuth();
  const params = useParams();
  const router = useRouter();
  const [order, setOrder] = useState<any>(null);

  useEffect(() => {
    if (!user) return;
    fetch(`/api/orders/${params.id}`, {
      headers: { "x-user-id": user.id },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) return;
        setOrder(data);
      });
  }, [user]);

  const handleCancel = async () => {
    if (!confirm("Bạn có chắc muốn huỷ đơn hàng này?")) return;
    const res = await fetch(`/api/orders/${params.id}`, {
      method: "DELETE",
      headers: { "x-user-id": user.id },
    });
    if (res.ok) {
      alert("Đã huỷ đơn hàng");
      router.push("/orders");
    } else {
      alert("Lỗi khi huỷ đơn hàng");
    }
  };

  if (!user)
    return <p className="p-6">Vui lòng đăng nhập để xem chi tiết đơn.</p>;
  if (!order) return <p className="p-6">Đang tải đơn hàng...</p>;

  return (
    <div className="max-w-3xl mx-auto py-10 px-6">
      <h1 className="text-2xl font-bold mb-6">
        🧾 Chi tiết đơn hàng #{order._id.slice(-6).toUpperCase()}
      </h1>

      <p className="text-sm text-gray-500 mb-6">
        Ngày đặt:{" "}
        {order.createdAt
          ? new Date(order.createdAt).toLocaleString("vi-VN")
          : "N/A"}
      </p>

      <div className="space-y-6">
        {order.items.map((item: any, index: number) => (
          <div
            key={index}
            className="flex items-center gap-4 border rounded p-4"
          >
            <img
              src={item.productId?.image || "/placeholder.png"}
              alt={item.productId?.name || "Sản phẩm"}
              className="w-20 h-20 object-cover rounded border bg-gray-100"
              onError={(e) => {
                e.currentTarget.src = "/placeholder.png";
              }}
            />
            <div className="flex-1">
              <p className="font-semibold text-base">
                {item.productId?.name || "Tên sản phẩm"}
              </p>
              <p className="text-sm text-gray-500">
                Đơn giá: {item.price.toLocaleString("vi-VN")}₫ × {item.quantity}
              </p>
            </div>
            <p className="font-bold text-green-700 text-right">
              {(item.price * item.quantity).toLocaleString("vi-VN")}₫
            </p>
          </div>
        ))}
      </div>

      <div className="border-t pt-6 mt-6 text-right">
        <span
          className={`inline-block px-3 py-1 text-sm rounded-full font-medium mb-3 ${
            order.status === "Đã hủy"
              ? "bg-red-100 text-red-700"
              : order.status === "Đã giao"
              ? "bg-green-100 text-green-700"
              : "bg-yellow-100 text-yellow-800"
          }`}
        >
          Trạng thái: {order.status || "Đã đặt"}
        </span>
        <p className="text-xl font-bold text-green-700">
          Tổng cộng: {order.totalAmount.toLocaleString("vi-VN")}₫
        </p>
      </div>

      {order.status === "Đã đặt" && (
        <div className="mt-6 text-right">
          <button
            onClick={handleCancel}
            className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded"
          >
            Huỷ đơn hàng
          </button>
        </div>
      )}
    </div>
  );
}
