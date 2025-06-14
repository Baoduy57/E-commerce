"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { IProduct } from "@/models/Product";

export default function Home() {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);

      if (user) {
        fetchProducts();
      }
    };

    getUser();
  }, []);

  useEffect(() => {
    if (user) fetchProducts();
  }, [searchTerm, page, filter]);

  const fetchProducts = async () => {
    const query = new URLSearchParams({
      search: searchTerm,
      page: String(page),
      limit: "8",
      filter,
    }).toString();

    const res = await fetch(`/api/products?${query}`, { cache: "no-store" });
    const data = await res.json();
    setProducts(data.products);
    setHasMore(data.hasMore);
  };

  const deleteProduct = async (id: string) => {
    if (!confirm("Xoá sản phẩm này?")) return;
    await fetch(`/api/products/${id}`, { method: "DELETE" });
    fetchProducts();
  };

  if (loading) return <p className="p-6">Đang kiểm tra đăng nhập...</p>;

  if (!user)
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center px-4 py-12 bg-gray-50 rounded-lg shadow-sm">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Bạn chưa đăng nhập
        </h2>
        <p className="text-gray-600 mb-6 max-w-md">
          Hãy đăng nhập để truy cập và quản lý danh sách sản phẩm của bạn.
        </p>
        <Link
          href="/login"
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded-lg transition"
        >
          Đăng nhập ngay
        </Link>
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-4xl font-bold text-gray-800">
          🛍️ Danh sách sản phẩm
        </h1>
        <Link
          href="/create"
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg shadow transition"
        >
          + Thêm sản phẩm
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <input
          type="text"
          placeholder="Tìm sản phẩm..."
          value={searchTerm}
          onChange={(e) => {
            setPage(1); // Reset về trang đầu mỗi khi search
            setSearchTerm(e.target.value);
          }}
          className="w-full sm:max-w-sm p-2 border rounded"
        />
        <select
          value={filter}
          onChange={(e) => {
            setPage(1); // Reset trang khi filter thay đổi
            setFilter(e.target.value);
          }}
          className="w-full sm:w-auto p-2 border rounded"
        >
          <option value="">Tất cả</option>
          <option value="low">Dưới 1 lốp</option>
          <option value="mid">1 - 5 lốp</option>
          <option value="high">Trên 5 lốp</option>
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {products.map((p) => (
          <div
            key={p._id.toString()}
            className="bg-white rounded-2xl shadow hover:shadow-xl transition overflow-hidden flex flex-col justify-between"
          >
            <Link href={`/products/${p._id}`} className="block">
              {p.image && (
                <img
                  src={p.image}
                  alt={p.name}
                  className="w-full h-48 object-cover rounded-t-2xl"
                />
              )}
              <div className="p-4 space-y-2">
                <h2 className="text-lg font-semibold text-gray-800 truncate">
                  {p.name}
                </h2>
                <p className="text-gray-500 text-sm line-clamp-2 h-[2.5em]">
                  {p.description}
                </p>
                <p className="text-xl font-bold text-green-600">
                  {Number(p.price).toLocaleString()}₫
                </p>
              </div>
            </Link>

            <div className="flex justify-between px-4 pb-4 gap-2">
              <Link
                href={`/edit/${p._id}`}
                className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-white text-sm py-2 rounded-lg text-center"
              >
                ✏️ Sửa
              </Link>
              <button
                onClick={() => deleteProduct(p._id.toString())}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white text-sm py-2 rounded-lg"
              >
                🗑️ Xoá
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10 flex justify-center gap-4">
        <button
          onClick={() => setPage((prev) => Math.max(1, prev - 1))}
          disabled={page === 1}
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
        >
          ← Trước
        </button>
        <span className="px-4 py-2">Trang {page}</span>
        <button
          onClick={() => setPage((prev) => prev + 1)}
          disabled={!hasMore}
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
        >
          Sau →
        </button>
      </div>
    </div>
  );
}
