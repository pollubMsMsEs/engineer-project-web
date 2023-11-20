import React from "react";
import LoadingDisplay from "../loadingDisplay/LoadingDisplay";
import styles from "./reportContainer.module.scss";

export default function ReportContainer({
    title,
    value,
    children,
}: React.PropsWithChildren<{
    title: string;
    value: any | undefined;
}>) {
    return (
        <div className={styles["report-container"]}>
            {value ? (
                <>
                    <div>{title}</div>
                    <div>{children}</div>
                </>
            ) : (
                <LoadingDisplay size="30px" />
            )}
        </div>
    );
}
