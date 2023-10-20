"use client";
import { useSearchParams } from "next/navigation";
import React, { useRef, useState } from "react";
import styles from "./page.module.scss";
import Icon from "@mdi/react";
import { mdiPlus } from "@mdi/js";
import Link from "next/link";
import { WorkType } from "@/types/types";
import { searchWorks } from "@/modules/apiBrowser";

function assertCorrectType(type: any, defaultType: WorkType = "book") {
    if (type === "book" || type === "movie" || type === "game") {
        return type;
    } else {
        return defaultType;
    }
}

export default function Search() {
    const searchParams = useSearchParams();
    const [type, setType] = useState<WorkType>(() => {
        return assertCorrectType(searchParams.get("type"));
    });
    const [query, setQuery] = useState("");
    const [foundWorks, setFoundWorks] = useState([]);
    const searchDebounce = useRef<NodeJS.Timeout>();

    return (
        <div className={styles["search"]}>
            <div className={styles["search__form"]}>
                <input
                    className={styles["search__input"]}
                    type="text"
                    value={query}
                    onChange={(e) => {
                        setQuery(e.target.value);

                        if (searchDebounce.current != undefined) {
                            clearTimeout(searchDebounce.current);
                        }

                        searchDebounce.current = setTimeout(() => {
                            setFoundWorks(searchWorks(e.target.value, type));
                        }, 1000);
                    }}
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
                    href={{
                        pathname: "/me/work/create",
                        query: {
                            type,
                        },
                    }}
                    className={styles["search__add-manualy"]}
                >
                    <Icon path={mdiPlus} size={1} /> Add manually
                </Link>
            </div>
        </div>
    );
}
