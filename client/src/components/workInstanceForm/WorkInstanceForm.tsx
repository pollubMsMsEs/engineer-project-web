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
import dayjs from "dayjs";

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
    const [beganAt, setBeganAt] = useState<Date | undefined>(
        workInstance.began_at
    );
    const [finishedAt, setFinishedAt] = useState<Date | undefined>(
        workInstance.finished_at
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

            const _beganAt = beganAt ?? (didBegan ? new Date() : undefined);
            if (_beganAt !== beganAt) {
                setBeganAt(_beganAt);
            }

            const _finishedAt =
                finishedAt ?? (didFinished ? new Date() : undefined);
            if (_finishedAt !== finishedAt) {
                setFinishedAt(_finishedAt);
            }

            const newInstance: WorkInstance = {
                ...workInstance,
                rating,
                description,
                number_of_completions: numberOfCompletions,
                completions: completions.map(
                    (completion) => completion.completion
                ),
                status,
                began_at: _beganAt,
                finished_at: _finishedAt,
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
        beganAt,
        finishedAt,
    ]);

    const isCompleted = numberOfCompletions > 0 || status === "completed";
    const isBegan = status === "doing";

    return (
        <form className={styles["work-instance"]}>
            <div className={styles["work-instance__status"]}>
                <Select
                    name={"status"}
                    id={`status`}
                    label="Status"
                    value={status}
                    fontSize="1.5rem"
                    options={Object.entries(STATUSES[workInstance.type])}
                    onChange={(value) => {
                        setStatus(value as WorkInstanceStatus);
                    }}
                />
            </div>
            {(isBegan || isCompleted) && (
                <div className={styles["work-instance__dates"]}>
                    <Input
                        type="date"
                        id="beganAt"
                        name="beganAt"
                        label="Began at"
                        labelDisplay="always"
                        value={dayjs(beganAt).format("YYYY-MM-DD")}
                        max={
                            finishedAt
                                ? dayjs(finishedAt).format("YYYY-MM-DD")
                                : dayjs().format("YYYY-MM-DD")
                        }
                        onChange={(value) => {
                            setBeganAt(new Date(value));
                        }}
                    />

                    {isCompleted && (
                        <>
                            <span
                                className={
                                    styles["work-instance__dates__separator"]
                                }
                            >
                                :
                            </span>
                            <Input
                                type="date"
                                id="finishedAt"
                                name="finishedAt"
                                label="Finished at"
                                labelDisplay="always"
                                value={dayjs(finishedAt).format("YYYY-MM-DD")}
                                min={
                                    beganAt &&
                                    dayjs(beganAt).format("YYYY-MM-DD")
                                }
                                max={dayjs().format("YYYY-MM-DD")}
                                onChange={(value) => {
                                    setFinishedAt(new Date(value));
                                }}
                            />
                        </>
                    )}
                </div>
            )}
            {(isBegan || isCompleted) && (
                <div className={styles["work-instance__opinion"]}>
                    {isCompleted && (
                        <RatingBar
                            value={rating}
                            maxValue={5}
                            setValue={setRating}
                        />
                    )}
                    <TextArea
                        name="description"
                        id="description"
                        label="Notes"
                        onChange={(value) => {
                            setDescription(value);
                        }}
                        value={description}
                    />
                </div>
            )}
            {isCompleted && (
                <>
                    <CompletionsList
                        published_at={workInstance.work_id.published_at}
                        numberOfCompletions={numberOfCompletions}
                        setNumberOfCompletions={setNumberOfCompletions}
                        completions={completions}
                        addCompletion={addCompletion}
                        editCompletion={editCompletion}
                        removeCompletion={removeCompletion}
                    />
                </>
            )}
        </form>
    );
}
