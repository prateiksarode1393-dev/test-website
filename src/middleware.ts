import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/test/http/")) {
    const segments = pathname.split("/");
    const status = parseInt(segments[3]);

    if (!isNaN(status) && status >= 100 && status <= 599) {
      return new NextResponse(`<html><body><h1>HTTP Status ${status}</h1><p>This is a simulated ${status} response for crawler testing.</p></body></html>`, { 
        status: status,
        headers: { "Content-Type": "text/html" } 
      });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/test/http/:path*",
};