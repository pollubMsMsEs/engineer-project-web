import Icon from "@mdi/react";
import { mdiMovieOpen } from "@mdi/js";
import styles from "./logo.module.scss";
import Image from "next/image";
import icon from "@/../public/icon.png";

export default function Logo() {
    return (
        <h1 className={styles["logo"]}>
            <span>DigiShelf</span>
            <Image
                className={styles["logo__icon"]}
                src={icon}
                height={80}
                alt="icon"
            />
        </h1>
    );
}
