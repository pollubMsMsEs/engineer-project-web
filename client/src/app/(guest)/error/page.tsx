import React from "react";
import TryAgainButton from "./TryAgainButton";
import styles from "./page.module.scss";

export default function Error() {
    return (
        <div className={styles["error-page"]}>
            <h2>Server is not responding</h2>
            <TryAgainButton />
        </div>
    );
}
