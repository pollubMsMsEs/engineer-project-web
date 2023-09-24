import Work from "@/components/Work";
import { fetchAPIFromServerComponent } from "@/modules/serverSide";
import { WorkFromAPIPopulated } from "@/types/types";
import React from "react";

export default async function WorkDetails({
    params,
}: {
    params: { _id: string };
}) {
    const response = await fetchAPIFromServerComponent(`/work/${params._id}`);
    const result: WorkFromAPIPopulated = (await response.json()).data;
    result.published_at = new Date(result.published_at);

    return <Work work={result} />;
}
