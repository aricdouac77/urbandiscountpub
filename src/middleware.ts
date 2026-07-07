import { NextResponse, type NextRequest } from "next/server";
import { getSessionCookie } from "better-auth/cookies";
import createIntlMiddleware from "next-intl/middleware";
import { routing } from "@/i18n/routing";

// /admin lives outside the locale-prefixed tree (internal tool, French only)
// and isn't routed through next-intl at all.
// /checkout is intentionally not protected: Order.userId is optional in the
// schema to support guest checkout (lower friction, higher conversion).
const PROTECTED_SEGMENTS = ["compte", "wishlist"];

const handleI18nRouting = createIntlMiddleware(routing);

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/admin" || pathname.startsWith("/admin/")) {
    // Optimistic check only (no DB call — Edge-safe). The definitive
    // session + role verification happens server-side in the admin layout
    // via `requireAdmin` (see src/lib/auth-guards.ts).
    const sessionCookie = getSessionCookie(request);
    if (!sessionCookie) {
      return NextResponse.redirect(new URL(`/${routing.defaultLocale}/connexion`, request.url));
    }
    return NextResponse.next();
  }

  const response = handleI18nRouting(request);

  const segments = pathname.split("/").filter(Boolean);
  const firstSegment = segments[0] ?? "";
  const hasLocalePrefix = (routing.locales as readonly string[]).includes(firstSegment);
  const locale = hasLocalePrefix ? firstSegment : routing.defaultLocale;
  const pathWithoutLocale = `/${segments.slice(hasLocalePrefix ? 1 : 0).join("/")}`;

  const isProtected = PROTECTED_SEGMENTS.some(
    (segment) => pathWithoutLocale === `/${segment}` || pathWithoutLocale.startsWith(`/${segment}/`),
  );

  if (isProtected) {
    // Optimistic check only (no DB call — Edge-safe). The definitive
    // session + role verification happens server-side in each protected
    // layout via `requireUser` (see src/lib/auth-guards.ts).
    const sessionCookie = getSessionCookie(request);

    if (!sessionCookie) {
      const loginUrl = new URL(`/${locale}/connexion`, request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next|api|.*\\..*).*)"],
};
