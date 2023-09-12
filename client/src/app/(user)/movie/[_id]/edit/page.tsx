import MovieForm from "@/components/MovieForm";
import { fetchAPIFromServerComponent } from "@/modules/serverSide";
import { PopulatedMovieFromAPI } from "@/types/movieType";
import dayjs from "dayjs";
import React from "react";

export default async function MovieEdit({
    params,
}: {
    params: { _id: string };
}) {
    const response = await fetchAPIFromServerComponent(
        `/movie/${params._id}`,
        0
    );
    const movie: PopulatedMovieFromAPI = (await response.json()).data;
    movie.published_at = new Date(movie.published_at);

    return <MovieForm movie={movie} />;
}
