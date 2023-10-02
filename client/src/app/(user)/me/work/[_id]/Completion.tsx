import dayjs from "dayjs";
import React from "react";

export default function Completion({
    published_at,
    completion,
    setCompletions,
}: {
    published_at?: Date;
    completion: { id: number; completion: Date };
    setCompletions: React.Dispatch<
        React.SetStateAction<{ id: number; completion: Date }[]>
    >;
}) {
    return (
        <div>
            <input
                type="date"
                value={dayjs(completion.completion).format("YYYY-MM-DD")}
                min={dayjs(published_at).format("YYYY-MM-DD")}
                max={dayjs().format("YYYY-MM-DD")}
                onChange={(e) => {
                    setCompletions((values) => {
                        const editedCompletion = values.find(
                            (searchedCompletion) =>
                                searchedCompletion.id === completion.id
                        );

                        if (editedCompletion) {
                            editedCompletion.completion = new Date(
                                e.target.value
                            );
                        }

                        values.sort((a, b) =>
                            a.completion < b.completion ? 1 : -1
                        );

                        return [...values];
                    });
                }}
            />
            <button
                type="button"
                onClick={() => {
                    setCompletions((prevCompletions) => {
                        return prevCompletions.filter(
                            (prevComplietion) =>
                                prevComplietion.id !== completion.id
                        );
                    });
                }}
            >
                -
            </button>
        </div>
    );
}
