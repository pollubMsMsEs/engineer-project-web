import { NextRequest, NextResponse } from "next/server";

async function handler(
    request: NextRequest,
    { params }: { params: { slug: string[] } }
) {
    console.log(request, params.slug);

    const jwt = request.cookies.get("jwt");

    return NextResponse.json({});
}

export { handler as GET, handler as POST };
