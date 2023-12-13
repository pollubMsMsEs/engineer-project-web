import React, { useState } from "react";
import styles from "./input.module.scss";

export default function Input({
    id,
    type,
    name,
    min,
    max,
    placeholder,
    list,
    label,
    labelDisplay = "onFocus",
    value,
    className,
    onChange,
    onFocus,
    onBlur,
    required = false,
}: {
    id?: string;
    type: string;
    name: string;
    min?: string | number;
    max?: string | number;
    placeholder?: string;
    list?: string;
    label: string;
    labelDisplay?: "never" | "onFocus" | "onValue" | "always";
    value: any;
    className?: string;
    onChange: (value: any, event: React.ChangeEvent<HTMLInputElement>) => void;
    onFocus?: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onBlur?: (event: React.ChangeEvent<HTMLInputElement>) => void;
    required?: boolean;
}) {
    const [focused, setFocused] = useState(false);

    id = id ?? `i${crypto.randomUUID()}`;

    let containerClassName = styles["input"];
    containerClassName += className ? ` ${className}` : "";

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
        <label htmlFor={id} className={containerClassName}>
            <span className={labelClassName}>{label}</span>
            <input
                id={id}
                className={styles["input__input"]}
                type={type}
                name={name}
                min={min}
                max={max}
                placeholder={placeholder ?? label}
                list={list}
                required={required}
                value={value}
                onChange={(e) => {
                    onChange(e.target.value, e);
                }}
                onFocus={(e) => {
                    setFocused(true);
                    onFocus && onFocus(e);
                }}
                onBlur={(e) => {
                    setFocused(false);
                    onBlur && onBlur(e);
                }}
            />
        </label>
    );
}
