import styles from "./loadingCircle.module.scss";

export default function LoadingCircle({
    size,
    text,
}: {
    size: string;
    text?: string;
}) {
    return (
        <div
            className={styles["loading-circle"]}
            style={{
                height: size,
            }}
        >
            <div
                className={styles["loading-circle__circle"]}
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
