import { fetchAPIFromServerComponent } from "@/modules/serverSide";
import React from "react";
import PersonList from "./PersonList";
import styles from "./page.module.scss";

export default async function PersonAll() {
    const response = await fetchAPIFromServerComponent("/person/all", 0);
    const result = await response.json();

    return (
        <>
            <a href="/person/create">
                <button className={styles["button"]}>Add person</button>
            </a>
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Nick</th>
                        <th>Surname</th>
                        <th>Operations</th>
                    </tr>
                </thead>
                <PersonList people={result} />
            </table>
            <a href="/person/create">
                <button className={styles["button"]}>Add person</button>
            </a>
        </>
    );
}
