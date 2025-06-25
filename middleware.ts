import { getToken } from "next-auth/jwt";
import { NextResponse, NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  // Only protect non-GET requests
  if (req.method !== "GET") {
    const token = await getToken({ req });
    if (!token) {
      const loginUrl = new URL("/login", req.url);
      return NextResponse.redirect(loginUrl);
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/api/models",
    "/api/logs"
  ],
}; 