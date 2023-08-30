import LoadedDataHolder from "@/components/LoadedDataHolder";
import { cookies } from "next/headers";

export const revalidate = 0;

async function fetchRouteFromServer(url: string) {
    return fetch(`${process.env.API_ADDRESS}${url}`, {
        headers: {
            Authorization: `Bearer ${cookies().get("jwt")?.value}`,
        },
    });
}

async function getMoviesCount() {
    try {
        const response = await fetchRouteFromServer("/movie/count");
        const result = await response.json();
        return result.count;
    } catch (error) {
        return false;
    }
}

async function getPeopleCount() {
    try {
        const response = await fetchRouteFromServer("/person/count");
        const result = await response.json();
        return result.count;
    } catch (error) {
        return false;
    }
}

export default async function Home() {
    //console.log(headers().get("host"));

    const moviesCount = await getMoviesCount();
    const peopleCount = await getPeopleCount();

    return (
        <div>
            <aside>
                <a href="./movies"></a>
            </aside>
            <h1>Index</h1>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                Movies count: <LoadedDataHolder>{moviesCount}</LoadedDataHolder>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                People count: <LoadedDataHolder>{peopleCount}</LoadedDataHolder>
            </div>
        </div>
    );
}
