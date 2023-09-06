import LoadingCircle from "@/components/LoadingCircle";
import styles from "./loading.module.scss";
import React from "react";

export default function Loading() {
    return (
        <div className={styles.loading}>
            <LoadingCircle size="50px" />
        </div>
    );
}
