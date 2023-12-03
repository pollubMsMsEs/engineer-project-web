import styles from "./instancesGrid.module.scss";

export default function InstancesGrid({
    title,
    children,
}: React.PropsWithChildren<{ title?: string }>) {
    return (
        <div className={styles["grid"]}>
            {title && <h2 className={styles["grid__title"]}>{title}</h2>}
            <div className={styles["grid__children"]}>{children}</div>
        </div>
    );
}
