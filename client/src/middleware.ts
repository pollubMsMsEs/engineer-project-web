import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
    const hasJWTCookie = request.cookies.has("jwt");
    const isOnAuthPage = request.nextUrl.pathname.startsWith("/auth");

    if (!hasJWTCookie && !isOnAuthPage) {
        return NextResponse.redirect(new URL("/auth/login", request.url));
    } else if (hasJWTCookie && isOnAuthPage) {
        return NextResponse.redirect(new URL("/", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
