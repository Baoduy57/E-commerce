import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import Product from "@/models/Product";
import formidable, { Fields, Files } from "formidable";
import fs from "fs";
import path from "path";
import { toNodeReadable } from "@/lib/toNodeReadable";

export async function GET() {
  await dbConnect();
  try {
    const products = await Product.find({});
    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json({ message: "Lỗi server", error }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  await dbConnect();

  const uploadDir = path.join(process.cwd(), "public/uploads");
  if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

  const form = formidable({
    uploadDir,
    keepExtensions: true,
    maxFiles: 1,
    maxFileSize: 10 * 1024 * 1024, // 10 MB
    allowEmptyFiles: false,
  });

  // ➜ quan trọng: dùng stream thay cho req
  const stream = toNodeReadable(req);

  const { fields, files }: { fields: Fields; files: Files } = await new Promise(
    (res, rej) => {
      form.parse(stream as any, (err, flds, fls) =>
        err ? rej(err) : res({ fields: flds, files: fls })
      );
    }
  );

  /* --- xử lý file ảnh --- */
  let imagePath = "";
  if (files.image) {
    const file = Array.isArray(files.image) ? files.image[0] : files.image;
    const fileName = file.originalFilename || `uploaded_${Date.now()}`;
    const newPath = path.join(uploadDir, fileName);
    fs.renameSync(file.filepath, newPath);
    imagePath = "/uploads/" + fileName;
  }

  try {
    const product = new Product({
      name: fields.name?.[0],
      description: fields.description?.[0],
      price: Number(fields.price?.[0]),
      image: imagePath,
    });
    await product.save();
    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: "Lỗi server", error }, { status: 500 });
  }
}
