"use client";

import { Movie } from "@/types/movieType";
import { useState } from "react";
import React from "react";
import Link from "next/link";

async function deleteMovie(_id: string) {
    const response = await fetch(`/api/work/${_id}`, {
        method: "DELETE",
    });
    const result = await response.json();

    return result;
}

export default function MovieList({ movies }: { movies: Movie[] }) {
    const [movieList, setMovieList] = useState(movies);

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
                        <a href={`/work/${movie._id}`}>
                            <button>Details</button>
                        </a>
                        <Link href={`/work/${movie._id}/edit`} prefetch={false}>
                            <button>Edit</button>
                        </Link>

                        <button
                            onClick={() => {
                                deleteMovieHandler(movie._id!);
                            }}
                        >
                            Delete
                        </button>
                    </td>
                </tr>
            ))}
        </tbody>
    );
}
