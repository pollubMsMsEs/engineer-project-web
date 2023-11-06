import PersonForm from "@/components/personForm/PersonForm";
import { fetchAPIFromServerComponent } from "@/modules/serverSide";
import React from "react";

export default async function PersonEdit({
    params,
}: {
    params: { _id: string };
}) {
    const response = await fetchAPIFromServerComponent(
        `/person/${params._id}`,
        0
    );
    const person = (await response.json()).data;

    return <PersonForm person={person} />;
}
