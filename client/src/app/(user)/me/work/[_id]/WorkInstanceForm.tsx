"use client";

import RatingBar from "@/components/ratingBar/RatingBar";
import { useUniqueKey } from "@/hooks/useUniqueKey";
import { WorkInstanceFromAPI } from "@/types/types";
import React, { useState } from "react";
import CompletionsForm from "./CompletionsForm";
import { toast } from "react-toastify";

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
    const [numberOfCompletions, setNumberOfCompletions] = useState(
        workInstance.number_of_viewings
    );

    function addCompletion() {
        setCompletions([
            { id: getUniqueKey(), completion: new Date() },
            ...completions,
        ]);
        setNumberOfCompletions((value) => value + 1);
    }

    function editCompletion(
        completion: { id: number; completion: Date },
        newValue: Date
    ) {
        setCompletions((values) => {
            const editedCompletion = values.find(
                (searchedCompletion) => searchedCompletion.id === completion.id
            );

            if (editedCompletion) {
                editedCompletion.completion = new Date(newValue);
            }

            values.sort((a, b) => (a.completion < b.completion ? 1 : -1));

            return [...values];
        });
    }

    function removeCompletion(completion: { id: number; completion: Date }) {
        setCompletions((prevCompletions) => {
            return prevCompletions.filter(
                (prevComplietion) => prevComplietion.id !== completion.id
            );
        });
        setNumberOfCompletions((value) => value - 1);
    }

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
            />
            <CompletionsForm
                published_at={workInstance.work_id.published_at}
                completions={completions}
                addCompletion={addCompletion}
                editCompletion={editCompletion}
                removeCompletion={removeCompletion}
            />
            <input
                type="number"
                value={numberOfCompletions}
                onChange={(e) => {
                    const value = Number.parseInt(e.target.value);
                    if (value < completions.length) {
                        toast.warning(
                            "There is more completions in the list, remove them first"
                        );
                        return;
                    }

                    setNumberOfCompletions(value);
                }}
            />
        </form>
    );
}
