import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/test/http/")) {
    const segments = pathname.split("/");
    // Path: /test/http/[status]
    // segments[0] = ""
    // segments[1] = "test"
    // segments[2] = "http"
    // segments[3] = "[status]"
    const statusStr = segments[3];
    const status = parseInt(statusStr);

    if (!isNaN(status) && status >= 100 && status <= 599) {
      return new NextResponse(
        `<html><body style="font-family: sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; background: #0f0f12; color: white;">
          <div style="text-align: center; border: 1px solid #1e293b; padding: 2rem; border-radius: 1rem; background: #1a1a1f;">
            <h1 style="font-size: 3rem; margin: 0; color: #ef4444;">HTTP ${status}</h1>
            <p style="color: #94a3b8; font-size: 1.2rem;">This is a simulated ${status} response for crawler testing.</p>
          </div>
        </body></html>`,
        {
          status: status,
          headers: { "Content-Type": "text/html" }
        }
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/test/http/:path*",
};