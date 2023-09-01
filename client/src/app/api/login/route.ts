import { NextRequest, NextResponse } from "next/server";

async function handler(request: NextRequest) {
    const apiResponse = await fetch(`${process.env.API_ADDRESS}/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: await request.text(),
    });

    const apiJSON = await apiResponse.json();
    const jwt = apiJSON.token;

    const response = NextResponse.json(apiJSON, { status: apiResponse.status });

    if (jwt) {
        response.cookies.set("jwt", jwt, { httpOnly: true });
    }

    return response;
}

export { handler as GET, handler as POST };
