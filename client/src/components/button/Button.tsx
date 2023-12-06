import React from "react";
import styles from "./button.module.scss";

export default function Button({
    children,
    type = "button",
    disabled = false,
    size = "medium",
    style = "normal",
    customStyle,
    squared = false,
    round = false,
    width,
    padding,
    onClick,
    dataTooltipId,
    dataTooltipContent,
}: React.PropsWithChildren<{
    type?: "submit" | "button" | "reset";
    disabled?: boolean;
    size?: "small" | "medium" | "big" | "large";
    style?: "icon" | "normal" | "major";
    customStyle?: React.CSSProperties;
    squared?: boolean;
    round?: boolean;
    width?: string;
    padding?: string;
    onClick?: () => void;
    dataTooltipId?: string;
    dataTooltipContent?: string;
}>) {
    let className = styles["button"];

    className += ` ${styles[`button--size-${size}`]}`;
    className += ` ${styles[`button--style-${style}`]}`;
    className += squared ? ` ${styles["button--squared"]}` : "";
    className += round ? ` ${styles["button--round"]}` : "";

    return (
        <button
            style={{ ...customStyle, padding, width }}
            type={type}
            disabled={disabled}
            className={className}
            onClick={onClick}
            data-tooltip-id={dataTooltipId}
            data-tooltip-content={dataTooltipContent}
        >
            {children}
        </button>
    );
}
