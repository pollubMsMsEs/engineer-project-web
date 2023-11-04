"use client";

import Work from "@/components/Work";
import WorkForm from "@/components/WorkForm";
import { WorkFromAPIPopulated } from "@/types/types";
import { mdiPencil } from "@mdi/js";
import Icon from "@mdi/react";
import React, { useState } from "react";

export default function EditableWork({
    _work,
    gridArea,
}: {
    _work: WorkFromAPIPopulated;
    gridArea?: string;
}) {
    const [isEditable, setIsEditable] = useState(false);
    const [work, setWork] = useState(_work);
    const [fetchingState, setFetchingState] = useState<
        "cover" | "work" | false
    >(false);

    return (
        <div style={{ gridArea }}>
            {isEditable ? (
                <WorkForm
                    work={work}
                    fetchingState={fetchingState}
                    setFetchingState={setFetchingState}
                    onSubmit={async (work) => {
                        setWork(work);
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
