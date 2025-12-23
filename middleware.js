// /middleware.js (Simplified)
import { NextResponse } from "next/server";
import { isAdmin, isSuperAdmin } from "./lib/auth-utils";

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  // SUPER_ADMIN only routes
  if (
    pathname.startsWith("/admin/team") ||
    pathname.startsWith("/admin/invite") ||
    pathname.startsWith("/api/admin/team") ||
    pathname.startsWith("/api/admin/invite")
  ) {
    const isUserSuperAdmin = await isSuperAdmin();

    if (!isUserSuperAdmin) {
      return NextResponse.redirect(new URL("/signin", request.url));
    }
  }

  // General admin routes
  if (
    pathname.startsWith("/admin") &&
    !pathname.startsWith("/admin/team") &&
    !pathname.startsWith("/admin/invite")
  ) {
    const isUserAdmin = await isAdmin();

    if (!isUserAdmin) {
      return NextResponse.redirect(new URL("/signin", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
