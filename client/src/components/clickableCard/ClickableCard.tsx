import React, { useState } from "react";
import LoadingDisplay from "../loadingDisplay/LoadingDisplay";
import styles from "./clickableCard.module.scss";

export default function ClickableCard({
    children,
    onClick,
}: React.PropsWithChildren<{
    onClick: () => Promise<{ success: boolean; stopLoading: boolean }>;
}>) {
    const [isLoading, setIsLoading] = useState(false);

    return (
        <button
            className={styles["clickable-card"]}
            onClick={async () => {
                setIsLoading(true);

                const { success, stopLoading } = await onClick();

                if (!success || (success && stopLoading)) {
                    setIsLoading(false);
                }
            }}
        >
            <div className={styles["clickable-card__card"]}>{children}</div>
            {isLoading && (
                <div className={styles["clickable-card__loading"]}>
                    <LoadingDisplay size="40px" />
                </div>
            )}
        </button>
    );
}
