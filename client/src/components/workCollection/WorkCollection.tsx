"use client";

import {
    WorkInstanceFromAPI,
    WorkInstanceStatus,
    WorkType,
} from "@/types/types";
import React, { useState } from "react";
import InstancesGrid from "@/components/instancesGrid/InstancesGrid";
import WorkInstanceCard from "@/components/workInstanceCard/WorkInstanceCard";
import TooltipWrapper from "@/components/tooltipWrapper/TooltipWrapper";
import AddCard from "../../components/addCard/AddCard";
import { getTypeIcon } from "@/modules/ui";
import Icon from "@mdi/react";
import { mdiFilter } from "@mdi/js";
import Select from "@/components/select/Select";
import { TYPES } from "@/constantValues";
import styles from "./workCollection.module.scss";

export default function WorkCollection({
    workInstances: _workInstances,
}: {
    workInstances: WorkInstanceFromAPI[];
}) {
    const [statusQuery, setStatusQuery] = useState<WorkInstanceStatus | "any">(
        "any"
    );
    const [workInstances, setWorkInstances] = useState(_workInstances);

    const movies: WorkInstanceFromAPI[] = [];
    const books: WorkInstanceFromAPI[] = [];
    const games: WorkInstanceFromAPI[] = [];

    workInstances
        .filter((workInstance) => {
            if (statusQuery === "any") return true;
            return workInstance.status === statusQuery;
        })
        .forEach((workInstance) => {
            switch (workInstance.type) {
                case "movie":
                    movies.push(workInstance);
                    break;
                case "book":
                    books.push(workInstance);
                    break;
                case "game":
                    games.push(workInstance);
                    break;
            }
        });

    return (
        <div className={styles["collection"]}>
            <div className={styles["collection__query"]}>
                <Icon path={mdiFilter} size={1.5} />
                <Select
                    id="typeQuery"
                    name="typeQuery"
                    label="Type"
                    labelDisplay="always"
                    value={statusQuery}
                    options={[
                        ["any", "Any"],
                        ["wishlist", "Wishlist"],
                        ["todo", "To Do"],
                        ["doing", "Doing"],
                        ["completed", "Completed"],
                    ]}
                    fontSize="1.5rem"
                    onChange={(type) => {
                        setStatusQuery(type as WorkInstanceStatus | "any");
                    }}
                />
            </div>
            <InstancesGrid title="Books" iconPath={getTypeIcon("book").path}>
                {books.map((workInstance) => (
                    <WorkInstanceCard
                        key={workInstance._id}
                        workInstance={workInstance}
                    />
                ))}
                <AddCard workType="book" />
            </InstancesGrid>
            <InstancesGrid title="Movies" iconPath={getTypeIcon("movie").path}>
                {movies.map((workInstance) => (
                    <WorkInstanceCard
                        key={workInstance._id}
                        workInstance={workInstance}
                    />
                ))}
                <AddCard workType="movie" />
            </InstancesGrid>
            <InstancesGrid
                title="Computer Games"
                iconPath={getTypeIcon("game").path}
                gameIcon
            >
                {games.map((workInstance) => (
                    <WorkInstanceCard
                        key={workInstance._id}
                        workInstance={workInstance}
                    />
                ))}
                <AddCard workType="game" />
            </InstancesGrid>
            <TooltipWrapper id="tooltip-add-viewing" />
        </div>
    );
}
