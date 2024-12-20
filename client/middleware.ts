import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const authToken = request.cookies.get("vn_auth_token")?.value;
  const refreshToken = request.cookies.get("vn_refresh_token")?.value;

  // Log the headers for debugging purposes
  console.log("vn_auth_token:", authToken);
  console.log("vn_refresh_token:", refreshToken);

  // Redirect to /refresh-auth if on "/" or "/dashboard" with only a refresh token (no auth token)
  if (
    (request.nextUrl.pathname === "/" || request.nextUrl.pathname.startsWith("/dashboard")) &&
    !authToken &&
    refreshToken
  ) {
    return NextResponse.redirect(new URL("/refresh-auth", request.url));
  }

  // Redirect to "/sign-up" if the user tries to access "/" without tokens
  if (request.nextUrl.pathname === "/" && (!authToken || !refreshToken)) {
    return NextResponse.redirect(new URL("/sign-up", request.url));
  }

  // Redirect from root "/" to "/dashboard" if authenticated
  if (request.nextUrl.pathname === "/" && authToken && refreshToken) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Check if the request path starts with /dashboard
  if (request.nextUrl.pathname.startsWith("/dashboard")) {
    if (!authToken || !refreshToken) {
      // Redirect to /sign-in if not authenticated
      return NextResponse.redirect(new URL("/sign-in", request.url));
    } else {
      // Allow access to /dashboard if authenticated
      return NextResponse.next();
    }
  }

  // Allow access to sign-in and sign-up pages if not authenticated
  if (
    request.nextUrl.pathname === "/sign-in" ||
    request.nextUrl.pathname === "/sign-up"
  ) {
    if (authToken && refreshToken) {
      // Redirect to /dashboard if already authenticated
      return NextResponse.redirect(new URL("/dashboard", request.url));
    } else {
      // Allow access if not authenticated
      return NextResponse.next();
    }
  }

  // Redirect to /dashboard if authenticated and accessing other pages
  if (authToken && refreshToken) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Allow access to other pages if not authenticated
  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/dashboard/:path*", "/sign-in", "/sign-up"],
};
