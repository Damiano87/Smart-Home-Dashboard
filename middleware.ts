import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  console.log("🔥 MIDDLEWARE HIT:", request.method, request.url);
  console.error("🔥 MIDDLEWARE ERROR LOG:", request.method, request.url);

  const response = NextResponse.next();

  return response;
}

export const config = {
  matcher: ["/(.*)"],
};
