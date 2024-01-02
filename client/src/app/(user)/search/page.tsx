"use client";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import styles from "./page.module.scss";
import { mdiPlusThick } from "@mdi/js";
import { WorkType } from "@/types/types";
import { WorkFromAPIShort, searchWorks } from "@/modules/apiBrowser";
import LoadingDisplay from "@/components/loadingDisplay/LoadingDisplay";
import InstancesGrid from "@/components/instancesGrid/InstancesGrid";
import { DEFAULT_WORK_INSTANCE, TYPES } from "@/constantValues";
import { handleResponseErrorWithToast } from "@/modules/errorsHandling";
import Select from "@/components/select/Select";
import NavLink from "@/components/navLink/NavLink";
import Input from "@/components/input/Input";
import ClickableWorkCard from "@/components/clickableWorkCard/ClickableWorkCard";

export default function Search() {
    const paginationEarlyTriggerDistance = 300;
    const router = useRouter();
    const searchParams = useSearchParams();
    const [type, setType] = useState<WorkType>(() => {
        return (searchParams.get("type") as WorkType) ?? "book";
    });
    const [query, setQuery] = useState("");
    const [foundWorks, setFoundWorks] = useState<WorkFromAPIShort[] | false>(
        []
    );
    const [isFetching, setIsFetching] = useState(false);
    const [fetchedAll, setFetchedAll] = useState(false);
    const [worksPage, setWorksPage] = useState(2);
    const searchDebounce = useRef<NodeJS.Timeout>();
    const paginationDebounce = useRef<NodeJS.Timeout>();

    function doDebouncedSearch(query: string, type: WorkType) {
        if (searchDebounce.current != undefined) {
            clearTimeout(searchDebounce.current);
        }
        if (query === "") return;

        setIsFetching(true);

        searchDebounce.current = setTimeout(async () => {
            setFoundWorks(await searchWorks(query, type));
            setIsFetching(false);
        }, 1000);
    }

    function resetPagination() {
        setWorksPage(2);
        setFoundWorks([]);
        setFetchedAll(false);
    }

    useEffect(() => {
        function handleScroll() {
            let scrollHeight = Math.max(
                document.body.scrollHeight,
                document.documentElement.scrollHeight,
                document.body.offsetHeight,
                document.documentElement.offsetHeight,
                document.body.clientHeight,
                document.documentElement.clientHeight
            );

            if (
                document.documentElement.clientHeight >=
                    scrollHeight -
                        document.documentElement.scrollTop -
                        paginationEarlyTriggerDistance &&
                !isFetching &&
                !fetchedAll
            ) {
                if (paginationDebounce.current) {
                    clearTimeout(paginationDebounce.current);
                }

                paginationDebounce.current = setTimeout(() => {
                    getNextData();
                }, 100);
            }
        }

        async function getNextData() {
            if (foundWorks === false) return;

            setIsFetching(true);
            const nextWorks = await searchWorks(query, type, worksPage);
            setWorksPage(worksPage + 1);

            if (nextWorks === false || nextWorks.length === 0) {
                setFetchedAll(true);
            } else {
                setFoundWorks([...foundWorks, ...nextWorks]);
            }

            setIsFetching(false);
        }

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [isFetching, fetchedAll, foundWorks, query, type, worksPage]);

    async function createWorkInstance(work: WorkFromAPIShort) {
        const newWorkFromAPI = {
            api_id: work.api_key.replace("/works/", ""),
            type: work.type,
            title: work.title,
            cover: work.cover !== "" ? work.cover : undefined,
        };

        const responseWorkFromAPI = await fetch("/api/workFromAPI/create", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(newWorkFromAPI),
        });

        if (!responseWorkFromAPI.ok) {
            handleResponseErrorWithToast(responseWorkFromAPI);
            return false;
        }

        const workFromAPI = (await responseWorkFromAPI.json()).created;

        const newWorkInstance = {
            ...DEFAULT_WORK_INSTANCE,
            work_id: workFromAPI._id,
            onModel: "WorkFromAPI",
        };

        const responseInstance = await fetch("/api/workInstance/create", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(newWorkInstance),
        });

        if (!responseInstance.ok) {
            handleResponseErrorWithToast(responseInstance);
            return false;
        }

        const workInstance = await responseInstance.json();

        if (workInstance.acknowledged) {
            router.push(`/me/work/${workInstance.created._id}`);
        }

        return true;
    }

    return (
        <div className={styles["search"]}>
            <div className={styles["search__form"]}>
                <Select
                    name="type"
                    id="type"
                    label="Type"
                    value={type}
                    options={TYPES}
                    fontSize="1.6rem"
                    onChange={(value) => {
                        const newType = value as WorkType;
                        setType(newType);
                        resetPagination();
                        doDebouncedSearch(query, newType);
                    }}
                />
                <Input
                    id="search"
                    name="search"
                    label="Search by title"
                    labelDisplay="never"
                    type="text"
                    value={query}
                    className={styles["search__input"]}
                    onChange={(value) => {
                        const newQuery = value;
                        setQuery(newQuery);
                        resetPagination();
                        doDebouncedSearch(newQuery, type);
                    }}
                />
                <span className={styles["search__divider"]}>Or</span>
                <NavLink
                    href={{
                        pathname: "/me/work/create",
                        query: {
                            type,
                        },
                    }}
                    title="Create new"
                    icon={mdiPlusThick}
                    style="inline"
                />
            </div>
            {query !== "" && (
                <div className={styles["search__results"]}>
                    <InstancesGrid>
                        {foundWorks
                            ? foundWorks.map((work) => {
                                  return (
                                      <ClickableWorkCard
                                          key={work.api_key}
                                          work={work}
                                          onClick={async () => {
                                              return {
                                                  success:
                                                      await createWorkInstance(
                                                          work
                                                      ),
                                                  stopLoading: false,
                                              };
                                          }}
                                      />
                                  );
                              })
                            : "Works browser is unavailable"}
                    </InstancesGrid>
                    {isFetching && (
                        <div className={styles["search__results__loading"]}>
                            <LoadingDisplay size="50px" />
                        </div>
                    )}
                    {fetchedAll && (
                        <span className={styles["search__list-end"]}>
                            No more works to find
                        </span>
                    )}
                </div>
            )}
        </div>
    );
}
