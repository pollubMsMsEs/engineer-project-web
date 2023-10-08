import { NextRequest, NextResponse } from "next/server";

function convertParamsToURL(params: string[]) {
    const reducedParams = params.reduce((acc, param) => `${acc}/${param}`, "");

    return `${process.env.API_ADDRESS}${reducedParams}`;
}

async function handler(
    request: NextRequest,
    { params }: { params: { slugs: string[] } }
) {
    const jwt = request.cookies.get("jwt")?.value;

    if (!jwt) return NextResponse.redirect(new URL("/auth/login", request.url));

    const headers = new Headers(request.headers);
    headers.set("Authorization", `Bearer ${jwt}`);
    headers.delete("content-length");

    let body = await request.blob();

    const apiResponse = await fetch(convertParamsToURL(params.slugs), {
        method: request.method,
        headers,
        body: body.size !== 0 ? body : undefined,
    });

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
