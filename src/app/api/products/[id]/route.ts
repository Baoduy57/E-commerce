import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import Product from "@/models/Product";
import formidable, { Fields, Files } from "formidable";
import fs from "fs";
import path from "path";
import { toNodeReadable } from "@/lib/toNodeReadable";

/* ---------- GET /api/products/[id] ---------- */
export async function GET(
  _req: NextRequest,
  context: { params: { id: string } }
) {
  await dbConnect();

  const { id } = await context.params;

  const product = await Product.findById(id).lean();
  if (!product)
    return NextResponse.json(
      { message: "Không tìm thấy sản phẩm" },
      { status: 404 }
    );

  return NextResponse.json(product);
}

/* ---------- PUT ---------- */
export async function PUT(
  req: NextRequest,
  context: { params: { id: string } }
) {
  await dbConnect();
  const { id } = context.params;

  const uploadDir = path.join(process.cwd(), "public/uploads");
  if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

  const form = formidable({ uploadDir, keepExtensions: true });
  const { fields, files } = await new Promise<{ fields: Fields; files: Files }>(
    (res, rej) =>
      form.parse(toNodeReadable(req) as any, (e, flds, fls) =>
        e ? rej(e) : res({ fields: flds, files: fls })
      )
  );

  let imagePath = "";
  if (files.image) {
    const file = Array.isArray(files.image) ? files.image[0] : files.image;
    const fileName = file.originalFilename || `uploaded_${Date.now()}`;
    fs.renameSync(file.filepath, path.join(uploadDir, fileName));
    imagePath = "/uploads/" + fileName;
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

/* ---------- DELETE ---------- */
export async function DELETE(
  _req: NextRequest,
  context: { params: { id: string } }
) {
  await dbConnect();
  const { id } = context.params;

  const deleted = await Product.findByIdAndDelete(id);
  if (!deleted)
    return NextResponse.json(
      { message: "Không tìm thấy sản phẩm để xoá" },
      { status: 404 }
    );

  return NextResponse.json({ message: "Xoá sản phẩm thành công", deleted });
}
