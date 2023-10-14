import Link from "next/link";
import styles from "./notFound.module.scss";

export default function NotFound() {
    return (
        <div className={styles["not-found"]}>
            <h2>Not Found</h2>
            <p>Could not find requested work</p>
            <Link href="/">Return Home</Link>
        </div>
    );
}
