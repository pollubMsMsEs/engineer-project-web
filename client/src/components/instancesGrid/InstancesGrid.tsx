import styles from "./instancesGrid.module.scss";

export default function InstancesGrid({
    title,
    children,
}: React.PropsWithChildren<{ title?: string }>) {
    return (
        <div>
            {title && <h2>{title}</h2>}
            <div className={styles["grid"]}>{children}</div>
        </div>
    );
}
