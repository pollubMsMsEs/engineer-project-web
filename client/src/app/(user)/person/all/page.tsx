import { fetchAPIFromServerComponent } from "@/modules/serverSide";
import React from "react";
import PersonList from "./PersonList";

export default async function PersonAll() {
    const response = await fetchAPIFromServerComponent("/person/all", 0);
    const result = await response.json();

    return <PersonList people={result} />;
}
