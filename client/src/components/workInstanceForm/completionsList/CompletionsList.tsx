import { useUniqueKey } from "@/hooks/useUniqueKey";
import { mdiPlus, mdiPlusThick } from "@mdi/js";
import Icon from "@mdi/react";
import dayjs from "dayjs";
import React from "react";
import Completion from "./completion/Completion";
import Button from "@/components/button/Button";
import Input from "@/components/input/Input";
import { toast } from "react-toastify";
import styles from "./completionsList.module.scss";

export default function CompletionsList({
    published_at,
    numberOfCompletions,
    setNumberOfCompletions,
    completions,
    addCompletion,
    editCompletion,
    removeCompletion,
}: {
    published_at?: Date;
    completions: { id: number; completion: Date }[];
    numberOfCompletions: number;
    setNumberOfCompletions: (number: number) => void;
    addCompletion: () => void;
    editCompletion: (
        completion: { id: number; completion: Date },
        newValue: Date
    ) => void;
    removeCompletion: (completion: { id: number; completion: Date }) => void;
}) {
    return (
        <div className={styles["completions-list"]}>
            <h3 className={styles["completions-list__header"]}>Completions</h3>
            <div className={styles["completions-list__input"]}>
                <Input
                    type="number"
                    id="numberOfCompletions"
                    name="numberOfCompletions"
                    label="Number of completions"
                    labelDisplay="never"
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
                <Button type="button" onClick={addCompletion}>
                    <span className={styles["completions-list__button"]}>
                        <span>Add</span>
                        <Icon path={mdiPlusThick} size={"1.3em"} />
                    </span>
                </Button>
            </div>
            <div className={styles["completions-list__list"]}>
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
