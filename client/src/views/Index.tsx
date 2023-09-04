import { useEffect, useState } from "react";
import LoadingCircle from "../components/LoadingCircle";
import axiosClient from "../axiosClient";

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
                Movies count:{" "}
                {moviesCount !== false
                    ? moviesCount ?? <LoadingCircle size="15px" />
                    : "-"}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                People count:{" "}
                {peopleCount !== false
                    ? peopleCount ?? <LoadingCircle size="15px" />
                    : "-"}
            </div>
        </div>
    );
}