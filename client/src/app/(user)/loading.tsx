import LoadingDisplay from "@/components/loadingDisplay/LoadingDisplay";
import styles from "./loading.module.scss";
import React from "react";

export default function Loading() {
    return (
        <div className={styles.loading}>
            <LoadingDisplay size="50px" />
        </div>
    );
}
