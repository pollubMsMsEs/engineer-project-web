import WorkForm from "@/components/WorkForm";
import { fetchAPIFromServerComponent } from "@/modules/serverSide";
import { WorkFromAPIPopulated } from "@/types/types";
import dayjs from "dayjs";
import React from "react";

export default async function WorkEdit({
    params,
}: {
    params: { _id: string };
}) {
    const response = await fetchAPIFromServerComponent(
        `/work/${params._id}`,
        0
    );
    const work: WorkFromAPIPopulated = (await response.json()).data;
    work.published_at = new Date(work.published_at);

    return <WorkForm work={work} />;
}
