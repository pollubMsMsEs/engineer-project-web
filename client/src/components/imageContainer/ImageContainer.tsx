import React from "react";
import styles from "./imageContainer.module.scss";
import Image from "next/image";
import Icon from "@mdi/react";
import { mdiImageOff } from "@mdi/js";

export default function ImageContainer({
    src,
    alt,
    aspectRatio,
    roundedCornersTop = false,
}: {
    src?: string;
    alt: string;
    aspectRatio: string;
    roundedCornersTop?: boolean;
}) {
    let imgClassList = styles["img-container__img"];

    if (roundedCornersTop) {
        imgClassList = `${imgClassList} ${styles["img-container__img--rounded-corners-top"]}`;
    }

    return (
        <div
            className={styles["img-container"]}
            style={{ aspectRatio: aspectRatio }}
        >
            {src ? (
                <Image
                    className={imgClassList}
                    src={src}
                    alt={alt}
                    sizes="100%"
                    fill
                />
            ) : (
                <Icon path={mdiImageOff} />
            )}
        </div>
    );
}
