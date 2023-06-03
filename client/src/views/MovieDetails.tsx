import React from "react";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Movie } from "../types/movieType";
import axios from "axios";
import LoadingCircle from "../components/LoadingCircle";

async function getMovieById(id: string) {
    try {
        const result = await axios.get(`http://localhost:7777/api/movie/${id}`);

        result.data.data.published_at = new Date(result.data.data.published_at);
        return result.data.data;
    } catch (error) {
        return false;
    }
}

export default function MovieDetails() {
    const { _id } = useParams();
    const [movie, setMovie] = useState<Movie | false | null>(null);

    useEffect(() => {
        getMovieById(_id!).then(setMovie);
    }, []);

    return (
        <div>
            {movie !== false ? (
                movie !== null ? (
                    <div>
                        <h2>{movie?.title ?? ""}</h2>
                        <div>{movie?.description ?? ""}</div>
                        <div>{movie?.published_at.toISOString() ?? ""}</div>
                        <div>
                            {movie?.genres.reduce((acc, genre) => {
                                return `${acc}${genre}, `;
                            }, "") ?? ""}
                        </div>
                    </div>
                ) : (
                    <LoadingCircle size="15px" />
                )
            ) : (
                <p>Couldn't load movie</p>
            )}
        </div>
    );
}
