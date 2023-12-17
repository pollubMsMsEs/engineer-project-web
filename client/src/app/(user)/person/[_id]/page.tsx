import Person from "@/components/person/Person";
import { fetchAPIFromServerComponent } from "@/modules/serverSide";
import React from "react";

export default async function PersonDetails({
    params,
}: {
    params: { _id: string };
}) {
    const response = await fetchAPIFromServerComponent(`/person/${params._id}`);
    const result = await response.json();

    return <Person person={result.data} readOnly={false} />;
}
