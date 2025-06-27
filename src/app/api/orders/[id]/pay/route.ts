import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import Order from "@/models/Order";

// POST /api/orders/[id]/pay
export async function POST(req: NextRequest) {
  await dbConnect();

  const id = req.nextUrl.pathname.split("/").slice(-2)[0]; // /orders/[id]/pay
  const userId = req.headers.get("x-user-id");

  if (!userId) {
    return NextResponse.json({ error: "Missing userId" }, { status: 400 });
  }

  try {
    const order = await Order.findOne({ _id: id, userId });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    if (order.paymentMethod !== "online") {
      return NextResponse.json(
        { error: "Order is not an online payment" },
        { status: 400 }
      );
    }

    if (order.status !== "Chờ thanh toán") {
      return NextResponse.json(
        { error: "Order is not waiting for payment" },
        { status: 400 }
      );
    }

    // ✅ Cập nhật trạng thái đơn hàng
    order.status = "Đã thanh toán";
    order.paidAt = new Date();
    await order.save();

    // ✅ Populate lại
    const populated = await Order.findById(order._id).populate({
      path: "items.productId",
      select: "name image price",
    });

    return NextResponse.json({
      message: "Payment successful",
      order: populated,
    });
  } catch (error) {
    console.error("POST /api/orders/[id]/pay error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
