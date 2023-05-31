import axios from "axios";
import React from "react";

async function getMovies() {
    try {
        const result = await axios.get("http://localhost:7777/api/movie/count");
        return result.data.count;
    } catch (error) {
        return false;
    }
}

export default function MovieList() {
    return <div>MovieList</div>;
}
