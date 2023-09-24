import LoadingCircle from "@/components/LoadingCircle";
import { Suspense } from "react";
import CountDisplay from "./CountDisplay";

export const revalidate = 0;

export default async function Home() {
    return (
        <div>
            <h1>Index</h1>
            <Suspense fallback={<LoadingCircle size="15px" />}>
                <CountDisplay title="Works count:" url="/work/count" />
            </Suspense>
            <Suspense fallback={<LoadingCircle size="15px" />}>
                <CountDisplay title="People count:" url="/person/count" />
            </Suspense>
        </div>
    );
}
