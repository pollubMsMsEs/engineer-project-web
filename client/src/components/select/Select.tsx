import { useState } from "react";
import styles from "./select.module.scss";

export default function Select({
    className,
    name,
    id,
    label,
    labelDisplay = "onHover",
    value,
    options,
    fontSize,
    onChange,
}: {
    className?: string;
    name: string;
    label: string;
    labelDisplay?:
        | "never"
        | "onHover"
        | "onFocus"
        | "onValuePresent"
        | "always";
    id: string;
    value: string;
    options: [string, string][];
    fontSize?: string;
    onChange: (value: string) => void;
}) {
    const [focused, setFocused] = useState(false);
    const [hovered, setHovered] = useState(false);

    let labelClassName = styles["select__label"];

    let displayLabel = false;

    switch (labelDisplay) {
        case "never":
            displayLabel = false;
            break;
        case "onHover":
            displayLabel = hovered;
            break;
        case "onFocus":
            displayLabel = focused;
            break;
        case "onValuePresent":
            displayLabel = value !== "";
            break;
        case "always":
            displayLabel = true;
            break;
    }

    labelClassName += displayLabel ? ` ${styles["select__label--active"]}` : "";

    return (
        <label htmlFor={id} className={styles["select"]}>
            <span className={labelClassName}>{label}</span>
            <select
                className={`${styles["select__select"]} ${className ?? ""}`}
                name={name}
                id={id}
                value={value}
                style={{
                    fontSize,
                }}
                onChange={(e) => {
                    onChange(e.target.value);
                }}
                onPointerEnter={() => {
                    setHovered(true);
                }}
                onPointerLeave={() => {
                    setHovered(false);
                }}
                onFocus={() => {
                    setFocused(true);
                }}
                onBlur={() => {
                    setFocused(false);
                }}
            >
                {options.map((option) => (
                    <option
                        key={option[0]}
                        value={option[0]}
                        className={styles["select__option"]}
                    >
                        {option[1]}
                    </option>
                ))}
            </select>
        </label>
    );
}
