import { NextRequest, NextResponse } from "next/server";

function handler(request: NextRequest) {
    const response = NextResponse.redirect(new URL("/auth/login", request.url));
    response.cookies.delete("jwt");
    return response;
}

export { handler as GET };
