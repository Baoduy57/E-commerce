import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import Product from "@/models/Product";
import formidable, { Fields, Files } from "formidable";
import { toNodeReadable } from "@/lib/toNodeReadable";
import cloudinary from "@/lib/cloudinary";

// 👇 Interface cho context
interface RouteContext {
  params: {
    id: string;
  };
}

/* ---------- GET /api/products/[id] ---------- */
export async function GET(_req: NextRequest, context: RouteContext) {
  await dbConnect();

  const { id } = context.params;

  const product = await Product.findById(id).lean();

  if (!product) {
    return NextResponse.json(
      { message: "Không tìm thấy sản phẩm" },
      { status: 404 }
    );
  }

  return NextResponse.json(product);
}

/* ---------- PUT /api/products/[id] ---------- */
export async function PUT(req: NextRequest, context: RouteContext) {
  await dbConnect();

  const { id } = context.params;

  const form = formidable({ keepExtensions: true });
  const { fields, files } = await new Promise<{ fields: Fields; files: Files }>(
    (res, rej) =>
      form.parse(toNodeReadable(req) as any, (err, flds, fls) =>
        err ? rej(err) : res({ fields: flds, files: fls })
      )
  );

  let imagePath: string | undefined;
  if (files.image) {
    const file = Array.isArray(files.image) ? files.image[0] : files.image;
    const uploadResult = await cloudinary.uploader.upload(file.filepath, {
      folder: "products",
    });
    imagePath = uploadResult.secure_url;
  }

  const updated = await Product.findByIdAndUpdate(
    id,
    {
      name: fields.name?.[0],
      description: fields.description?.[0],
      price: Number(fields.price?.[0]),
      ...(imagePath && { image: imagePath }),
    },
    { new: true }
  );

  return NextResponse.json(updated);
}

/* ---------- DELETE /api/products/[id] ---------- */
export async function DELETE(_req: NextRequest, context: RouteContext) {
  await dbConnect();

  const { id } = context.params;

  const deleted = await Product.findByIdAndDelete(id);

  if (!deleted) {
    return NextResponse.json(
      { message: "Không tìm thấy sản phẩm để xoá" },
      { status: 404 }
    );
  }

  return NextResponse.json({ message: "Xoá sản phẩm thành công", deleted });
}
