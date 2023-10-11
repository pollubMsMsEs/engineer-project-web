"use client";

import WorkForm from "@/components/WorkForm";
import { useRouter } from "next/navigation";
import React from "react";

export default function MeWorkCreate() {
    const router = useRouter();

    return (
        <WorkForm
            onSubmit={async (work) => {
                //TODO: Remove type
                const workInstance = {
                    work_id: work._id,
                    onModel: "Work",
                    rating: 0,
                    description: "",
                    number_of_viewings: 0,
                    viewings: [],
                    status: "todo",
                    type: work.type,
                    from_api: false,
                };

                const response = await fetch("/api/workInstance/create", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(workInstance),
                });
                const result = await response.json();

                if (result.acknowledged) {
                    router.push(`/me/work/${result.created._id}`);
                }
            }}
        />
    );
}
