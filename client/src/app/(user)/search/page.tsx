"use client";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useRef, useState } from "react";
import styles from "./page.module.scss";
import { mdiPlusThick } from "@mdi/js";
import { WorkType } from "@/types/types";
import { WorkFromAPIShort, searchWorks } from "@/modules/apiBrowser";
import LoadingDisplay from "@/components/loadingDisplay/LoadingDisplay";
import InstancesGrid from "@/components/instancesGrid/InstancesGrid";
import WorkCard from "@/components/workCard/WorkCard";
import ClickableCard from "@/components/clickableCard/ClickableCard";
import { DEFAULT_WORK_INSTANCE, TYPES } from "@/constantValues";
import { handleResponseErrorWithToast } from "@/modules/errorsHandling";
import Select from "@/components/select/Select";
import NavLink from "@/components/navLink/NavLink";
import Input from "@/components/input/Input";

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

    async function createWorkInstance(work: WorkFromAPIShort) {
        const newWorkFromAPI = {
            api_id: work.api_key.replace("/works/", ""),
            type: work.type,
            title: work.title,
            cover: work.cover,
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
                        const newType = assertCorrectType(value);
                        setType(assertCorrectType(newType));
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
                    {!isFetching ? (
                        <InstancesGrid>
                            {foundWorks
                                ? foundWorks.map((work) => {
                                      return (
                                          <ClickableCard
                                              key={work.api_key}
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
                                              <WorkCard
                                                  work={work}
                                                  roundedCornersTop
                                                  roundedCornersBottom
                                                  zoomOnHover
                                              />
                                          </ClickableCard>
                                      );
                                  })
                                : "Works browser is unavailable"}
                        </InstancesGrid>
                    ) : (
                        <LoadingDisplay size="30px" />
                    )}
                </div>
            )}
        </div>
    );
}
