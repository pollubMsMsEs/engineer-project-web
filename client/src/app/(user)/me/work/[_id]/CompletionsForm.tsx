import { useUniqueKey } from "@/hooks/useUniqueKey";
import { mdiPlus } from "@mdi/js";
import Icon from "@mdi/react";
import dayjs from "dayjs";
import React from "react";

export default function CompletionsForm({
    published_at,
    completions,
    setCompletions,
}: {
    published_at?: Date;
    completions: { id: number; completion: Date }[];
    setCompletions: (value: any) => void;
}) {
    const getUniqueKey = useUniqueKey(completions.length);

    return (
        <div>
            <button
                type="button"
                onClick={() => {
                    setCompletions([...completions, new Date()]);
                }}
            >
                Add new <Icon path={mdiPlus} size={1} />
            </button>
            <div>
                {completions.map((value, index) => {
                    return (
                        <div key={value.id}>
                            <input
                                type="date"
                                value={dayjs(value.completion).format(
                                    "YYYY-MM-DD"
                                )}
                                min={dayjs(published_at).format("YYYY-MM-DD")}
                                max={dayjs().format("YYYY-MM-DD")}
                                onChange={(e) => {
                                    const values = [...completions];
                                    values[index] = {
                                        id: value.id,
                                        completion: new Date(e.target.value),
                                    };
                                    values.sort((a, b) =>
                                        a.completion > b.completion ? 1 : -1
                                    );
                                    setCompletions(values);
                                }}
                            />
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
