import { fetchAPIFromServerComponent } from "@/modules/serverSide";
import { WorkInstanceFromAPI } from "@/types/types";
import InstancesGrid from "@/components/instancesGrid/InstancesGrid";
import WorkInstanceCard from "@/components/workInstanceCard/WorkInstanceCard";
import TooltipWrapper from "@/components/tooltipWrapper/TooltipWrapper";
import styles from "./page.module.scss";
import AddCard from "../../components/addCard/AddCard";
import { getTypeIcon } from "@/modules/ui";
import LoadingDisplay from "@/components/loadingDisplay/LoadingDisplay";

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
    const games: WorkInstanceFromAPI[] = [];

    // TODO: Filter unsupported works from API
    workInstances.forEach((workInstance) => {
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
