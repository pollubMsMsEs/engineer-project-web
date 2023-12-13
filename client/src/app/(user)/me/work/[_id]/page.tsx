import React from "react";
import styles from "./page.module.scss";
import { fetchAPIFromServerComponent } from "@/modules/serverSide";
import { WorkFromAPIPopulated, WorkInstanceFromAPI } from "@/types/types";
import WorkInstanceForm from "@/components/workInstanceForm/WorkInstanceForm";
import { notFound } from "next/navigation";
import Work from "@/components/work/Work";
import { Metadata, ResolvingMetadata } from "next";

export async function generateMetadata({
    params,
}: {
    params: { _id: string };
}): Promise<Metadata> {
    const response = await fetchAPIFromServerComponent(
        `/workInstance/${params._id}`
    );
    const workInstance: WorkInstanceFromAPI<WorkFromAPIPopulated> = (
        await response.json()
    ).data;

    return {
        title: workInstance.work_id.title,
    };
}

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
            <Work work={workInstance.work_id} workInstance={workInstance} />

            <WorkInstanceForm workInstance={workInstance} />
        </div>
    );
}
