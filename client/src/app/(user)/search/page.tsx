"use client";
import { useSearchParams } from "next/navigation";
import React, { useRef, useState } from "react";
import styles from "./page.module.scss";
import Icon from "@mdi/react";
import { mdiPlus } from "@mdi/js";
import Link from "next/link";
import { WorkType } from "@/types/types";
import { WorkFromAPIShort, searchWorks } from "@/modules/apiBrowser";
import LoadingCircle from "@/components/LoadingCircle";
import InstancesGrid from "@/components/InstancesGrid";
import WorkCard from "@/components/workCard/WorkCard";

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
    const [foundWorks, setFoundWorks] = useState<WorkFromAPIShort[] | false>(
        []
    );
    const [isFetching, setIsFetching] = useState(false);
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
                        setIsFetching(true);

                        if (searchDebounce.current != undefined) {
                            clearTimeout(searchDebounce.current);
                        }

                        searchDebounce.current = setTimeout(async () => {
                            setFoundWorks(
                                await searchWorks(e.target.value, type)
                            );
                            setIsFetching(false);
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
            {query !== "" && (
                <div className={styles["search__results"]}>
                    {!isFetching ? (
                        <InstancesGrid>
                            {foundWorks
                                ? foundWorks.map((work) => {
                                      return (
                                          <WorkCard
                                              key={work.api_id}
                                              work={work}
                                          />
                                      );
                                  })
                                : "Works browser is unavailable"}
                        </InstancesGrid>
                    ) : (
                        <LoadingCircle size="30px" />
                    )}
                </div>
            )}
        </div>
    );
}
