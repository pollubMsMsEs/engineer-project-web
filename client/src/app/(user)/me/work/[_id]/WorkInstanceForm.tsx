"use client";

import RatingBar from "@/components/ratingBar/RatingBar";
import { useUniqueKey } from "@/hooks/useUniqueKey";
import { WorkInstance, WorkInstanceFromAPI } from "@/types/types";
import React, { useEffect, useRef, useState } from "react";
import CompletionsList from "./CompletionsList";
import { toast } from "react-toastify";
import Select from "@/components/select/Select";
import { statuses } from "@/modules/workInstanceStatus";

export default function WorkInstanceForm({
    workInstance,
}: {
    workInstance: WorkInstanceFromAPI;
}) {
    const getUniqueKey = useUniqueKey();
    const debouncer = useRef<NodeJS.Timeout>();
    const debouncesCount = useRef(0);

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
    const [status, setStatus] = useState(workInstance.status);

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

    useEffect(() => {
        async function updateInstance() {
            const newInstance: WorkInstance & { work_id: string } = {
                ...workInstance,
                work_id: workInstance.work_id._id,
                rating,
                description,
                number_of_viewings: numberOfCompletions,
                viewings: completions.map(
                    (completion) => completion.completion
                ),
                status,
            };

            const response = await fetch(
                `/api/workInstance/${workInstance._id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(newInstance),
                }
            );

            if (!response.ok) {
                toast.error("Couldn't save status changes");
                console.log(await response.json());
            } else {
                toast.success("Status updated succesfully");
            }
        }

        let delay = 0;
        debouncesCount.current++;
        switch (debouncesCount.current) {
            case 1:
                delay = 800;
                break;
            case 2:
                delay = 1600;
                break;
            default:
                delay = 2000;
        }

        const timeout = setTimeout(updateInstance, delay);

        return () => {
            clearTimeout(timeout);
        };
    }, [
        workInstance,
        rating,
        description,
        numberOfCompletions,
        completions,
        status,
    ]);

    const isCompleted = numberOfCompletions > 0 || status === "Completed";

    return (
        <form>
            <div style={{ width: "200px" }}>
                <Select
                    name={"status"}
                    id={`status`}
                    value={status}
                    options={statuses[workInstance.type]}
                    onChange={(value) => {
                        setStatus(value);
                    }}
                />
            </div>
            {isCompleted && (
                <>
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
                    <CompletionsList
                        published_at={workInstance.work_id.published_at}
                        completions={completions}
                        addCompletion={addCompletion}
                        editCompletion={editCompletion}
                        removeCompletion={removeCompletion}
                    />

                    <RatingBar
                        value={rating}
                        maxValue={5}
                        setValue={setRating}
                    />

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
                </>
            )}
        </form>
    );
}
