import Image from "next/image";
import React from "react";
import ImageContainer from "../imageContainer/ImageContainer";
import styles from "./workCard.module.scss";
import { WorkType } from "@/types/types";

export default function WorkCard({
    work,
    roundedCornersTop = false,
}: {
    work: { title?: string; cover?: string; type: WorkType };
    roundedCornersTop?: boolean;
}) {
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
