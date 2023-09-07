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

    const apiResponse = await fetch(convertParamsToURL(params.slugs), {
        method: request.method,
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwt}`,
        },
        body:
            request.method !== "GET" && request.method !== "HEAD"
                ? await request.text()
                : undefined,
    });

    if (apiResponse.status === 401) {
        const response = NextResponse.redirect(
            new URL("/auth/login", request.url)
        );
        response.cookies.delete("jwt");
        return response;
    }

    return apiResponse;
}

export { handler as GET, handler as POST, handler as PUT };
