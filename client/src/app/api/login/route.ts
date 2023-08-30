import { NextRequest, NextResponse } from "next/server";

async function handler(request: NextRequest) {
    const response = NextResponse.redirect(new URL("/", request.url));
    response.cookies.set("jwt", "value", { httpOnly: true });

    return response;
}

export { handler as GET, handler as POST };
