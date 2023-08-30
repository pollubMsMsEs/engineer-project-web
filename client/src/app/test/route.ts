import { NextRequest, NextResponse } from "next/server";

export function GET(request: NextRequest) {
    const response = NextResponse.json({});

    response.cookies.set("logged", "true");

    return response;
}
