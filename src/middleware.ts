import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("access_token")?.value;

  if (!token) {
    // Se não tiver token, redireciona para login
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

// Define em quais rotas o middleware roda
export const config = {
  matcher: ["/adm/:path*"],
};
