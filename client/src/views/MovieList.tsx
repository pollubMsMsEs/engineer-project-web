import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

async function getMovies() {
    try {
        const result = await axios.get("http://localhost:7777/api/movie/all");
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

    return (
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
                    <tr>
                        <td>{movie.title}</td>
                        <td>
                            {movie.genres.reduce((acc, genre) => {
                                return `${acc}${genre}, `;
                            }, "")}
                        </td>
                        <td>
                            <a href="/movie/asdsa">
                                <button>Details</button>
                            </a>
                            <Link
                                to={{
                                    pathname: `/movie/${movie._id}/edit`,
                                }}
                                state={movie}
                            >
                                <button>Edit</button>
                            </Link>

                            <button>Delete</button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}
