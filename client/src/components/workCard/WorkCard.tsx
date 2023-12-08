import Image from "next/image";
import React from "react";
import ImageContainer from "../imageContainer/ImageContainer";
import styles from "./workCard.module.scss";
import { WorkType } from "@/types/types";
import { getAspectRatio } from "@/modules/ui";

export default function WorkCard({
    work,
    roundedCornersTop = false,
    roundedCornersBottom = false,
}: {
    work: { title?: string; cover?: string; type: WorkType };
    roundedCornersTop?: boolean;
    roundedCornersBottom?: boolean;
}) {
    const aspectRatio = getAspectRatio(work.type);

    let imageClassName = styles["work-card__image"];
    imageClassName += roundedCornersTop
        ? ` ${styles["work-card__image--rounded-corners-top"]}`
        : "";
    imageClassName += roundedCornersBottom
        ? ` ${styles["work-card__image--rounded-corners-bottom"]}`
        : "";

    return (
        <div className={styles["work-card"]}>
            <div className={imageClassName}>
                <ImageContainer
                    src={work.cover}
                    alt="Work cover"
                    roundedCornersTop={roundedCornersTop}
                    roundedCornersBottom={roundedCornersBottom}
                    aspectRatio={aspectRatio}
                />
            </div>
            <div className={styles["work-card__title"]}>{work.title}</div>
        </div>
    );
}
