import { notFound } from "next/navigation";
import Product, { IProduct } from "@/models/Product";
import { dbConnect } from "@/lib/db";

type Props = {
  params: { id: string };
};

export default async function ProductDetailPage({ params }: Props) {
  const { id } = await params;

  await dbConnect();

  const product = (await Product.findById(id).lean()) as IProduct | null;
  if (!product) return notFound();

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold">{product.name}</h1>
      {product.image && (
        <img
          src={product.image}
          alt={product.name}
          className="w-full max-h-[400px] object-cover my-4 rounded"
        />
      )}
      <p className="text-gray-600">{product.description}</p>
      <p className="text-green-700 font-semibold text-xl mt-4">
        {Number(product.price).toLocaleString()}₫
      </p>
    </div>
  );
}

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
//     image: "",
//   });

//   const [imageFile, setImageFile] = useState<File | null>(null);

//   // ❌ Vô hiệu hoá gọi API lấy chi tiết sản phẩm
//   // useEffect(() => {
//   //   (async () => {
//   //     const res = await fetch(`/api/products/${id}`);
//   //     const p = await res.json();
//   //     setForm({
//   //       name: p.name,
//   //       description: p.description,
//   //       price: String(p.price),
//   //       image: p.image || "",
//   //     });
//   //   })();
//   // }, [id]);

//   // ❌ Vô hiệu hoá submit
//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     alert(
//       "Tính năng cập nhật sản phẩm đang bị vô hiệu hoá để chuẩn bị deploy."
//     );
//     // const formData = new FormData();
//     // formData.append("name", form.name);
//     // formData.append("description", form.description);
//     // formData.append("price", form.price);
//     // if (imageFile) {
//     //   formData.append("image", imageFile);
//     // }

//     // await fetch(`/api/products/${id}`, {
//     //   method: "PUT",
//     //   body: formData,
//     // });

//     // router.push("/");
//     // router.refresh();
//   };

//   return (
//     <form onSubmit={handleSubmit} className="max-w-md mx-auto p-6 space-y-4">
//       <h1 className="text-xl font-bold text-red-600">
//         ⚠️ Chức năng cập nhật đang bị tạm khoá
//       </h1>

//       <input
//         type="text"
//         placeholder="Tên sản phẩm"
//         value={form.name}
//         onChange={(e) => setForm({ ...form, name: e.target.value })}
//         disabled
//         className="w-full border p-2 rounded bg-gray-100 cursor-not-allowed"
//       />

//       <textarea
//         placeholder="Mô tả"
//         value={form.description}
//         onChange={(e) => setForm({ ...form, description: e.target.value })}
//         disabled
//         className="w-full border p-2 rounded bg-gray-100 cursor-not-allowed"
//       />

//       <input
//         type="number"
//         placeholder="Giá"
//         value={form.price}
//         onChange={(e) => setForm({ ...form, price: e.target.value })}
//         disabled
//         className="w-full border p-2 rounded bg-gray-100 cursor-not-allowed"
//       />

//       <input
//         type="file"
//         accept="image/*"
//         disabled
//         className="w-full cursor-not-allowed"
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
//         disabled
//         className="bg-gray-400 text-white px-4 py-2 rounded cursor-not-allowed"
//       >
//         Đang khoá
//       </button>
//     </form>
//   );
// }

// import { notFound } from "next/navigation";
// import Product, { IProduct } from "@/models/Product";
// import { dbConnect } from "@/lib/db";

// type ProductPageProps = {
//   params: {
//     id: string;
//   };
// };

// export default async function ProductDetailPage({ params }: ProductPageProps) {
//   const { id } = params; // ✅ KHÔNG dùng await

//   await dbConnect();

//   const product = (await Product.findById(id).lean()) as IProduct | null;

//   if (!product) return notFound();

//   return (
//     <div className="max-w-4xl mx-auto p-6">
//       <h1 className="text-3xl font-bold">{product.name}</h1>
//       {product.image && (
//         <img
//           src={product.image}
//           alt={product.name}
//           className="w-full max-h-[400px] object-cover my-4 rounded"
//         />
//       )}
//       <p className="text-gray-600">{product.description}</p>
//       <p className="text-green-700 font-semibold text-xl mt-4">
//         {Number(product.price).toLocaleString()}₫
//       </p>
//     </div>
//   );
// }
