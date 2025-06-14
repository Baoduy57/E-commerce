// src/middleware.ts
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse, NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    // Trả về 401 với body rỗng (tránh lỗi JSON trong middleware)
    return new NextResponse("Unauthorized", { status: 401 });
  }

  return res;
}

export const config = {
  matcher: ["/api/products/:path*", "/api/protected/:path*"],
};
