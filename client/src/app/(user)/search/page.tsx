"use client";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useRef, useState } from "react";
import styles from "./page.module.scss";
import Icon from "@mdi/react";
import { mdiPlus, mdiPlusThick } from "@mdi/js";
import Link from "next/link";
import { WorkType } from "@/types/types";
import { WorkFromAPIShort, searchWorks } from "@/modules/apiBrowser";
import LoadingDisplay from "@/components/loadingDisplay/LoadingDisplay";
import InstancesGrid from "@/components/instancesGrid/InstancesGrid";
import WorkCard from "@/components/workCard/WorkCard";
import ClickableCard from "@/components/clickableCard/ClickableCard";
import { waitPromise, waitRandomPromise } from "@/scripts/devUtils";
import { toast } from "react-toastify";
import { DEFAULT_WORK_INSTANCE, TYPES } from "@/constantValues";
import { handleResponseErrorWithToast } from "@/modules/errorsHandling";
import Select from "@/components/select/Select";
import NavLink from "@/components/navLink/NavLink";

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
                <Select
                    name="type"
                    id="type"
                    value={type}
                    options={TYPES}
                    fontSize="1.6rem"
                    onChange={(value) => {
                        const newType = assertCorrectType(value);
                        setType(assertCorrectType(newType));
                        doDebouncedSearch(query, newType);
                    }}
                />
                <NavLink
                    href={{
                        pathname: "/me/work/create",
                        query: {
                            type,
                        },
                    }}
                    title="Add manually"
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
                                              <WorkCard work={work} />
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
