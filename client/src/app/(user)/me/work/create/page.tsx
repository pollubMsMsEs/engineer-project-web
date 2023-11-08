"use client";

import ErrorsDisplay from "@/components/errorsDisplay/ErrorsDisplay";
import WorkForm from "@/components/workForm/WorkForm";
import { DEFAULT_WORK_INSTANCE } from "@/constantValues";
import { tryExtractErrors } from "@/modules/errorsHandling";
import { ExtractedErrors, ObjectWithPotentialError } from "@/types/types";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

export default function MeWorkCreate() {
    const router = useRouter();
    const [fetchingState, setFetchingState] = useState<
        "cover" | "work" | false
    >(false);
    const [errors, setErrors] = useState<ExtractedErrors | undefined>(
        undefined
    );

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
                            const errors = tryExtractErrors(result);

                            setErrors(errors);
                        } catch (e) {
                            console.error(e);
                        } finally {
                            setFetchingState(false);
                        }

                        return;
                    }

                    setErrors(undefined);
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
