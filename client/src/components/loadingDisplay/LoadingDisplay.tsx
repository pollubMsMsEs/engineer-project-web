import styles from "./loadingDisplay.module.scss";

export default function LoadingDisplay({
    size,
    text,
}: {
    size: string;
    text?: string;
}) {
    return (
        <div
            className={styles["loading-display"]}
            style={{
                height: size,
            }}
        >
            <div
                className={styles["loading-display__circle"]}
                style={{
                    aspectRatio: "1 / 1",
                    height: "100%",
                    border: `calc(${size} * 0.2) solid #f3f3f3`,
                    borderTop: `calc(${size} * 0.2) solid #3498db`,
                }}
            ></div>
            {text && <span>{text}</span>}
        </div>
    );
}
