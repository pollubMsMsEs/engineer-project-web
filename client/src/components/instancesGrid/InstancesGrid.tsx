import Icon from "@mdi/react";
import styles from "./instancesGrid.module.scss";

export default function InstancesGrid({
    title,
    iconPath,
    gameIcon = false,
    children,
}: React.PropsWithChildren<{
    title?: string;
    iconPath?: string;
    gameIcon?: boolean;
}>) {
    let iconClassList = styles["grid__icon"];

    iconClassList += gameIcon ? ` ${styles["grid__icon--game-icon"]}` : "";

    return (
        <div className={styles["grid"]}>
            {(title || iconPath) && (
                <h2 className={styles["grid__title"]}>
                    {title && <span>{title}</span>}
                    {iconPath && (
                        <Icon className={iconClassList} path={iconPath} />
                    )}
                </h2>
            )}
            <div className={styles["grid__children"]}>{children}</div>
        </div>
    );
}
