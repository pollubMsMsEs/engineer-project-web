"use client";

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

export type PersonInWorkFormType = PersonInWork & {
    react_key: number;
    person_id: string;
} & {
    formDetails: {
        [reactKey: number]: {
            key: string;
            values: string[];
        };
    };
};

export default function PersonInWorkForm({
    person,
    peopleToPick,
    index,
    editPersonCallback,
    deletePersonCallback,
    setEditedRoleCallback,
    getUniqueKey,
}: {
    person: PersonInWorkFormType;
    index: number;
    peopleToPick: PersonFromAPI[];
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
        person.formDetails[key] = data;

        editPersonCallback(person);
    }

    function deleteDetailCallback(key: number) {
        delete person.formDetails[key];
        editPersonCallback(person);
    }

    return (
        <div className={styles["person-in-work-container"]}>
            <label htmlFor={`person${index}`}>Person</label>
            <div>
                <Select
                    id={`person${index}`}
                    name={`person${index}`}
                    label="Person"
                    value={person.person_id}
                    required
                    options={peopleToPick.map((person) => [
                        person._id,
                        `${person.name} ${
                            person.nick ? `${person.nick} ` : ""
                        } ${person.surname}`,
                    ])}
                    onChange={(value) => {
                        const newPerson: PersonInWorkFormType = {
                            ...person,
                            person_id: value,
                        };
                        editPersonCallback(newPerson);
                    }}
                />
                <Button
                    type="button"
                    onClick={() => {
                        deletePersonCallback(person);
                    }}
                >
                    -
                </Button>
            </div>

            <label htmlFor={`role${index}`}>Role</label>
            {person.person_id === "" ? (
                <span>Pick person to set role</span>
            ) : (
                <Input
                    type="text"
                    id={`role${index}`}
                    name={`role${index}`}
                    list="people-roles"
                    value={person.role}
                    label="Role"
                    required
                    onChange={(value) => {
                        person.role = value;
                        setEditedRoleCallback(value);
                        editPersonCallback(person);
                    }}
                    onFocus={(e) => {
                        setEditedRoleCallback(e.target.value);
                    }}
                    onBlur={() => {
                        setEditedRoleCallback("");
                    }}
                />
            )}
            <header className={styles["details"]}>
                <h4>Details</h4>
                <Button
                    type="button"
                    onClick={() => {
                        const uniqueKey = getUniqueKey();

                        person.formDetails[uniqueKey] = {
                            key: "",
                            values: [""],
                        };

                        editPersonCallback(person);
                    }}
                >
                    +
                </Button>
            </header>
            <div className={styles["details-container"]}>
                {person.formDetails &&
                    Object.entries(person.formDetails).map(
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
