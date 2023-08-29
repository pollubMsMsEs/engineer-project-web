import { useEffect, useState } from "react";
import axiosClient from "../axiosClient";
import LoadedDataHolder from "../components/LoadedDataHolder";

async function getMoviesCount() {
    try {
        const result = await axiosClient.get("/movie/count");
        return result.data.count;
    } catch (error) {
        return false;
    }
}

async function getPeopleCount() {
    try {
        const result = await axiosClient.get("/person/count");
        return result.data.count;
    } catch (error) {
        return false;
    }
}

export default function Index() {
    const [moviesCount, setMoviesCount] = useState();
    const [peopleCount, setPeopleCount] = useState();

    useEffect(() => {
        getMoviesCount().then(setMoviesCount);
        getPeopleCount().then(setPeopleCount);
    }, []);

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
