import { notFound } from "next/navigation";
import { fetchAPIFromServerComponent } from "@/modules/serverSide";
import { WorkFromAPIPopulated } from "@/types/types";
import React from "react";
import EditableWork from "../../me/work/[_id]/EditableWork";

export default async function WorkDetails({
    params,
}: {
    params: { _id: string };
}) {
    const response = await fetchAPIFromServerComponent(`/work/${params._id}`);
    if (response.status === 404) {
        notFound();
    }

    const result: WorkFromAPIPopulated = (await response.json()).data;
    result.published_at = new Date(result.published_at);

    return <EditableWork _work={result} />;
}
