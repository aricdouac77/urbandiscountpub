import { NextResponse, type NextRequest } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

// /checkout is intentionally not protected: Order.userId is optional in the
// schema to support guest checkout (lower friction, higher conversion).
const PROTECTED_PREFIXES = ["/compte", "/admin", "/wishlist"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isProtected = PROTECTED_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );

  if (!isProtected) {
    return NextResponse.next();
  }

  // Optimistic check only (no DB call — Edge-safe). The definitive
  // session + role verification happens server-side in each protected
  // layout via `requireUser`/`requireAdmin` (see src/lib/auth-guards.ts).
  const sessionCookie = getSessionCookie(request);

  if (!sessionCookie) {
    const loginUrl = new URL("/connexion", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/compte/:path*", "/admin/:path*", "/wishlist/:path*"],
};
