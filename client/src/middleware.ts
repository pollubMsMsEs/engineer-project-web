import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
    const jwtCookie = request.cookies.get("jwt");
    const isOnAuthPage = request.nextUrl.pathname.startsWith("/auth");
    let isJWTValid;
    let response;

    try {
        isJWTValid =
            !!jwtCookie &&
            (
                await fetch(`${process.env.API_ADDRESS}/movie/count`, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${jwtCookie?.value}`,
                    },
                })
            ).status !== 401;
    } catch (e) {
        return NextResponse.redirect(new URL("/error", request.url));
    }

    if (!isJWTValid && !isOnAuthPage) {
        response = NextResponse.redirect(new URL("/auth/login", request.url));
        response.cookies.delete("jwt");
    } else if (isJWTValid && isOnAuthPage) {
        response = NextResponse.redirect(new URL("/", request.url));
    } else {
        response = NextResponse.next();
    }

    return response;
}

export const config = {
    matcher: ["/((?!api|error|_next/static|_next/image|favicon.ico).*)"],
};
