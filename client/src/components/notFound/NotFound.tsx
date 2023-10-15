import Link from "next/link";
import styles from "./notFound.module.scss";

export default function NotFound({ text }: { text: string }) {
    return (
        <div className={styles["not-found"]}>
            <h2>Not Found</h2>
            <p>{text}</p>
            <Link href="/">Return Home</Link>
        </div>
    );
}
