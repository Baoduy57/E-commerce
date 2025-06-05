import { notFound } from "next/navigation";
import Product, { IProduct } from "@/models/Product";
import { dbConnect } from "@/lib/db";

type Props = {
  params: Promise<{ id: string }>; // 👈 Đây mới đúng theo Next.js 15
};

export default async function ProductDetailPage({ params }: Props) {
  const { id } = await params; // ✅ Bắt buộc dùng await theo cảnh báo của Next

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
