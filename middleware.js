import { getToken } from "next-auth/jwt";

import { NextResponse } from "next/server";

export async function middleware(req) {
  // A Token will exist if the user has authenticated/logged in
  const token = await getToken({ req, secret: process.env.JWT_SECRET });

  const { pathname } = req.nextUrl;

  // Allow the requests if the following conditions are true:
  // 1. A request for next-auth session & provider fetching
  // 2. If the token exists

  if (pathname.includes("/api/auth") || token) {
    return NextResponse.next();
  }
  // Otherwise, redirect them to login (If not toke) and they are requesting a protected route

  if (!token && pathname !== "/login") {
    const loginUrl = new URL("/login", req.url);

    return NextResponse.redirect(loginUrl);
  }
}

export const config = {
  matcher: "/",
};
