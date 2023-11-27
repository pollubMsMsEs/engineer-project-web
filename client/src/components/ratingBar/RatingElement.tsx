import React from "react";
import { Icon } from "@mdi/react";
import { mdiStar } from "@mdi/js";
import styles from "./ratingBar.module.scss";

export default function RatingElement({
    selected,
    readOnly = false,
    onClick,
}: {
    selected: boolean;
    readOnly?: boolean;
    onClick: () => void;
}) {
    return (
        <div
            className={`${styles["rating-bar__star"]} ${
                selected ? styles["rating-bar__star--selected"] : ""
            } ${!readOnly ? styles["rating-bar__star--interactable"] : ""}`}
            onClick={onClick}
        >
            <Icon path={mdiStar} size={1} />
        </div>
    );
}
