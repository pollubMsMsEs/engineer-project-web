import { fetchAPIFromServerComponent } from "@/modules/serverSide";
import React from "react";
import PersonList from "@/components/personList/PersonList";
import styles from "./page.module.scss";
import Button from "@/components/button/Button";

export const metadata = {
    title: "People",
};

export default async function PersonAll() {
    const response = await fetchAPIFromServerComponent("/person/all", 0);
    const result = await response.json();

    return (
        <div className={styles["people"]}>
            <a href="/person/create">
                <Button>Add person</Button>
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
        </div>
    );
}
