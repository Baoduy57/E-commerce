// app/api/orders/[id]/set-status/route.ts

import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import Order from "@/models/Order";

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const id = req.nextUrl.pathname.split("/").slice(-2)[0];
    const { status, paymentMethod = "cod" } = await req.json();
    const userId = req.headers.get("x-user-id");

    if (!userId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }

    const order = await Order.findOneAndUpdate(
      { _id: id, userId },
      {
        status,
        paymentMethod,
        ...(status === "Đã thanh toán" && { paidAt: new Date() }),
      },
      { new: true }
    ).populate("items.productId");

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json(order);
  } catch (err: any) {
    console.error("Error in /api/orders/[id]/set-status:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
