import React from "react";
import RatingElement from "./RatingElement";
import styles from "./ratingBar.module.scss";

export default function RatingBar({
    value,
    maxValue,
    setValue,
}: {
    value: number;
    maxValue: number;
    setValue: (value: number) => void;
}) {
    const stars: any[] = [];

    for (let i = 1; i <= maxValue; i++) {
        stars.push(
            <RatingElement
                selected={i === value}
                onClick={() => {
                    setValue(i);
                }}
            />
        );
    }

    stars.reverse();

    return <div className={styles["rating-bar"]}>{stars}</div>;
}
