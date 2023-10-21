import Image from "next/image";
import React from "react";
import ImageContainer from "../imageContainer/ImageContainer";
import styles from "./workCard.module.scss";

export default function WorkCard({
    work,
    roundedCornersTop = false,
}: {
    work: { title: string; cover?: string; authors?: string[] };
    roundedCornersTop?: boolean;
}) {
    return (
        <div className={styles["work-card"]}>
            <ImageContainer
                cover={work.cover}
                alt="Work cover"
                roundedCornersTop
            />
            <div className={styles["work-card__title"]}>{work.title}</div>
        </div>
    );
}
