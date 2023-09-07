import MovieWithPeople from "@/components/MovieWithPeople";
import { fetchAPIFromServerComponent } from "@/modules/serverSide";
import { PopulatedMovieFromAPI } from "@/types/movieType";
import React from "react";

export default async function MovieDetails({
    params,
}: {
    params: { _id: string };
}) {
    const response = await fetchAPIFromServerComponent(`/movie/${params._id}`);
    const result: PopulatedMovieFromAPI = (await response.json()).data;
    result.published_at = new Date(result.published_at);

    return <MovieWithPeople movie={result} />;
}
