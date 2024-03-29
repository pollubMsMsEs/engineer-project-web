import { NextRequest, NextResponse } from "next/server";

function transferHeaders(request: NextRequest, headersNames: string[]) {
    const headers = new Headers();
    headersNames.forEach((name) => {
        const value = request.headers.get(name);
        if (value) {
            headers.set(name, value);
        }
    });
    return headers;
}

async function handler(request: NextRequest) {
    const jwt = request.cookies.get("jwt")?.value;

    if (!jwt) return NextResponse.redirect(new URL("/auth/login", request.url));

    const headers = transferHeaders(request, ["Content-Type"]);

    headers.set("Authorization", `Bearer ${jwt}`);

    let body = await request.blob();

    const apiResponse = await fetch(
        `${process.env.API_ADDRESS}${request.nextUrl.pathname.replace(
            "/api",
            ""
        )}${request.nextUrl.search}`,
        {
            method: request.method,
            headers,
            body: body.size !== 0 ? body : undefined,
        }
    );

    if (apiResponse.status === 401) {
        const response = NextResponse.redirect(
            new URL("/auth/login", request.url)
        );
        response.cookies.delete("jwt");
        return response;
    }

    const json = await apiResponse.json();
    const response = NextResponse.json(json, { status: apiResponse.status });

    return response;
}

export { handler as GET, handler as POST, handler as PUT, handler as DELETE };
