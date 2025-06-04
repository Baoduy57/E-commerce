// "use client";

// import Link from "next/link";
// import { useEffect, useState } from "react";
// import { IProduct } from "@/models/Product";

// export default function Home() {
//   const [products, setProducts] = useState<IProduct[]>([]);

//   const fetchProducts = async () => {
//     const res = await fetch("/api/products", { cache: "no-store" });
//     setProducts(await res.json());
//   };

//   const deleteProduct = async (id: string) => {
//     if (!confirm("Xoá sản phẩm này?")) return;
//     await fetch(`/api/products/${id}`, { method: "DELETE" });
//     fetchProducts();
//   };

//   useEffect(() => {
//     fetchProducts();
//   }, []);

//   return (
//     <div className="max-w-6xl mx-auto p-6">
//       <div className="flex justify-between items-center mb-8">
//         <h1 className="text-3xl font-bold text-gray-800">
//           🛍️ Danh sách sản phẩm
//         </h1>
//         <Link
//           href="/create"
//           className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-md transition"
//         >
//           + Thêm sản phẩm
//         </Link>
//       </div>

//       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
//         {products.map((p) => (
//           <div
//             key={p._id.toString()}
//             className="bg-white shadow rounded-lg overflow-hidden hover:shadow-lg transition"
//           >
//             <Link href={`/products/${p._id}`}>
//               <div className="cursor-pointer">
//                 {p.image && (
//                   <img
//                     src={p.image}
//                     alt={p.name}
//                     className="w-full h-56 object-cover"
//                   />
//                 )}
//                 <div className="p-4 space-y-2">
//                   <h2 className="text-xl font-semibold text-gray-800">
//                     {p.name}
//                   </h2>
//                   <p className="text-gray-600 text-sm">{p.description}</p>
//                   <p className="text-lg font-bold text-green-600">
//                     {Number(p.price).toLocaleString()}₫
//                   </p>
//                 </div>
//               </div>
//             </Link>

//             <div className="flex gap-2 px-4 pb-4">
//               <Link
//                 href={`/edit/${p._id}`}
//                 className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-1 rounded text-sm"
//               >
//                 Sửa
//               </Link>
//               <button
//                 onClick={() => deleteProduct(p._id.toString())}
//                 className="bg-red-600 hover:bg-red-700 text-white px-4 py-1 rounded text-sm"
//               >
//                 Xoá
//               </button>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { IProduct } from "@/models/Product";

export default function Home() {
  const [products, setProducts] = useState<IProduct[]>([]);

  const fetchProducts = async () => {
    const res = await fetch("/api/products", { cache: "no-store" });
    setProducts(await res.json());
  };

  // ❌ Vô hiệu hóa xoá sản phẩm tạm thời
  // const deleteProduct = async (id: string) => {
  //   if (!confirm("Xoá sản phẩm này?")) return;
  //   await fetch(`/api/products/${id}`, { method: "DELETE" });
  //   fetchProducts();
  // };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          🛍️ Danh sách sản phẩm
        </h1>
        <Link
          href="/create"
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-md transition"
        >
          + Thêm sản phẩm
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {products.map((p) => (
          <div
            key={p._id.toString()}
            className="bg-white shadow rounded-lg overflow-hidden hover:shadow-lg transition"
          >
            {/* ❌ Vô hiệu hoá xem chi tiết sản phẩm */}
            {/* <Link href={`/products/${p._id}`}> */}
            <div className="cursor-default">
              {p.image && (
                <img
                  src={p.image}
                  alt={p.name}
                  className="w-full h-56 object-cover"
                />
              )}
              <div className="p-4 space-y-2">
                <h2 className="text-xl font-semibold text-gray-800">
                  {p.name}
                </h2>
                <p className="text-gray-600 text-sm">{p.description}</p>
                <p className="text-lg font-bold text-green-600">
                  {Number(p.price).toLocaleString()}₫
                </p>
              </div>
            </div>
            {/* </Link> */}

            <div className="flex gap-2 px-4 pb-4">
              <Link
                href={`/edit/${p._id}`}
                className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-1 rounded text-sm"
              >
                Sửa
              </Link>

              {/* ❌ Nút Xoá bị disable */}
              <button
                disabled
                className="bg-gray-400 text-white px-4 py-1 rounded text-sm cursor-not-allowed"
                title="Xoá hiện đang bị vô hiệu hoá để deploy"
              >
                Xoá
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
