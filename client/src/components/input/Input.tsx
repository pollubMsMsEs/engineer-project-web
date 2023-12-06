import React, { useState } from "react";
import styles from "./input.module.scss";

export default function Input({
    id,
    type,
    name,
    placeholder,
    label,
    labelDisplay = "onFocus",
    value,
    onChange,
    required = false,
}: {
    id?: string;
    type: string;
    name: string;
    placeholder?: string;
    label: string;
    labelDisplay?: "never" | "onFocus" | "onValue" | "always";
    value: any;
    onChange: (value: any, event: React.ChangeEvent<HTMLInputElement>) => void;
    required?: boolean;
}) {
    const [focused, setFocused] = useState(false);

    id = id ?? `i${Date.now()}`;

    let labelClassName = styles["input__label"];

    let displayLabel = false;

    switch (labelDisplay) {
        case "never":
            displayLabel = false;
            break;
        case "onFocus":
            displayLabel = focused;
            break;
        case "onValue":
            displayLabel = value !== "";
            break;
        case "always":
            displayLabel = true;
            break;
    }

    labelClassName += displayLabel ? ` ${styles["input__label--active"]}` : "";

    return (
        <label htmlFor={id} className={styles["input"]}>
            <span className={labelClassName}>{label}</span>
            <input
                id={id}
                className={styles["input__input"]}
                type={type}
                name={name}
                placeholder={placeholder ?? label}
                required={required}
                value={value}
                onChange={(e) => {
                    onChange(e.target.value, e);
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
