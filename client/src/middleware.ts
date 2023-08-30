import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
    console.log(request.nextUrl.href);

    const allCookies = request.cookies.getAll();
    console.log(allCookies);

    const response = NextResponse.next();
    response.cookies.set("jwt", "tescik", { httpOnly: true });

    return response;
}
