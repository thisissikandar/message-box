import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
export { default } from "next-auth/middleware";

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  const url = request.nextUrl;

  if (token) {
    // Redirect authenticated users away from auth pages like sign-in, sign-up, etc.
    if (
      url.pathname.startsWith("/sign-in") ||
      url.pathname.startsWith("/sign-up") ||
      url.pathname.startsWith("/verify")
    ) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  } else {
    // Redirect unauthenticated users to sign-in for protected routes
    if (url.pathname.startsWith("/dashboard") || url.pathname === "/") {
      return NextResponse.redirect(new URL("/sign-in", request.url));
    }
  }

  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ["/sign-in", "/sign-up", "/", "/dashboard/:path*", "/verify/:path*"],
};
