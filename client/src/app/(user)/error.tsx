"use client";

import { useEffect } from "react";
import styles from "./error.module.scss";
import Button from "@/components/button/Button";

export default function Error({
    error,
    reset,
}: {
    error: Error;
    reset: () => void;
}) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <div className={styles["error"]}>
            <h2 className={styles["error__header"]}>Something went wrong!</h2>
            <Button
                width="200px"
                onClick={
                    // Attempt to recover by trying to re-render the segment
                    () => reset()
                }
            >
                Try again
            </Button>
        </div>
    );
}
