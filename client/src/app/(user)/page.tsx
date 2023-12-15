import { fetchAPIFromServerComponent } from "@/modules/serverSide";
import { WorkInstanceFromAPI } from "@/types/types";

import WorkCollection from "@/components/workCollection/WorkCollection";

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

    return <WorkCollection workInstances={workInstances} />;
}
