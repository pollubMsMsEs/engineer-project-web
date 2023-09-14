import Movie from "@/components/Movie";
import { fetchAPIFromServerComponent } from "@/modules/serverSide";
import { MovieFromAPIPopulated } from "@/types/movieType";
import React from "react";

export default async function MovieDetails({
    params,
}: {
    params: { _id: string };
}) {
    const response = await fetchAPIFromServerComponent(`/movie/${params._id}`);
    const result: MovieFromAPIPopulated = (await response.json()).data;
    result.published_at = new Date(result.published_at);

    return <Movie movie={result} />;
}
