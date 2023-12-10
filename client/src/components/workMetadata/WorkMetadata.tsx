import React from "react";
import styles from "./workMetadata.module.scss";
import Icon from "@mdi/react";
import { mdiCardText } from "@mdi/js";
import { WorkFromAPIPopulated } from "@/types/types";

export default function WorkMetadata({ work }: { work: WorkFromAPIPopulated }) {
    return (
        <div className={styles["work-metadata"]}>
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                }}
            >
                <Icon path={mdiCardText} size={2} />
                <h3>Metadata</h3>
            </div>
            <div>
                {Object.entries(work.metadata).map(([key, values]) => (
                    <div key={key}>
                        <span>
                            {key.charAt(0).toUpperCase() + key.substring(1)}
                            {": "}
                        </span>
                        <span>{values[0]}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
