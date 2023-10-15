"use client";

import WorkForm from "@/components/WorkForm";
import React, { useState } from "react";

export default function CreateWork() {
    const [fetchingState, setFetchingState] = useState<
        "cover" | "work" | false
    >(false);

    return (
        <WorkForm
            fetchingState={fetchingState}
            setFetchingState={setFetchingState}
        />
    );
}
