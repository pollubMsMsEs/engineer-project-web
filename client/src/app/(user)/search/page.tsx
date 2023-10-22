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
import ClickableCard from "@/components/clickableCard/ClickableCard";
import { waitPromise, waitRandomPromise } from "@/scripts/devUtils";

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

    function doDebouncedSearch(query: string, type: WorkType) {
        setIsFetching(true);

        if (searchDebounce.current != undefined) {
            clearTimeout(searchDebounce.current);
        }

        searchDebounce.current = setTimeout(async () => {
            setFoundWorks(await searchWorks(query, type));
            setIsFetching(false);
        }, 1000);
    }

    return (
        <div className={styles["search"]}>
            <div className={styles["search__form"]}>
                <input
                    className={styles["search__input"]}
                    type="text"
                    value={query}
                    onChange={(e) => {
                        const newQuery = e.target.value;
                        setQuery(newQuery);
                        doDebouncedSearch(newQuery, type);
                    }}
                />
                <select
                    className={styles["search__select"]}
                    name="type"
                    id="type"
                    value={type}
                    onChange={(e) => {
                        const newType = assertCorrectType(e.target.value);
                        setType(assertCorrectType(newType));
                        doDebouncedSearch(query, newType);
                    }}
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
                                          <ClickableCard
                                              key={work.api_id}
                                              onClick={async () => {
                                                  await waitRandomPromise(2000);
                                                  return {
                                                      success: true,
                                                      stopLoading: true,
                                                  };
                                              }}
                                          >
                                              <WorkCard work={work} />
                                          </ClickableCard>
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
