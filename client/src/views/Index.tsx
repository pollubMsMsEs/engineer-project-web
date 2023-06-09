import { useEffect, useState } from "react";
import LoadingCircle from "../components/LoadingCircle";
import axios from "axios";

async function getMoviesCount() {
    try {
        const result = await axios.get("http://localhost:7777/api/movie/count");
        return result.data.count;
    } catch (error) {
        return false;
    }
}

export default function Index() {
    const [moviesCount, setMoviesCount] = useState();

    useEffect(() => {
        getMoviesCount().then(setMoviesCount);
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
        </div>
    );
}
