import { notFound } from "next/navigation";
import Product, { IProduct } from "@/models/Product";
import { dbConnect } from "@/lib/db";
import ClientProductDetails from "./ClientProductDetails";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function ProductDetailPage({ params }: Props) {
  const { id } = await params;
  await dbConnect();

  const product = (await Product.findById(id).lean()) as IProduct | null;
  if (!product) return notFound();

  return <ClientProductDetails product={JSON.parse(JSON.stringify(product))} />;
}
