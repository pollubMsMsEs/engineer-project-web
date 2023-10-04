import React, { useState } from "react";
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
    const [hovered, setHovered] = useState(false);
    const stars: any[] = [];

    for (let i = 1; i <= maxValue; i++) {
        stars.push(
            <RatingElement
                key={i}
                selected={i === value && !hovered}
                onClick={() => {
                    setValue(i);
                }}
            />
        );
    }

    stars.reverse();

    return (
        <div
            className={styles["rating-bar"]}
            onMouseEnter={() => {
                setHovered(true);
            }}
            onMouseLeave={() => {
                setHovered(false);
            }}
        >
            {stars}
        </div>
    );
}
