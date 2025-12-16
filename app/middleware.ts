import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export const protectedRedirectRoutes = ["login", "register"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("user_token")?.value;

  if (token && protectedRedirectRoutes.includes(pathname)) {
    const url = request.nextUrl.clone();
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: protectedRedirectRoutes,
};
