import LoadingCircle from "@/components/LoadingCircle";
import { Suspense } from "react";
import CountDisplay from "./CountDisplay";
import { fetchAPIFromServerComponent } from "@/modules/serverSide";
import { WorkInstanceFromAPI } from "@/types/types";
import InstancesGrid from "@/components/InstancesGrid";
import WorkInstanceCard from "@/components/WorkInstanceCard";
import TooltipWrapper from "@/components/TooltipWrapper";
import Link from "next/link";
import Icon from "@mdi/react";
import { mdiPlus } from "@mdi/js";
import styles from "./page.module.scss";

export const revalidate = 0;

export default async function Home() {
    const response = await fetchAPIFromServerComponent("/workInstance/me", 0);
    const result: WorkInstanceFromAPI[] = (await response.json()).data;
    const workInstances = result.map((instance) => {
        instance.completions = instance.completions.map(
            (viewing) => new Date(viewing)
        );
        return instance;
    });

    const movies: WorkInstanceFromAPI[] = [];
    const books: WorkInstanceFromAPI[] = [];
    const computerGames: WorkInstanceFromAPI[] = [];

    // TODO: Filter unsupported works from API
    workInstances
        .filter((workInstance) => !workInstance.from_api)
        .forEach((workInstance) => {
            switch (workInstance.type) {
                case "movie":
                    movies.push(workInstance);
                    break;
                case "book":
                    books.push(workInstance);
                    break;
                case "computerGame":
                    computerGames.push(workInstance);
                    break;
            }
        });

    return (
        <div className={styles["collection"]}>
            <InstancesGrid title="Books">
                {books.map((workInstance) => (
                    <WorkInstanceCard
                        key={workInstance._id}
                        workInstance={workInstance}
                    />
                ))}
                <Link
                    className={styles["collection__add-card"]}
                    href={{
                        pathname: "/me/work/create",
                        query: {
                            type: "book",
                        },
                    }}
                >
                    <Icon path={mdiPlus} />
                </Link>
            </InstancesGrid>
            <InstancesGrid title="Movies">
                {movies.map((workInstance) => (
                    <WorkInstanceCard
                        key={workInstance._id}
                        workInstance={workInstance}
                    />
                ))}
                <Link
                    className={styles["collection__add-card"]}
                    href={{
                        pathname: "/me/work/create",
                        query: {
                            type: "movie",
                        },
                    }}
                >
                    <Icon path={mdiPlus} />
                </Link>
            </InstancesGrid>
            <InstancesGrid title="Computer Games">
                {computerGames.map((workInstance) => (
                    <WorkInstanceCard
                        key={workInstance._id}
                        workInstance={workInstance}
                    />
                ))}
                <Link
                    className={styles["collection__add-card"]}
                    href={{
                        pathname: "/me/work/create",
                        query: {
                            type: "computerGame",
                        },
                    }}
                >
                    <Icon path={mdiPlus} />
                </Link>
            </InstancesGrid>
            <TooltipWrapper id="tooltip-add-viewing" />
        </div>
    );
}
