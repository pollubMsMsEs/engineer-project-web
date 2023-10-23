"use client";
import { useRouter, useSearchParams } from "next/navigation";
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
import { toast } from "react-toastify";
import { DEFAULT_WORK_INSTANCE } from "@/constantValues";

function assertCorrectType(type: any, defaultType: WorkType = "book") {
    if (type === "book" || type === "movie" || type === "game") {
        return type;
    } else {
        return defaultType;
    }
}

export default function Search() {
    const router = useRouter();
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

    async function createWorkInstance(work: WorkFromAPIShort) {
        const newWorkFromAPI = {
            api_id: work.api_id,
            type: work.type,
        };

        const responseWorkFromAPI = await fetch("/api/workFromAPI/create", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(newWorkFromAPI),
        });

        if (!responseWorkFromAPI.ok) {
            try {
                const workFromAPI = await responseWorkFromAPI.json();

                if (workFromAPI.errors) {
                    toast.error(workFromAPI.errors[0].msg);
                } else if (workFromAPI.message) {
                    toast.error(workFromAPI.message);
                } else if (workFromAPI.error) {
                    toast.error(workFromAPI.error);
                }
            } catch (e) {
                toast.error("Unknown error");
                console.error(e);
            }

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
            try {
                const workInstance = await responseInstance.json();

                if (workInstance.errors) {
                    toast.error(workInstance.errors[0].msg);
                } else if (workInstance.message) {
                    toast.error(workInstance.message);
                } else if (workInstance.error) {
                    toast.error(workInstance.error);
                }
            } catch (e) {
                toast.error("Unknown error");
                console.error(e);
            }

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
                                                  return {
                                                      success:
                                                          await createWorkInstance(
                                                              work
                                                          ),
                                                      stopLoading: false,
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
