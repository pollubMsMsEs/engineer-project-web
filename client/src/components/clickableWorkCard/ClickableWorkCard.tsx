import { WorkFromAPIShort } from "@/modules/apiBrowser";
import React from "react";
import ClickableCard from "../clickableCard/ClickableCard";
import WorkCard from "../workCard/WorkCard";
import LoadingDisplay from "../loadingDisplay/LoadingDisplay";
import styles from "./clickableWorkCard.module.scss";
import { getAspectRatio } from "@/modules/ui";
import Icon from "@mdi/react";
import { mdiCheckCircle } from "@mdi/js";

export default function ClickableWorkCard({
    work,
    disabled,
    onClick,
}: {
    work: WorkFromAPIShort;
    disabled?: boolean;
    onClick: () => Promise<{
        success: boolean;
        stopLoading: boolean;
    }>;
}) {
    return (
        <ClickableCard
            disabled={work.has_instance || disabled}
            onClick={onClick}
            loadingDisplay={
                <div className={styles["clickable-work-card__overlay"]}>
                    <div
                        className={styles["clickable-work-card__loading"]}
                        style={{ aspectRatio: getAspectRatio(work.type) }}
                    >
                        <LoadingDisplay size="40px" />
                    </div>
                </div>
            }
            disabledDisplay={
                <div className={styles["clickable-work-card__overlay"]}>
                    <div
                        className={styles["clickable-work-card__owned"]}
                        style={{ aspectRatio: getAspectRatio(work.type) }}
                    >
                        {work.has_instance && (
                            <Icon path={mdiCheckCircle} size={2} />
                        )}
                    </div>
                </div>
            }
        >
            <WorkCard
                work={work}
                roundedCornersTop
                roundedCornersBottom
                zoomOnHover
            />
        </ClickableCard>
    );
}
