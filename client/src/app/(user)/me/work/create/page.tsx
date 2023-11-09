"use client";

import WorkForm from "@/components/workForm/WorkForm";
import { DEFAULT_WORK_INSTANCE } from "@/constantValues";
import { useHandleRequest } from "@/hooks/useHandleRequests";
import { useRouter } from "next/navigation";

export default function MeWorkCreate() {
    const router = useRouter();
    const {
        errors,
        errorsKey,
        fetchingState,
        setFetchingState,
        handleResponse,
    } = useHandleRequest<"cover" | "work">();

    return (
        <>
            <WorkForm
                errors={errors}
                errorsKey={errorsKey}
                fetchingState={fetchingState}
                setFetchingState={setFetchingState}
                handleResponse={handleResponse}
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

                    const result = await handleResponse(response);
                    if (!result) return;

                    router.push(`/me/work/${result.created._id}`);
                }}
            />
        </>
    );
}
