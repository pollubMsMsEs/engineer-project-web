"use client";

import { personToString } from "@/modules/ui";
import {
    PersonFromAPI,
    PersonInWork,
    Person as PersonType,
} from "../../types/types";
import Button from "../button/Button";
import Input from "../input/Input";
import PersonDetailForm from "../personDetailForm/PersonDetailForm";
import Select from "../select/Select";
import styles from "./personInWorkForm.module.scss";
import Icon from "@mdi/react";
import { mdiAccount, mdiBriefcase, mdiPlusThick, mdiTrashCan } from "@mdi/js";

export type PersonInWorkFormType = PersonInWork & {
    react_key: number;
    person_id: PersonFromAPI;
} & {
    formDetails: {
        [reactKey: number]: {
            key: string;
            values: string[];
        };
    };
};

export default function PersonInWorkForm({
    personInWork,
    index,
    editPersonCallback,
    deletePersonCallback,
    setEditedRoleCallback,
    getUniqueKey,
}: {
    personInWork: PersonInWorkFormType;
    index: number;
    editPersonCallback: (person: PersonInWorkFormType) => void;
    deletePersonCallback: (person: PersonInWorkFormType) => void;
    setEditedRoleCallback: (role: string) => void;
    getUniqueKey: () => number;
}) {
    function editDetailCallback(
        key: number,
        data: {
            key: string;
            values: string[];
        }
    ) {
        personInWork.formDetails[key] = data;

        editPersonCallback(personInWork);
    }

    function deleteDetailCallback(key: number) {
        delete personInWork.formDetails[key];
        editPersonCallback(personInWork);
    }

    return (
        <div className={styles["person-in-work"]}>
            <Button
                type="button"
                customStyle={{ position: "absolute", top: "4px", right: "4px" }}
                onClick={() => {
                    deletePersonCallback(personInWork);
                }}
            >
                <Icon path={mdiTrashCan} size={1} />
            </Button>

            <span className={styles["person-in-work__title"]}>
                <Icon path={mdiAccount} size={1} />
                {personToString(personInWork.person_id)}
            </span>
            <span className={styles["person-in-work__title"]}>
                <Icon path={mdiBriefcase} size={1} />
                <Input
                    type="text"
                    id={`role${index}`}
                    name={`role${index}`}
                    list="people-roles"
                    value={personInWork.role}
                    label="Role"
                    labelDisplay="never"
                    required
                    style={{ fontSize: "1rem", width: "150px" }}
                    onChange={(value) => {
                        personInWork.role = value;
                        setEditedRoleCallback(value);
                        editPersonCallback(personInWork);
                    }}
                    onFocus={(e) => {
                        setEditedRoleCallback(e.target.value);
                    }}
                    onBlur={() => {
                        setEditedRoleCallback("");
                    }}
                />
            </span>

            <header className={styles["details"]}>
                <h4>Details</h4>
                <Button
                    type="button"
                    squared
                    round
                    padding="2px"
                    onClick={() => {
                        const uniqueKey = getUniqueKey();

                        personInWork.formDetails[uniqueKey] = {
                            key: "",
                            values: [""],
                        };

                        editPersonCallback(personInWork);
                    }}
                >
                    <Icon path={mdiPlusThick} size={1} />
                </Button>
            </header>
            <div className={styles["details-container"]}>
                {personInWork.formDetails &&
                    Object.entries(personInWork.formDetails).map(
                        ([reactKey, data]) => (
                            <PersonDetailForm
                                key={reactKey}
                                uniqueKey={Number.parseInt(reactKey)}
                                data={data}
                                editDetailCallback={editDetailCallback}
                                deleteDetailCallback={deleteDetailCallback}
                            />
                        )
                    )}
            </div>
        </div>
    );
}
