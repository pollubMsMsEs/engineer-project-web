"use client";

import ErrorsDisplay from "@/components/ErrorsDisplay";
import WorkForm from "@/components/WorkForm";
import { DEFAULT_WORK_INSTANCE } from "@/constantValues";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

export default function MeWorkCreate() {
    const router = useRouter();
    const [fetchingState, setFetchingState] = useState<
        "cover" | "work" | false
    >(false);
    const [errors, setErrors] = useState<any[]>([]);

    return (
        <>
            <WorkForm
                fetchingState={fetchingState}
                setFetchingState={setFetchingState}
                onSubmit={async (work) => {
                    const workInstance = {
                        ...DEFAULT_WORK_INSTANCE,
                        work_id: work._id,
                        onModel: "Work",
                        from_api: false,
                    };

                    const response = await fetch("/api/workInstance/create", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(workInstance),
                    });

                    if (!response.ok) {
                        try {
                            const result = await response.json();

                            if (result.errors) {
                                setErrors(result.errors);
                            }
                        } catch (e) {
                            console.error(e);
                        } finally {
                            setFetchingState(false);
                        }

                        return;
                    }

                    const result = await response.json();

                    if (result.acknowledged) {
                        router.push(`/me/work/${result.created._id}`);
                    }
                }}
            />
            <ErrorsDisplay errors={errors} />
        </>
    );
}
