import Icon from "@mdi/react";
import { mdiMovieOpen } from "@mdi/js";
import styles from "./logo.module.scss";

export default function Logo() {
    return (
        <h1 className={styles["logo"]}>
            <span>Popculture Database</span>
            <Icon
                className={styles["logo__icon"]}
                path={mdiMovieOpen}
                size={"3rem"}
            />
        </h1>
    );
}
