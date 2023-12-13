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
                    borderWidth: `calc(${size} * 0.2)`,
                }}
            ></div>
            {text && <span>{text}</span>}
        </div>
    );
}
