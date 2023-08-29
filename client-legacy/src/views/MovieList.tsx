import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Movie } from "../types/movieType";
import LoadingCircle from "../components/LoadingCircle";
import axiosClient from "../axiosClient";

async function getMovies() {
    try {
        const result = await axiosClient.get("/movie/all");
        return result.data;
    } catch (error) {
        return false;
    }
}

async function deleteMovie(_id: string) {
    try {
        const result = await axiosClient.delete<{
            acknowledged: boolean;
            deleted: Movie | null;
        }>(`/movie/${_id}`);
        console.log(result.data);
        return result.data;
    } catch (error) {
        return false;
    }
}

export default function MovieList() {
    const [movieList, setMovieList] = useState<
        { title: string; genres: string[]; _id: string }[] | undefined | false
    >(undefined);

    useEffect(() => {
        getMovies().then((movies) => {
            setMovieList(movies);
        });
    }, []);

    async function deleteMovieHandler(_id: string) {
        const result = await deleteMovie(_id);
        const deletedMovieId = result && result.deleted?._id;
        if (deletedMovieId) {
            setMovieList((previousMovies) => {
                if (!previousMovies) return;
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
                    {movieList !== undefined ? (
                        movieList !== false ? (
                            movieList.map((movie) => (
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
                            ))
                        ) : (
                            <div>Couldn't load movies</div>
                        )
                    ) : (
                        <LoadingCircle size="15px" />
                    )}
                </tbody>
            </table>
            <a href="/movie/create">
                <button style={{ width: "100%" }}>Add movie</button>
            </a>
        </>
    );
}
