import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Movie } from "../types/movieType";

async function getMovies() {
    try {
        const result = await axios.get("http://localhost:7777/api/movie/all");
        return result.data;
    } catch (error) {
        return false;
    }
}

async function deleteMovie(_id: string) {
    try {
        const result = await axios.delete<{
            acknowledged: boolean;
            deleted: Movie | null;
        }>(`http://localhost:7777/api/movie/${_id}`);
        console.log(result.data);
        return result.data;
    } catch (error) {
        return false;
    }
}

export default function MovieList() {
    const [movieList, setMovieList] = useState<
        { title: string; genres: string[]; _id: string }[]
    >([]);

    useEffect(() => {
        getMovies().then((movies) => {
            setMovieList(movies);
        });

        //document.title = "Sdafasdf"; Interesting
    }, []);

    async function deleteMovieHandler(_id: string) {
        const result = await deleteMovie(_id);
        const deletedMovieId = result && result.deleted?._id;
        if (deletedMovieId) {
            setMovieList((previousMovies) => {
                return previousMovies.filter((m) => m._id !== deletedMovieId);
            });
        }
    }

    return (
        <>
            <a href="/movie/create">
                <button style={{ width: "100%" }}>Add movie</button>
            </a>
            <table>
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Genres</th>
                        <th>Operations</th>
                    </tr>
                </thead>
                <tbody>
                    {movieList.map((movie) => (
                        <tr key={movie._id}>
                            <td>{movie.title}</td>
                            <td>
                                {movie.genres.reduce((acc, genre) => {
                                    return `${acc}${genre}, `;
                                }, "")}
                            </td>
                            <td>
                                <a href={`/movie/${movie._id}`}>
                                    <button>Details</button>
                                </a>
                                <Link
                                    to={{
                                        pathname: `/movie/${movie._id}/edit`,
                                    }}
                                >
                                    <button>Edit</button>
                                </Link>

                                <button
                                    onClick={() => {
                                        deleteMovieHandler(movie._id);
                                    }}
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <a href="/movie/create">
                <button style={{ width: "100%" }}>Add movie</button>
            </a>
        </>
    );
}
