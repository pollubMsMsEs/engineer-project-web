import { cookies } from "next/headers";

export async function fetchAPIFromServerComponent(
    url: string,
    revalidationPeriod = 0
) {
    return fetch(`${process.env.API_ADDRESS}${url}`, {
        next: { revalidate: revalidationPeriod },
        headers: {
            Authorization: `Bearer ${cookies().get("jwt")?.value}`,
        },
    });
}
