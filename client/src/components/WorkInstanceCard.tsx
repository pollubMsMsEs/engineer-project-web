import { WorkInstanceFromAPI } from "@/types/types";
import Image from "next/image";
import React from "react";
import Icon from "@mdi/react";
import { mdiImageOff } from "@mdi/js";
import styles from "./workInstanceCard.module.scss";
import Link from "next/link";
import StatusSwitcher from "./StatusSwitcher";

export default function WorkInstanceCard({
    workInstance,
}: {
    workInstance: WorkInstanceFromAPI;
}) {
    const { _id, title, cover } = workInstance.work_id;

    return (
        <div className={styles["instance"]}>
            <Link
                className={styles["instance__link-wrapper"]}
                href={`/me/work/${workInstance._id}`}
            >
                <div className={styles["instance__img-container"]}>
                    {cover ? (
                        <Image
                            src={cover}
                            alt={`${title} cover`}
                            sizes="100%"
                            fill
                        />
                    ) : (
                        <Icon path={mdiImageOff} />
                    )}
                </div>
                <div>{title}</div>
            </Link>
            <StatusSwitcher workInstance={workInstance} />
        </div>
    );
}
