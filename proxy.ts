import { NextRequest, NextResponse } from "next/server";

const WAITLIST_HOME_PATH = "/wallet-waitlist";
const WAITLIST_NOTICE_PATH = "/wallet-waitlist/access-update";
const ENABLED_VALUES = new Set(["1", "true", "yes", "on"]);

function normalizePathname(pathname: string) {
  if (pathname === "/") return pathname;
  return pathname.replace(/\/+$/, "");
}

function isWaitlistAccessGateEnabled() {
  const value = process.env.NEXT_PUBLIC_WAITLIST_ACCESS_GATE?.trim().toLowerCase();
  return value ? ENABLED_VALUES.has(value) : false;
}

export function proxy(request: NextRequest) {
  if (!isWaitlistAccessGateEnabled()) {
    return NextResponse.next();
  }

  const pathname = normalizePathname(request.nextUrl.pathname);
  if (
    pathname === WAITLIST_HOME_PATH ||
    pathname === WAITLIST_NOTICE_PATH ||
    !pathname.startsWith(`${WAITLIST_HOME_PATH}/`)
  ) {
    return NextResponse.next();
  }

  const redirectUrl = request.nextUrl.clone();
  redirectUrl.pathname = WAITLIST_NOTICE_PATH;
  redirectUrl.searchParams.set("from", pathname);
  return NextResponse.redirect(redirectUrl);
}

export const config = {
  matcher: ["/wallet-waitlist/:path*"],
};
