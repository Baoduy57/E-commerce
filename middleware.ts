// src/middleware.ts
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  // ⚠️ Chỉ gọi getSession() để đồng bộ cookie, KHÔNG gọi getUser()
  await supabase.auth.getSession();

  return res;
}

// ⚠️ Bao toàn bộ route (trừ static assets)
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
