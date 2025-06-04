// "use client";

// import { useRouter, useParams } from "next/navigation";
// import { useEffect, useState } from "react";

// export default function EditProduct() {
//   const { id } = useParams<{ id: string }>();
//   const router = useRouter();

//   const [form, setForm] = useState({
//     name: "",
//     description: "",
//     price: "",
//     image: "", // url ảnh hiện tại
//   });

//   const [imageFile, setImageFile] = useState<File | null>(null);

//   useEffect(() => {
//     (async () => {
//       const res = await fetch(`/api/products/${id}`);
//       const p = await res.json();
//       setForm({
//         name: p.name,
//         description: p.description,
//         price: String(p.price),
//         image: p.image || "",
//       });
//     })();
//   }, [id]);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     const formData = new FormData();
//     formData.append("name", form.name);
//     formData.append("description", form.description);
//     formData.append("price", form.price);
//     if (imageFile) {
//       formData.append("image", imageFile);
//     }

//     await fetch(`/api/products/${id}`, {
//       method: "PUT",
//       body: formData,
//     });

//     router.push("/");
//     router.refresh();
//   };

//   return (
//     <form onSubmit={handleSubmit} className="max-w-md mx-auto p-6 space-y-4">
//       <h1 className="text-xl font-bold">Cập Nhật Sản Phẩm</h1>

//       <input
//         type="text"
//         placeholder="Tên sản phẩm"
//         value={form.name}
//         onChange={(e) => setForm({ ...form, name: e.target.value })}
//         required
//         className="w-full border p-2 rounded"
//       />

//       <textarea
//         placeholder="Mô tả"
//         value={form.description}
//         onChange={(e) => setForm({ ...form, description: e.target.value })}
//         required
//         className="w-full border p-2 rounded"
//       />

//       <input
//         type="number"
//         placeholder="Giá"
//         value={form.price}
//         onChange={(e) => setForm({ ...form, price: e.target.value })}
//         required
//         className="w-full border p-2 rounded"
//       />

//       <input
//         type="file"
//         accept="image/*"
//         onChange={(e) => {
//           const file = e.target.files?.[0];
//           if (file) setImageFile(file);
//         }}
//         className="w-full"
//       />

//       {form.image && !imageFile && (
//         <img
//           src={form.image}
//           alt="Ảnh sản phẩm"
//           className="w-32 h-32 object-cover my-2"
//         />
//       )}

//       {imageFile && (
//         <img
//           src={URL.createObjectURL(imageFile)}
//           alt="Ảnh mới"
//           className="w-32 h-32 object-cover my-2"
//         />
//       )}

//       <button
//         type="submit"
//         className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
//       >
//         Cập nhật
//       </button>
//     </form>
//   );
// }

"use client";

import { useParams } from "next/navigation";
import { useState } from "react";

export default function EditProduct() {
  const { id } = useParams<{ id: string }>();

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    image: "",
  });

  const [imageFile] = useState<File | null>(null);

  // ❌ Vô hiệu hóa API fetch & cập nhật sản phẩm
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    alert("🔒 Tính năng cập nhật sản phẩm đang bị tạm khóa để deploy.");
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-6 space-y-4">
      <h1 className="text-xl font-bold text-red-600">
        🚫 Tính năng cập nhật đang tạm khoá
      </h1>

      <input
        type="text"
        placeholder="Tên sản phẩm"
        value={form.name}
        disabled
        className="w-full border p-2 rounded bg-gray-100 cursor-not-allowed"
      />

      <textarea
        placeholder="Mô tả"
        value={form.description}
        disabled
        className="w-full border p-2 rounded bg-gray-100 cursor-not-allowed"
      />

      <input
        type="number"
        placeholder="Giá"
        value={form.price}
        disabled
        className="w-full border p-2 rounded bg-gray-100 cursor-not-allowed"
      />

      <input
        type="file"
        accept="image/*"
        disabled
        className="w-full cursor-not-allowed"
      />

      {form.image && (
        <img
          src={form.image}
          alt="Ảnh sản phẩm"
          className="w-32 h-32 object-cover my-2"
        />
      )}

      <button
        type="submit"
        disabled
        className="bg-gray-400 text-white px-4 py-2 rounded cursor-not-allowed"
      >
        Đang tạm khoá
      </button>
    </form>
  );
}
