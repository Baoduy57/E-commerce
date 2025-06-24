import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import Cart from "@/models/Cart";

interface CartItem {
  productId:
    | {
        _id: string;
        name?: string;
        price?: number;
        image?: string;
      }
    | string;
  quantity: number;
}

export async function GET(req: NextRequest) {
  await dbConnect();
  const userId = req.headers.get("x-user-id");
  if (!userId) {
    return NextResponse.json({ error: "Missing userId" }, { status: 400 });
  }

  const cart = await Cart.findOne({ userId }).populate("items.productId");
  return NextResponse.json(cart || { items: [] });
}

export async function POST(req: NextRequest) {
  await dbConnect();
  const userId = req.headers.get("x-user-id");
  if (!userId) {
    return NextResponse.json({ error: "Missing userId" }, { status: 400 });
  }

  const { productId, quantity } = await req.json();

  if (!productId || quantity <= 0) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  let cart = await Cart.findOne({ userId });

  if (!cart) {
    cart = new Cart({ userId, items: [] });
  }

  const existingItem = cart.items.find(
    (item: CartItem) => item.productId.toString() === productId
  );

  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.items.push({ productId, quantity });
  }

  await cart.save();

  return NextResponse.json({ success: true });
}

export async function DELETE(req: NextRequest) {
  await dbConnect();
  const userId = req.headers.get("x-user-id");
  if (!userId)
    return NextResponse.json({ error: "Missing userId" }, { status: 400 });

  const { productId } = await req.json();
  await Cart.updateOne({ userId }, { $pull: { items: { productId } } });
  return NextResponse.json({ success: true });
}

export async function PUT(req: NextRequest) {
  await dbConnect();
  const userId = req.headers.get("x-user-id");
  if (!userId)
    return NextResponse.json({ error: "Missing userId" }, { status: 400 });

  const { productId, quantity } = await req.json();

  if (!productId || typeof quantity !== "number") {
    return NextResponse.json({ error: "Invalid data" }, { status: 400 });
  }

  const cart = await Cart.findOne({ userId });

  if (!cart)
    return NextResponse.json({ error: "Cart not found" }, { status: 404 });

  const item = cart.items.find(
    (i: CartItem) => i.productId.toString() === productId
  );

  if (item) {
    if (quantity <= 0) {
      cart.items = cart.items.filter(
        (i: CartItem) => i.productId.toString() !== productId
      );
    } else {
      item.quantity = quantity;
    }
  }

  await cart.save();
  return NextResponse.json(cart);
}
