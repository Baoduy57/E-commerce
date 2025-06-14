import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import Product from "@/models/Product";
import formidable, { Fields, Files } from "formidable";
import { toNodeReadable } from "@/lib/toNodeReadable";
import cloudinary from "@/lib/cloudinary";

export const config = {
  api: { bodyParser: false },
};

// GET /api/products?page=1&limit=8&search=&filter=
export async function GET(req: NextRequest) {
  await dbConnect();

  const { searchParams } = new URL(req.url);

  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "8");
  const search = searchParams.get("search") || "";
  const filter = searchParams.get("filter") || "";

  const skip = (page - 1) * limit;

  const query: any = {};

  if (search) {
    query.name = { $regex: search, $options: "i" };
  }

  if (filter === "low") {
    query.price = { $lt: 100_000 };
  } else if (filter === "mid") {
    query.price = { $gte: 100_000, $lte: 500_000 };
  } else if (filter === "high") {
    query.price = { $gt: 500_000 };
  }

  try {
    const total = await Product.countDocuments(query);
    const products = await Product.find(query)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const hasMore = skip + products.length < total;

    return NextResponse.json({ products, hasMore, total });
  } catch (error) {
    return NextResponse.json({ message: "Lỗi server", error }, { status: 500 });
  }
}

// POST /api/products
export async function POST(req: NextRequest) {
  await dbConnect();

  const form = formidable({
    keepExtensions: true,
    maxFiles: 1,
    maxFileSize: 10 * 1024 * 1024,
    allowEmptyFiles: false,
  });

  const stream = toNodeReadable(req);
  const { fields, files }: { fields: Fields; files: Files } = await new Promise(
    (res, rej) => {
      form.parse(stream as any, (err, flds, fls) =>
        err ? rej(err) : res({ fields: flds, files: fls })
      );
    }
  );

  let imageUrl = "";
  if (files.image) {
    const file = Array.isArray(files.image) ? files.image[0] : files.image;
    const uploadResult = await cloudinary.uploader.upload(file.filepath, {
      folder: "products",
    });
    imageUrl = uploadResult.secure_url;
  }

  try {
    const product = new Product({
      name: fields.name?.[0],
      description: fields.description?.[0],
      price: Number(fields.price?.[0]),
      image: imageUrl,
    });
    await product.save();
    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: "Lỗi server", error }, { status: 500 });
  }
}
