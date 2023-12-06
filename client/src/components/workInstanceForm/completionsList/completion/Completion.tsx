import Button from "@/components/button/Button";
import dayjs from "dayjs";
import React from "react";

export default function Completion({
    published_at,
    completion,
    editCompletion,
    removeCompletion,
}: {
    published_at?: Date;
    completion: { id: number; completion: Date };
    editCompletion: (
        completion: { id: number; completion: Date },
        newValue: Date
    ) => void;
    removeCompletion: (completion: { id: number; completion: Date }) => void;
}) {
    return (
        <div>
            <input
                type="date"
                value={dayjs(completion.completion).format("YYYY-MM-DD")}
                min={dayjs(published_at).format("YYYY-MM-DD")}
                max={dayjs().format("YYYY-MM-DD")}
                onChange={(e) => {
                    editCompletion(completion, new Date(e.target.value));
                }}
            />
            <Button
                type="button"
                onClick={() => {
                    removeCompletion(completion);
                }}
            >
                -
            </Button>
        </div>
    );
}
