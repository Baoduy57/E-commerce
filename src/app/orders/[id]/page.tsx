"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "react-toastify";

export default function OrderDetailsPage() {
  const { user } = useAuth();
  const params = useParams();
  const router = useRouter();
  const [order, setOrder] = useState<any>(null);

  /* ------------------ lấy đơn ------------------ */
  useEffect(() => {
    if (!user) return;
    fetch(`/api/orders/${params.id}`, { headers: { "x-user-id": user.id } })
      .then((r) => r.json())
      .then((d) => (d.error ? toast.error(d.error) : setOrder(d)));
  }, [user]);

  /* ------------------ Huỷ đơn ------------------ */
  const handleCancel = async () => {
    if (!confirm("Bạn có chắc muốn huỷ đơn hàng này?")) return;

    const res = await fetch(`/api/orders/${params.id}/set-status`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-user-id": user!.id,
      },
      body: JSON.stringify({ status: "Đã hủy" }),
    });

    const data = await res.json();
    if (res.ok) {
      toast.success("Đã huỷ đơn hàng");
      setOrder(data); // đơn đã chuyển sang "Đã hủy"
    } else toast.error(data.error || "Lỗi khi huỷ đơn hàng");
  };

  /* ------------------ Thanh toán ------------------ */
  const handlePayment = async () => {
    if (!confirm("Bạn có chắc muốn thanh toán đơn hàng này?")) return;

    const res = await fetch(`/api/orders/${params.id}/pay`, {
      method: "POST",
      headers: { "x-user-id": user!.id },
    });

    const data = await res.json();
    if (res.ok) {
      toast.success("Thanh toán thành công");
      setOrder(data.order);
    } else toast.error(data.error || "Lỗi khi thanh toán");
  };

  /* ------------------ UI ------------------ */
  if (!user)
    return <p className="p-6">Vui lòng đăng nhập để xem chi tiết đơn.</p>;
  if (!order) return <p className="p-6">Đang tải đơn hàng...</p>;

  const canPay =
    order.paymentMethod === "online" && order.status === "Chờ thanh toán";
  const canCancel = ["Chờ thanh toán", "Chờ xác nhận"].includes(order.status);

  return (
    <div className="max-w-3xl mx-auto py-10 px-6">
      <h1 className="text-2xl font-bold mb-6">
        🧾 Chi tiết đơn hàng #{order._id.slice(-6).toUpperCase()}
      </h1>

      <p className="text-sm text-gray-500 mb-2">
        Ngày đặt:{" "}
        {order.createdAt
          ? new Date(order.createdAt).toLocaleString("vi-VN")
          : "N/A"}
      </p>
      <p className="text-sm text-gray-600 mb-6">
        Phương thức thanh toán:{" "}
        <strong className="text-gray-800">
          {order.paymentMethod === "cod"
            ? "Thanh toán khi nhận hàng"
            : "Thanh toán online"}
        </strong>
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
              : order.status === "Đã thanh toán"
              ? "bg-blue-100 text-blue-700"
              : "bg-yellow-100 text-yellow-800"
          }`}
        >
          Trạng thái: {order.status}
        </span>
        <p className="text-xl font-bold text-green-700">
          Tổng cộng: {order.totalAmount.toLocaleString("vi-VN")}₫
        </p>
      </div>

      {/* Nút hành động */}
      {order.status !== "Đã hủy" && (
        <div className="mt-6 flex gap-4 justify-end">
          {canPay && (
            <button
              onClick={handlePayment}
              className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded"
            >
              Thanh toán
            </button>
          )}
          {canCancel && (
            <button
              onClick={handleCancel}
              className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded"
            >
              Huỷ đơn hàng
            </button>
          )}
        </div>
      )}
    </div>
  );
}
