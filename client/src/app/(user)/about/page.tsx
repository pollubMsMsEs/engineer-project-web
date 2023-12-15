import Image from "next/image";
import styles from "./page.module.scss";
import igdbLogo from "@/../public/IGDB_logo.svg";
import tmdbLogo from "@/../public/TheMovieDB_logo.svg";
import openLibraryLogo from "@/../public/Open_Library_logo.svg";

export default function About() {
    return (
        <div className={styles["about"]}>
            <h2 className={styles["about__header"]}>Used APIs</h2>
            <div className={styles["about__apis-list"]}>
                <span>Books</span>
                <Image
                    src={openLibraryLogo}
                    alt="openLibraryLogo"
                    height={60}
                />

                <span>Movies</span>
                <Image src={tmdbLogo} alt="tmdbLogo" height={60} />

                <span>Games</span>
                <Image src={igdbLogo} alt="igdbLogo" height={60} />
            </div>
            <h2 className={styles["about__header"]}>Legal notice</h2>
            <span>
                This product uses the TMDB API but is not endorsed or certified
                by TMDB.
            </span>
        </div>
    );
}
