import React from "react";
import styles from "./imageContainer.module.scss";
import Image from "next/image";
import Icon from "@mdi/react";
import { mdiImageOff } from "@mdi/js";

export default function ImageContainer({
    src,
    alt,
    width,
    height,
    aspectRatio,
    roundedCornersTop = false,
}: {
    src?: string;
    alt: string;
    width?: string;
    height?: string;
    aspectRatio?: string;
    roundedCornersTop?: boolean;
}) {
    let containerClassList = styles["img-container"];
    containerClassList += !src ? ` ${styles["img-container--border"]}` : "";
    containerClassList += roundedCornersTop
        ? ` ${styles["img-container--rounded-corners-top"]}`
        : "";

    let imgClassList = styles["img-container__img"];
    imgClassList += roundedCornersTop
        ? `${imgClassList} ${styles["img-container__img--rounded-corners-top"]}`
        : "";

    return (
        <div
            className={containerClassList}
            style={{ width, height, aspectRatio }}
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
