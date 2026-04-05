import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

const locales = ["fr", "en"];
const defaultLocale = "fr";

function getLocaleFromRequest(request: NextRequest): string {
  // 1. Cookie preference
  const cookieLocale = request.cookies.get("NEXT_LOCALE")?.value;
  if (cookieLocale && locales.includes(cookieLocale)) return cookieLocale;

  // 2. Accept-Language header
  const acceptLang = request.headers.get("accept-language") || "";
  for (const lang of acceptLang.split(",")) {
    const code = lang.split(";")[0].trim().substring(0, 2).toLowerCase();
    if (locales.includes(code)) return code;
  }

  return defaultLocale;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip internals, assets, api, admin
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/brian") ||
    pathname.includes(".") // files like favicon.svg, manifest.json
  ) {
    // Keep admin auth protection
    if (
      pathname.startsWith("/brian/biendou/admin") &&
      pathname !== "/brian/biendou/admin/login"
    ) {
      return handleAdminAuth(request);
    }
    return NextResponse.next();
  }

  // Check if locale is already in the path
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (!pathnameHasLocale) {
    // Redirect to locale-prefixed URL
    const locale = getLocaleFromRequest(request);
    const newUrl = new URL(`/${locale}${pathname}`, request.url);
    newUrl.search = request.nextUrl.search;
    return NextResponse.redirect(newUrl);
  }

  return NextResponse.next();
}

async function handleAdminAuth(request: NextRequest) {
  const response = NextResponse.next();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.redirect(
      new URL("/brian/biendou/admin/login", request.url)
    );
  }

  return response;
}

export const config = {
  matcher: [
    // Match all paths except _next/static, _next/image, favicon
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
