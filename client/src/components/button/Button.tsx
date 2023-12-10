import React from "react";
import styles from "./button.module.scss";

export default function Button({
    children,
    type = "button",
    disabled = false,
    size = "medium",
    style = "normal",
    className,
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
    style?: "icon" | "normal" | "major" | "major-gradient";
    className?: string;
    customStyle?: React.CSSProperties;
    squared?: boolean;
    round?: boolean;
    width?: string;
    padding?: string;
    onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
    dataTooltipId?: string;
    dataTooltipContent?: string;
}>) {
    let buttonClassName = styles["button"];

    buttonClassName += ` ${className}`;
    buttonClassName += ` ${styles[`button--size-${size}`]}`;
    buttonClassName += ` ${styles[`button--style-${style}`]}`;
    buttonClassName += squared ? ` ${styles["button--squared"]}` : "";
    buttonClassName += round ? ` ${styles["button--round"]}` : "";

    return (
        <button
            style={{ ...customStyle, padding, width }}
            type={type}
            disabled={disabled}
            className={buttonClassName}
            onClick={onClick}
            data-tooltip-id={dataTooltipId}
            data-tooltip-content={dataTooltipContent}
        >
            {children}
        </button>
    );
}
