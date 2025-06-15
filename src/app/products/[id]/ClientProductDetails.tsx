"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { IProduct } from "@/models/Product";

export default function ClientProductDetails({
  product,
}: {
  product: IProduct;
}) {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
      setLoading(false);
    };

    checkUser();
  }, []);

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
          <div className="w-full rounded-lg overflow-hidden shadow-md">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-[400px] object-cover"
            />
          </div>
        )}

        <div className="space-y-6">
          <h1 className="text-4xl font-bold text-gray-800">{product.name}</h1>
          <p className="text-gray-600 leading-relaxed text-lg">
            {product.description}
          </p>
          <div className="text-green-700 font-extrabold text-3xl">
            {Number(product.price).toLocaleString()}₫
          </div>

          <div className="flex gap-4 pt-4">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md transition text-sm font-medium">
              Mua ngay
            </button>
            <button className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-2 rounded-md transition text-sm font-medium">
              Thêm vào giỏ
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
