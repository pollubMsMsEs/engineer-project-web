import { WorkInstanceFromAPI } from "@/types/types";
import Image from "next/image";
import React from "react";
import Icon from "@mdi/react";
import { mdiImageOff } from "@mdi/js";
import styles from "./workInstanceCard.module.scss";
import Link from "next/link";
import StatusSwitcher from "./StatusSwitcher";
import WorkCard from "./workCard/WorkCard";

export default function WorkInstanceCard({
    workInstance,
}: {
    workInstance: WorkInstanceFromAPI;
}) {
    return (
        <div className={styles["instance"]}>
            <Link
                className={styles["instance__link-wrapper"]}
                href={`/me/work/${workInstance._id}`}
            >
                <WorkCard work={workInstance.work_id} roundedCornersTop />
            </Link>
            <StatusSwitcher workInstance={workInstance} />
        </div>
    );
}
