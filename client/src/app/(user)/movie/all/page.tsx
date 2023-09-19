import { Movie } from "@/types/movieType";
import { fetchAPIFromServerComponent } from "@/modules/serverSide";
import MovieList from "./MovieList";
import { wait5secPromise } from "@/scripts/devUtils";
import styles from "./page.module.scss";

export default async function MovieAll() {
    const response = await fetchAPIFromServerComponent("/movie/all");
    const result = await response.json();

    return (
        <>
            <a href="/movie/create">
                <button className={styles["button"]}>Add movie</button>
            </a>
            <table>
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Genres</th>
                        <th>Operations</th>
                    </tr>
                </thead>
                <MovieList movies={result} />
            </table>
            <a href="/movie/create">
                <button className={styles["button"]}>Add movie</button>
            </a>
        </>
    );
}
