import { WorkFromAPIPopulated } from "../../types/types";
import dayjs from "dayjs";
import styles from "./workCore.module.scss";
import Icon from "@mdi/react";
import { mdiCalendar, mdiLabel } from "@mdi/js";
import Markdown from "react-markdown";
import { getAspectRatio, getTypeIcon } from "@/modules/ui";
import ImageContainer from "../imageContainer/ImageContainer";

export default function WorkCore({ work }: { work: WorkFromAPIPopulated }) {
    const icon = getTypeIcon(work.type);
    let iconClass = styles["work-core__icon"];

    iconClass += icon.big ? ` ${styles["work-core__icon--big"]}` : "";

    return (
        <div className={styles["work-core"]}>
            <h2 className={styles["work-core__title"]}>
                <Icon path={icon.path} className={iconClass} />
                <span>{work.title}</span>
            </h2>
            <ImageContainer
                className={styles["work-core__cover"]}
                src={work.cover}
                alt="Work cover"
                aspectRatio={getAspectRatio(work.type)}
            />
            <div className={styles["work-core__description"]}>
                <Markdown>{work?.description ?? ""}</Markdown>
            </div>
            <div className={styles["work-core__minor-stats"]}>
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "5px",
                    }}
                >
                    <Icon path={mdiCalendar} size={1} />
                    <span>
                        {work?.published_at
                            ? dayjs(work.published_at).format("YYYY-MM-DD")
                            : "Unknown"}
                    </span>
                </div>
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "5px",
                    }}
                >
                    <Icon path={mdiLabel} size={1} />
                    <span>
                        {work?.genres.reduce((acc, genre) => {
                            return `${acc}${genre}, `;
                        }, "") ?? ""}
                    </span>
                </div>
            </div>
        </div>
    );
}
