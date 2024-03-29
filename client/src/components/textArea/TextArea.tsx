import React, { useState } from "react";
import styles from "./textArea.module.scss";

export default function TextArea({
    id,
    name,
    label,
    labelBehaviour = "slidingOnFocus",
    value,
    height,
    onChange,
    required = false,
}: {
    id?: string;
    name: string;
    label: string;
    labelBehaviour?: "never" | "slidingOnFocus" | "slidingOnValue" | "always";
    value: any;
    height?: string;
    onChange: (value: any) => void;
    required?: boolean;
}) {
    const [focused, setFocused] = useState(false);

    id = id ?? `i${Date.now()}`;

    let labelClassName = styles["text-area__label"];

    let displayLabel = false;

    switch (labelBehaviour) {
        case "never":
            displayLabel = false;
            break;
        case "slidingOnFocus":
            displayLabel = focused;
            break;
        case "slidingOnValue":
            displayLabel = value !== "";
            break;
        case "always":
            displayLabel = true;
            break;
    }

    labelClassName += displayLabel
        ? ` ${styles["text-area__label--active"]}`
        : "";

    return (
        <label htmlFor={id} className={styles["text-area"]}>
            <span className={labelClassName}>{label}</span>
            <textarea
                className={styles["text-area__text-area"]}
                id={id}
                name={name}
                placeholder={label}
                required={required}
                value={value}
                style={{ height: height }}
                onChange={(e) => {
                    onChange(e.target.value);
                }}
                onFocus={() => {
                    setFocused(true);
                }}
                onBlur={() => {
                    setFocused(false);
                }}
            />
        </label>
    );
}
