"use client";

import Work from "@/components/work/Work";
import WorkForm from "@/components/workForm/WorkForm";
import { useHandleRequest } from "@/hooks/useHandleRequests";
import { WorkFromAPIPopulated } from "@/types/types";
import { mdiPencil } from "@mdi/js";
import Icon from "@mdi/react";
import React, { useState } from "react";

export default function WorkEditable({
    _work,
    gridArea,
}: {
    _work: WorkFromAPIPopulated;
    gridArea?: string;
}) {
    const [isEditable, setIsEditable] = useState(false);
    const [work, setWork] = useState(_work);
    const {
        errors,
        errorsKey,
        fetchingState,
        setFetchingState,
        handleResponse,
    } = useHandleRequest<"cover" | "work">();

    return (
        <div style={{ gridArea }}>
            {isEditable ? (
                <WorkForm
                    work={work}
                    errors={errors}
                    errorsKey={errorsKey}
                    fetchingState={fetchingState}
                    setFetchingState={setFetchingState}
                    handleResponse={handleResponse}
                    onSubmit={async (work) => {
                        setWork(work);
                        setIsEditable(false);
                    }}
                    onCancel={() => {
                        setIsEditable(false);
                    }}
                />
            ) : (
                <>
                    <Work work={work} readOnly={false} />
                    <button
                        onClick={() => {
                            setIsEditable(true);
                        }}
                    >
                        <Icon path={mdiPencil} size={1} />
                    </button>
                </>
            )}
        </div>
    );
}
