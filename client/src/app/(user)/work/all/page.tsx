import { Work } from "@/types/types";
import { fetchAPIFromServerComponent } from "@/modules/serverSide";
import WorkList from "./WorkList";
import { waitPromise } from "@/scripts/devUtils";
import styles from "./page.module.scss";

export default async function WorkAll() {
    const response = await fetchAPIFromServerComponent("/work/all");
    const result = await response.json();

    return (
        <>
            <a href="/work/create">
                <button className={styles["button"]}>Add work</button>
            </a>
            <table>
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Genres</th>
                        <th>Operations</th>
                    </tr>
                </thead>
                <WorkList works={result} />
            </table>
            <a href="/work/create">
                <button className={styles["button"]}>Add work</button>
            </a>
        </>
    );
}
