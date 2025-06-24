import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import Order from "@/models/Order";
import Cart from "@/models/Cart";

export async function POST(req: NextRequest) {
  await dbConnect();

  const userId = req.headers.get("x-user-id");
  if (!userId) {
    return NextResponse.json({ error: "Missing userId" }, { status: 400 });
  }

  const cart = await Cart.findOne({ userId }).populate("items.productId");
  if (!cart || cart.items.length === 0) {
    return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
  }

  const order = new Order({
    userId,
    items: cart.items.map((i: any) => ({
      productId: i.productId._id,
      quantity: i.quantity,
      price: i.productId.price,
    })),
    totalAmount: cart.items.reduce(
      (sum: number, i: any) => sum + i.quantity * i.productId.price,
      0
    ),
    status: "Đã đặt", // ✅ Đặt trạng thái mặc định
  });

  await order.save();
  await Cart.deleteOne({ userId });

  return NextResponse.json(order);
}

export async function GET(req: NextRequest) {
  await dbConnect();

  const userId = req.headers.get("x-user-id");
  if (!userId) {
    return NextResponse.json({ error: "Missing userId" }, { status: 400 });
  }

  try {
    const orders = await Order.find({ userId })
      .sort({ createdAt: -1 })
      .populate("items.productId"); // ✅ Lấy đầy đủ thông tin sản phẩm
    return NextResponse.json(orders);
  } catch (error) {
    console.error("GET /api/orders error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
