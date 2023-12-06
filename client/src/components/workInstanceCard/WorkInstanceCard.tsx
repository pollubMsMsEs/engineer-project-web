import { WorkInstanceFromAPI } from "@/types/types";
import Image from "next/image";
import React from "react";
import Icon from "@mdi/react";
import { mdiImageOff } from "@mdi/js";
import styles from "./workInstanceCard.module.scss";
import Link from "next/link";
import StatusSwitcher from "../statusSwitcher/StatusSwitcher";
import WorkCard from "../workCard/WorkCard";
import ImageContainer from "../imageContainer/ImageContainer";

export default function WorkInstanceCard({
    workInstance,
}: {
    workInstance: WorkInstanceFromAPI;
}) {
    const { work_id: work } = workInstance;
    let aspectRatio;

    switch (work.type) {
        case "book":
            aspectRatio = "1/1.575";
            break;
        case "movie":
            aspectRatio = "2/3";
            break;
        case "game":
            aspectRatio = "3/4";
            break;
    }

    return (
        <div className={styles["instance"]}>
            <div className={styles["instance__card"]}>
                <Link href={`/me/work/${workInstance._id}`}>
                    <ImageContainer
                        src={work.cover}
                        alt="Work cover"
                        roundedCornersTop
                        aspectRatio={aspectRatio}
                    />
                </Link>
                <StatusSwitcher workInstance={workInstance} />
            </div>

            <Link
                className={styles["instance__title"]}
                href={`/me/work/${workInstance._id}`}
            >
                {work.title}
            </Link>
        </div>
    );
}
