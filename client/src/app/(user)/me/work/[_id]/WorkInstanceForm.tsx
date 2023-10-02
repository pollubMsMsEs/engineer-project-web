"use client";

import RatingBar from "@/components/ratingBar/RatingBar";
import { useUniqueKey } from "@/hooks/useUniqueKey";
import { WorkInstanceFromAPI } from "@/types/types";
import React, { useState } from "react";
import CompletionsForm from "./CompletionsForm";

export default function WorkInstanceForm({
    workInstance,
}: {
    workInstance: WorkInstanceFromAPI;
}) {
    const getUniqueKey = useUniqueKey();

    const [rating, setRating] = useState(workInstance.rating);
    const [description, setDescription] = useState(
        workInstance.description ?? ""
    );
    const [completions, setCompletions] = useState(
        () =>
            workInstance.viewings?.map((completion) => ({
                id: getUniqueKey(),
                completion,
            })) ?? []
    );

    return (
        <form>
            <RatingBar value={rating} maxValue={5} setValue={setRating} />
            <textarea
                name="description"
                id="description"
                cols={30}
                rows={10}
                onChange={(e) => {
                    setDescription(e.target.value);
                }}
                value={description}
            ></textarea>
            <CompletionsForm
                published_at={workInstance.work_id.published_at}
                completions={completions}
                setCompletions={setCompletions}
            />
        </form>
    );
}
