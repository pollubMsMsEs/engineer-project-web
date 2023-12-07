"use client";

import RatingBar from "@/components/ratingBar/RatingBar";
import { useUniqueKey } from "@/hooks/useUniqueKey";
import {
    WorkFromAPIPopulated,
    WorkInstance,
    WorkInstanceFromAPI,
    WorkInstanceStatus,
} from "@/types/types";
import React, { useRef, useState } from "react";
import CompletionsList from "./completionsList/CompletionsList";
import { toast } from "react-toastify";
import Select from "@/components/select/Select";
import { STATUSES } from "@/constantValues";
import { useUnmountedEffect } from "@/hooks/useUnmountedEffect";
import styles from "./workInstanceForm.module.scss";
import { handleResponseErrorWithToast } from "@/modules/errorsHandling";
import Input from "../input/Input";
import TextArea from "../textArea/TextArea";

export default function WorkInstanceForm({
    workInstance,
    gridArea,
}: {
    workInstance: WorkInstanceFromAPI<WorkFromAPIPopulated>;
    gridArea?: string;
}) {
    const getUniqueKey = useUniqueKey();
    const debouncesCount = useRef(0);

    const [rating, setRating] = useState(workInstance.rating);
    const [description, setDescription] = useState(
        workInstance.description ?? ""
    );
    const [completions, setCompletions] = useState(
        () =>
            workInstance.completions?.map((completion) => ({
                id: getUniqueKey(),
                completion,
            })) ?? []
    );
    const [numberOfCompletions, setNumberOfCompletions] = useState(
        workInstance.number_of_completions ?? 0
    );
    const [status, setStatus] = useState(workInstance.status ?? "");

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

    useUnmountedEffect(() => {
        async function updateInstance() {
            const didBegan = status === "doing" || status === "completed";
            const didFinished = status === "completed";

            const newInstance: WorkInstance = {
                ...workInstance,
                rating,
                description,
                number_of_completions: numberOfCompletions,
                completions: completions.map(
                    (completion) => completion.completion
                ),
                status,
                began_at:
                    workInstance.began_at ??
                    (didBegan ? new Date() : undefined),
                finished_at:
                    workInstance.finished_at ??
                    (didFinished ? new Date() : undefined),
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
                handleResponseErrorWithToast(response);
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

    const isCompleted = numberOfCompletions > 0 || status === "completed";

    return (
        <form className={styles["work-instance"]}>
            <div className={styles["work-instance__status"]}>
                <Select
                    name={"status"}
                    id={`status`}
                    label="Status"
                    value={status}
                    options={Object.entries(STATUSES[workInstance.type])}
                    onChange={(value) => {
                        setStatus(value as WorkInstanceStatus);
                    }}
                />
            </div>
            {isCompleted && (
                <>
                    <Input
                        type="number"
                        id="numberOfCompletions"
                        name="numberOfCompletions"
                        label="Number of completions"
                        value={numberOfCompletions}
                        onChange={(rawValue) => {
                            let value = Number.parseInt(rawValue);
                            if (Number.isNaN(value)) value = 0;
                            if (value < completions.length) {
                                toast.warning(
                                    "There is more completions in the list, remove them first"
                                );
                                return;
                            }

                            setNumberOfCompletions(value);
                        }}
                    />
                    <RatingBar
                        value={rating}
                        maxValue={5}
                        setValue={setRating}
                    />
                    <CompletionsList
                        published_at={workInstance.work_id.published_at}
                        completions={completions}
                        addCompletion={addCompletion}
                        editCompletion={editCompletion}
                        removeCompletion={removeCompletion}
                    />

                    <TextArea
                        name="description"
                        id="description"
                        label="Notes"
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
