// import { NextRequest, NextResponse } from "next/server";
// import { dbConnect } from "@/lib/db";
// import Product from "@/models/Product";
// import formidable from "formidable";
// import { toNodeReadable } from "@/lib/toNodeReadable";
// import cloudinary from "@/lib/cloudinary";

// /* ---------- GET /api/products/[id] ---------- */
// export async function GET(_req: NextRequest, { params }: any) {
//   // params: { id: string }
//   await dbConnect();

//   const { id } = await params;
//   const product = await Product.findById(id).lean();

//   if (!product) {
//     return NextResponse.json(
//       { message: "Không tìm thấy sản phẩm" },
//       { status: 404 }
//     );
//   }

//   return NextResponse.json(product);
// }

// /* ---------- PUT /api/products/[id] ---------- */
// export async function PUT(req: NextRequest, { params }: any) {
//   await dbConnect();
//   const { id } = await params;

//   const form = formidable({ keepExtensions: true });
//   const { fields, files } = await new Promise<{
//     fields: formidable.Fields;
//     files: formidable.Files;
//   }>((res, rej) =>
//     form.parse(toNodeReadable(req) as any, (err, flds, fls) =>
//       err ? rej(err) : res({ fields: flds, files: fls })
//     )
//   );

//   let imagePath: string | undefined;
//   if (files.image) {
//     const file = Array.isArray(files.image) ? files.image[0] : files.image;
//     const upload = await cloudinary.uploader.upload(file.filepath, {
//       folder: "products",
//     });
//     imagePath = upload.secure_url;
//   }

//   const updated = await Product.findByIdAndUpdate(
//     id,
//     {
//       name: fields.name?.[0],
//       description: fields.description?.[0],
//       price: Number(fields.price?.[0]),
//       ...(imagePath && { image: imagePath }),
//     },
//     { new: true }
//   );

//   return NextResponse.json(updated);
// }

// /* ---------- DELETE /api/products/[id] ---------- */
// export async function DELETE(_req: NextRequest, { params }: any) {
//   await dbConnect();
//   const { id } = await params;

//   const deleted = await Product.findByIdAndDelete(id);
//   if (!deleted) {
//     return NextResponse.json(
//       { message: "Không tìm thấy sản phẩm để xoá" },
//       { status: 404 }
//     );
//   }

//   return NextResponse.json({
//     message: "Xoá sản phẩm thành công",
//     deleted,
//   });
// }
// export {};
import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import Product from "@/models/Product";
import formidable from "formidable";
import { toNodeReadable } from "@/lib/toNodeReadable";
import cloudinary from "@/lib/cloudinary";
import { headers } from "next/headers";

export const config = {
  api: {
    bodyParser: false,
  },
};

// ✅ Helper: lấy `id` từ URL
function getIdFromUrl(req: NextRequest): string | null {
  const url = new URL(req.url);
  const segments = url.pathname.split("/");
  return segments[segments.length - 1] || null;
}

// ✅ GET /api/products/[id]
export async function GET(req: NextRequest) {
  await dbConnect();

  const id = getIdFromUrl(req);
  if (!id) {
    return NextResponse.json({ message: "Thiếu ID" }, { status: 400 });
  }

  const product = await Product.findById(id).lean();
  if (!product) {
    return NextResponse.json(
      { message: "Không tìm thấy sản phẩm" },
      { status: 404 }
    );
  }

  return NextResponse.json(product);
}

// ✅ PUT /api/products/[id]
export async function PUT(req: NextRequest) {
  await dbConnect();

  const id = getIdFromUrl(req);
  if (!id) {
    return NextResponse.json({ message: "Thiếu ID" }, { status: 400 });
  }

  const form = formidable({ keepExtensions: true });
  const stream = toNodeReadable(req);

  const { fields, files } = await new Promise<{
    fields: formidable.Fields;
    files: formidable.Files;
  }>((res, rej) => {
    form.parse(stream as any, (err, flds, fls) =>
      err ? rej(err) : res({ fields: flds, files: fls })
    );
  });

  let imagePath: string | undefined;
  if (files.image) {
    const file = Array.isArray(files.image) ? files.image[0] : files.image;
    const upload = await cloudinary.uploader.upload(file.filepath, {
      folder: "products",
    });
    imagePath = upload.secure_url;
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

// ✅ DELETE /api/products/[id]
export async function DELETE(req: NextRequest) {
  await dbConnect();

  const id = getIdFromUrl(req);
  if (!id) {
    return NextResponse.json({ message: "Thiếu ID" }, { status: 400 });
  }

  const deleted = await Product.findByIdAndDelete(id);
  if (!deleted) {
    return NextResponse.json(
      { message: "Không tìm thấy sản phẩm để xoá" },
      { status: 404 }
    );
  }

  return NextResponse.json({ message: "Xoá sản phẩm thành công", deleted });
}
