import React from "react";
import styles from "./countDisplay.module.scss";
import { fetchAPIFromServerComponent } from "@/modules/serverSide";

export default async function CountDisplay({
    title,
    url,
}: {
    title: string;
    url: string;
}) {
    const response = await fetchAPIFromServerComponent(url);
    const result = await response.json();

    return (
        <span className={styles["count-display"]}>
            {title} {result.count}
        </span>
    );
}
