import React from "react";
import styles from "./button.module.scss";

export default function Button({
    children,
    type = "button",
    size = "medium",
    style = "normal",
    squared = false,
    round = false,
    width,
    padding,
    onClick,
}: React.PropsWithChildren<{
    type?: "submit" | "button" | "reset";
    size?: "small" | "medium" | "big" | "large";
    style?: "icon" | "normal" | "major";
    squared?: boolean;
    round?: boolean;
    width?: string;
    padding?: string;
    onClick?: () => void;
}>) {
    let className = styles["button"];

    className += ` ${styles[`button--size-${size}`]}`;
    className += ` ${styles[`button--style-${style}`]}`;
    className += squared ? ` ${styles["button--squared"]}` : "";
    className += round ? ` ${styles["button--round"]}` : "";

    return (
        <button
            style={{ padding, width }}
            type={type}
            className={className}
            onClick={onClick}
        >
            {children}
        </button>
    );
}
