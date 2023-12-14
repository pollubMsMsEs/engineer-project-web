import Button from "@/components/button/Button";
import Input from "@/components/input/Input";
import dayjs from "dayjs";
import React from "react";
import styles from "./completion.module.scss";
import Icon from "@mdi/react";
import { mdiMinusThick, mdiTrashCan } from "@mdi/js";

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
        <div className={styles["completion"]}>
            <Input
                type="date"
                name="completion"
                label=""
                labelDisplay="never"
                value={dayjs(completion.completion).format("YYYY-MM-DD")}
                min={published_at && dayjs(published_at).format("YYYY-MM-DD")}
                max={dayjs().format("YYYY-MM-DD")}
                onChange={(value) => {
                    editCompletion(completion, new Date(value));
                }}
            />
            <Button
                type="button"
                style="normal"
                squared
                padding="6px"
                onClick={() => {
                    removeCompletion(completion);
                }}
            >
                <Icon path={mdiTrashCan} size={"1.3em"} />
            </Button>
        </div>
    );
}
