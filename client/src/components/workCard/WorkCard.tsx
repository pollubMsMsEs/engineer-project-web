import Image from "next/image";
import React from "react";
import ImageContainer from "../imageContainer/ImageContainer";
import styles from "./workCard.module.scss";
import { WorkType } from "@/types/types";
import { getAspectRatio } from "@/modules/ui";

export default function WorkCard({
    work,
    roundedCornersTop = false,
}: {
    work: { title?: string; cover?: string; type: WorkType };
    roundedCornersTop?: boolean;
}) {
    const aspectRatio = getAspectRatio(work.type);

    return (
        <div className={styles["work-card"]}>
            <ImageContainer
                src={work.cover}
                alt="Work cover"
                roundedCornersTop
                aspectRatio={aspectRatio}
            />
            <div className={styles["work-card__title"]}>{work.title}</div>
        </div>
    );
}
