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

    return (
        <div style={{ gridArea }}>
            {isEditable ? (
                <WorkForm
                    work={work}
                    onSubmit={async (work) => {
                        //TODO: Remove fetch when fields become populated
                        const response = await fetch(`/api/work/${work._id}`);
                        const result = await response.json();
                        setWork(result.data);
                        setIsEditable(false);
                    }}
                />
            ) : (
                <>
                    <Work work={work} />
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
