import React from "react";
import styles from "./page.module.scss";
import { fetchAPIFromServerComponent } from "@/modules/serverSide";
import { WorkFromAPIPopulated, WorkInstanceFromAPI } from "@/types/types";
import WorkInstanceForm from "@/components/workInstanceForm/WorkInstanceForm";
import WorkEditable from "@/components/workEditable/WorkEditable";
import DeleteWork from "@/components/deleteWorkButton/DeleteWorkButton";
import { notFound } from "next/navigation";
import Work from "@/components/work/Work";

export default async function WorkInstance({
    params,
}: {
    params: { _id: string };
}) {
    const response = await fetchAPIFromServerComponent(
        `/workInstance/${params._id}`,
        0
    );
    if (response.status === 404) {
        notFound();
    }

    const workInstance: WorkInstanceFromAPI<WorkFromAPIPopulated> = (
        await response.json()
    ).data;
    workInstance.completions = workInstance.completions.map(
        (completion) => new Date(completion)
    );
    workInstance.work_id.published_at = workInstance.work_id.published_at
        ? new Date(workInstance.work_id.published_at)
        : undefined;

    return (
        <div className={styles["work"]}>
            {workInstance.from_api ? (
                <Work work={workInstance.work_id} readOnly />
            ) : (
                <WorkEditable _work={workInstance.work_id} />
            )}

            <WorkInstanceForm workInstance={workInstance} />
            <DeleteWork workInstance={workInstance} />
        </div>
    );
}
