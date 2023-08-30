import Image from "next/image";
import styles from "./page.module.css";

export default async function Home() {
    const result = await fetch("https://httpbin.org/get");
    console.log(result);

    return <main className={styles.main}>MIAN</main>;
}
