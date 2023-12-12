import React, { useState } from "react";
import LoadingDisplay from "../loadingDisplay/LoadingDisplay";
import styles from "./clickableCard.module.scss";
import { waitPromise } from "@/scripts/devUtils";

export default function ClickableCard({
    children,
    onClick,
    disabled = false,
    loadingDisplay,
    disabledDisplay,
}: React.PropsWithChildren<{
    onClick: () => Promise<{
        success: boolean;
        stopLoading: boolean;
    }>;
    disabled?: boolean;
    loadingDisplay: React.ReactNode;
    disabledDisplay?: React.ReactNode;
}>) {
    const [isLoading, setIsLoading] = useState(false);

    let className = styles["clickable-card"];
    className += isLoading ? ` ${styles["clickable-card--loading"]}` : "";
    className += disabled ? ` ${styles["clickable-card--disabled"]}` : "";

    return (
        <div
            className={className}
            onClick={async () => {
                if (disabled) return;

                setIsLoading(true);

                const { success, stopLoading } = await onClick();

                if (!success || (success && stopLoading)) {
                    setIsLoading(false);
                }

                setIsLoading(false);
            }}
        >
            <div className={styles["clickable-card__card"]}>{children}</div>
            {isLoading && loadingDisplay}
            {disabled && disabledDisplay}
        </div>
    );
}
