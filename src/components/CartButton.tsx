"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";

export default function CartButton() {
  const { items, fetchCart } = useCart();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const totalQty = items.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = items.reduce(
    (sum, i) => sum + i.quantity * i.productId.price,
    0
  );

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="relative text-gray-700 hover:text-blue-600 font-medium transition flex items-center gap-1"
      >
        🛒Giỏ hàng
        {totalQty > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-semibold rounded-full w-5 h-5 flex items-center justify-center">
            {totalQty}
          </span>
        )}
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
          <div className="max-h-64 overflow-y-auto p-4 space-y-3">
            {items.length === 0 ? (
              <p className="text-gray-500 text-sm">Giỏ hàng trống</p>
            ) : (
              items.map((item) => (
                <div
                  key={item.productId._id}
                  className="flex items-center gap-3"
                >
                  {item.productId.image && (
                    <img
                      src={item.productId.image}
                      alt={item.productId.name}
                      className="w-12 h-12 object-cover rounded"
                    />
                  )}
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-800 truncate">
                      {item.productId.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {item.quantity} x {item.productId.price.toLocaleString()}₫
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
          <div className="p-4 border-t border-gray-100">
            <div className="flex justify-between text-sm font-medium text-gray-700 mb-3">
              <span>Tổng cộng:</span>
              <span>{totalPrice.toLocaleString()}₫</span>
            </div>
            <Link
              href="/cart"
              className="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm transition"
            >
              Xem giỏ hàng
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
