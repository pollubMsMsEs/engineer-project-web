import Link from "next/link";
import React from "react";
import styles from "./addCard.module.scss";
import Icon from "@mdi/react";
import { mdiPlus } from "@mdi/js";

export default function AddCard({ workType }: { workType: string }) {
    return (
        <Link
            className={styles["add-card"]}
            href={{
                pathname: "/search",
                query: {
                    type: workType,
                },
            }}
        >
            <Icon path={mdiPlus} />
        </Link>
    );
}
