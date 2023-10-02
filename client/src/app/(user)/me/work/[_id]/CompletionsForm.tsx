import { useUniqueKey } from "@/hooks/useUniqueKey";
import { mdiPlus } from "@mdi/js";
import Icon from "@mdi/react";
import dayjs from "dayjs";
import React from "react";
import Completion from "./Completion";

export default function CompletionsForm({
    published_at,
    completions,
    setCompletions,
}: {
    published_at?: Date;
    completions: { id: number; completion: Date }[];
    setCompletions: React.Dispatch<
        React.SetStateAction<{ id: number; completion: Date }[]>
    >;
}) {
    const getUniqueKey = useUniqueKey(completions.length);

    return (
        <div>
            <button
                type="button"
                onClick={() => {
                    setCompletions([
                        { id: getUniqueKey(), completion: new Date() },
                        ...completions,
                    ]);
                }}
            >
                Add new <Icon path={mdiPlus} size={1} />
            </button>
            <div>
                {completions.map((completion) => {
                    return (
                        <Completion
                            key={completion.id}
                            published_at={published_at}
                            completion={completion}
                            setCompletions={setCompletions}
                        />
                    );
                })}
            </div>
        </div>
    );
}
