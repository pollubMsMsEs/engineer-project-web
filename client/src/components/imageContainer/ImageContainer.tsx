import React from "react";
import styles from "./imageContainer.module.scss";
import Image from "next/image";
import Icon from "@mdi/react";
import { mdiImageOff } from "@mdi/js";

export default function ImageContainer({
    className,
    src,
    alt,
    width,
    height,
    aspectRatio,
    roundedCornersTop = false,
    roundedCornersBottom = false,
    zoomOnHover = false,
}: {
    className?: string;
    src?: string;
    alt: string;
    width?: string;
    height?: string;
    aspectRatio?: string;
    roundedCornersTop?: boolean;
    roundedCornersBottom?: boolean;
    zoomOnHover?: boolean;
}) {
    let containerClassList = styles["img-container"];
    containerClassList += ` ${className}`;
    containerClassList += !src ? ` ${styles["img-container--no-img"]}` : "";
    containerClassList += roundedCornersTop
        ? ` ${styles["img-container--rounded-corners-top"]}`
        : "";

    let imgClassList = styles["img-container__img"];
    imgClassList += roundedCornersTop
        ? ` ${styles["img-container__img--rounded-corners-top"]}`
        : "";
    imgClassList += roundedCornersBottom
        ? ` ${styles["img-container__img--rounded-corners-bottom"]}`
        : "";
    imgClassList += zoomOnHover ? ` ${styles["img-container__img--zoom"]}` : "";

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
