"use client";
import { useSearchParams } from "next/navigation";
import React, { useState } from "react";
import styles from "./page.module.scss";
import Icon from "@mdi/react";
import { mdiPlus } from "@mdi/js";
import Link from "next/link";

function assertCorrectType(
    type: any,
    defaultType: "book" | "movie" | "game" = "book"
) {
    if (type === "book" || type === "movie" || type === "game") {
        return type;
    } else {
        return defaultType;
    }
}

export default function Search() {
    const searchParams = useSearchParams();
    const [type, setType] = useState<"book" | "movie" | "game">(() => {
        return assertCorrectType(searchParams.get("type"));
    });

    return (
        <div className={styles["search"]}>
            <div className={styles["search__form"]}>
                <input
                    className={styles["search__input"]}
                    type="text"
                    onChange={() => {}}
                />
                <select
                    className={styles["search__select"]}
                    name="type"
                    id="type"
                    value={type}
                    onChange={(e) => setType(assertCorrectType(e.target.value))}
                >
                    <option value="book">Book</option>
                    <option value="movie">Movie</option>
                    <option value="game">Game</option>
                </select>
                <Link
                    href="/me/work/create"
                    className={styles["search__add-manualy"]}
                >
                    <Icon path={mdiPlus} size={1} /> Add manually
                </Link>
            </div>
        </div>
    );
}
