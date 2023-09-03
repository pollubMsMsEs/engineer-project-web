import { cookies } from "next/headers";

export async function fetchAPIFromServerComponent(url: string) {
    return fetch(`${process.env.API_ADDRESS}${url}`, {
        headers: {
            Authorization: `Bearer ${cookies().get("jwt")?.value}`,
        },
    });
}
