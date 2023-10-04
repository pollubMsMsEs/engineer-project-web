import LoadingCircle from "@/components/LoadingCircle";
import { Suspense } from "react";
import CountDisplay from "./CountDisplay";
import { fetchAPIFromServerComponent } from "@/modules/serverSide";
import { WorkInstanceFromAPI } from "@/types/types";
import InstancesGrid from "@/components/InstancesGrid";
import WorkInstanceCard from "@/components/WorkInstanceCard";
import TooltipWrapper from "@/components/TooltipWrapper";

export const revalidate = 0;

export default async function Home() {
    const response = await fetchAPIFromServerComponent(
        "/workInstance/currentUser",
        0
    );
    const result: WorkInstanceFromAPI[] = (await response.json()).data;
    const workInstances = result.map((instance) => {
        instance.viewings = instance.viewings.map(
            (viewing) => new Date(viewing)
        );
        return instance;
    });

    const movies: WorkInstanceFromAPI[] = [];
    const books: WorkInstanceFromAPI[] = [];
    const computerGames: WorkInstanceFromAPI[] = [];

    workInstances.forEach((workInstance) => {
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
        <div>
            <InstancesGrid title="Books">
                {books.map((workInstance) => (
                    <WorkInstanceCard
                        key={workInstance._id}
                        workInstance={workInstance}
                    />
                ))}
            </InstancesGrid>
            <InstancesGrid title="Movies">
                {movies.map((workInstance) => (
                    <WorkInstanceCard
                        key={workInstance._id}
                        workInstance={workInstance}
                    />
                ))}
            </InstancesGrid>
            <InstancesGrid title="Computer Games">
                {computerGames.map((workInstance) => (
                    <WorkInstanceCard
                        key={workInstance._id}
                        workInstance={workInstance}
                    />
                ))}
            </InstancesGrid>
            <TooltipWrapper id="tooltip-add-viewing" />
        </div>
    );
}
