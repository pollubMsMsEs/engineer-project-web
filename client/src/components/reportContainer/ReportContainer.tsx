import React from "react";
import LoadingDisplay from "../loadingDisplay/LoadingDisplay";
import styles from "./reportContainer.module.scss";

export default function ReportContainer({
    title,
    value,
    gridArea,
    children,
}: React.PropsWithChildren<{
    title: string;
    value: any | undefined;
    gridArea?: string;
}>) {
    return (
        <div
            className={styles["report-container"]}
            style={{ gridArea: gridArea }}
        >
            {value != null ? (
                <>
                    <div className={styles["report-container__title"]}>
                        {title}
                    </div>
                    <div>{children}</div>
                </>
            ) : (
                <LoadingDisplay size="30px" />
            )}
        </div>
    );
}
