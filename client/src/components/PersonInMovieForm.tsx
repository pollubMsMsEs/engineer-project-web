"use client";

import {
    PersonFromAPI,
    PersonInMovie,
    Person as PersonType,
} from "../types/movieType";
import PersonDetailForm from "./PersonDetailForm";
import styles from "./personInMovieForm.module.scss";

export type PersonInMovieFormType = PersonInMovie & {
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

export default function PersonInMovieForm({
    person,
    peopleToPick,
    index,
    editPersonCallback,
    deletePersonCallback,
    setEditedRoleCallback,
    getUniqueKey,
}: {
    person: PersonInMovieFormType;
    index: number;
    peopleToPick: PersonFromAPI[];
    editPersonCallback: (person: PersonInMovieFormType) => void;
    deletePersonCallback: (person: PersonInMovieFormType) => void;
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
        <div className={styles["person-in-movie-container"]}>
            <label htmlFor={`person${index}`}>Person</label>
            <div>
                <select
                    name={`person${index}`}
                    id={`person${index}`}
                    value={person.person_id}
                    required
                    onChange={(e) => {
                        person.person_id = e.target.value;
                        editPersonCallback(person);
                    }}
                >
                    {peopleToPick.map((personToPick) => (
                        <option
                            key={personToPick._id}
                            value={personToPick._id}
                        >{`${personToPick.name} ${
                            personToPick.nick ? `${personToPick.nick} ` : ""
                        } ${personToPick.surname}`}</option>
                    ))}
                </select>
                <button
                    type="button"
                    className={styles["delete-person-button"]}
                    onClick={() => {
                        deletePersonCallback(person);
                    }}
                >
                    -
                </button>
            </div>

            <label htmlFor={`role${index}`}>Role</label>
            {person.person_id === "" ? (
                <span>Pick person to set role</span>
            ) : (
                <input
                    type="text"
                    id={`role${index}`}
                    list="people-roles"
                    value={person.role}
                    required
                    onChange={(e) => {
                        person.role = e.target.value;
                        setEditedRoleCallback(e.target.value);
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
                <button
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
                </button>
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
