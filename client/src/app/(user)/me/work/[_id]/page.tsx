import React from "react";
import styles from "./page.module.scss";
import { fetchAPIFromServerComponent } from "@/modules/serverSide";
import { WorkFromAPIPopulated, WorkInstanceFromAPI } from "@/types/types";
import Work from "@/components/Work";
import WorkInstanceForm from "./WorkInstanceForm";
import EditableWork from "./EditableWork";
import DeleteWork from "./DeleteWork";

export default async function WorkInstance({
    params,
}: {
    params: { _id: string };
}) {
    const response = await fetchAPIFromServerComponent(
        `/workInstance/${params._id}`,
        0
    );
    const result: WorkInstanceFromAPI<WorkFromAPIPopulated> = (
        await response.json()
    ).data;
    result.viewings = result.viewings.map((completion) => new Date(completion));

    // TODO: Remove this call when API changed
    const workResponse = await fetchAPIFromServerComponent(
        `/work/${result.work_id._id}`
    );
    const work: WorkFromAPIPopulated = (await workResponse.json()).data;
    work.published_at = new Date(work.published_at);
    result.work_id = work;

    return (
        <div className={styles["work"]}>
            <EditableWork _work={work} />
            <WorkInstanceForm workInstance={result} />
            <DeleteWork workInstance={result} />
        </div>
    );
}
