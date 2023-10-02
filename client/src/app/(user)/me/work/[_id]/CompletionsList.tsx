import { useUniqueKey } from "@/hooks/useUniqueKey";
import { mdiPlus } from "@mdi/js";
import Icon from "@mdi/react";
import dayjs from "dayjs";
import React from "react";
import Completion from "./Completion";

export default function CompletionsList({
    published_at,
    completions,
    addCompletion,
    editCompletion,
    removeCompletion,
}: {
    published_at?: Date;
    completions: { id: number; completion: Date }[];
    addCompletion: () => void;
    editCompletion: (
        completion: { id: number; completion: Date },
        newValue: Date
    ) => void;
    removeCompletion: (completion: { id: number; completion: Date }) => void;
}) {
    const getUniqueKey = useUniqueKey(completions.length);

    return (
        <div>
            <button type="button" onClick={addCompletion}>
                Add new <Icon path={mdiPlus} size={1} />
            </button>
            <div>
                {completions.map((completion) => {
                    return (
                        <Completion
                            key={completion.id}
                            published_at={published_at}
                            completion={completion}
                            editCompletion={editCompletion}
                            removeCompletion={removeCompletion}
                        />
                    );
                })}
            </div>
        </div>
    );
}
