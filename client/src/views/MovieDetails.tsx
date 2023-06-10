import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Movie, Person, PersonInMovie } from "../types/movieType";
import axios from "axios";
import LoadingCircle from "../components/LoadingCircle";
import MovieWithPeople from "../components/MovieWithPeople";

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
    const [movie, setMovie] = useState<
        | (Movie & { people: (PersonInMovie & { person_id: Person })[] })
        | false
        | null
    >(null);

    useEffect(() => {
        getMovieById(_id ?? "").then(setMovie);
    }, [_id]);

    return (
        <div>
            {movie !== false ? (
                movie !== null ? (
                    <MovieWithPeople movie={movie} />
                ) : (
                    <LoadingCircle size="15px" />
                )
            ) : (
                <p>Couldn't load movie</p>
            )}
        </div>
    );
}
