"use client";

import { useEffect, useState } from "react";
import { Person, PersonFromAPI } from "../types/types";
import ErrorsDisplay from "../components/ErrorsDisplay";
import { useRouter } from "next/navigation";
import styles from "./personForm.module.scss";

export default function PersonForm({ person }: { person?: PersonFromAPI }) {
    const router = useRouter();

    const [name, setName] = useState(person?.name ?? "");
    const [nick, setNick] = useState(person?.nick ?? "");
    const [surname, setSurname] = useState(person?.surname ?? "");

    const [errors, setErrors] = useState([]);

    async function submitForm() {
        const submittedPerson: Person & { _id: string | undefined } = {
            _id: person?._id,
            name,
            nick: nick === "" ? undefined : nick,
            surname,
        };

        const response = person
            ? await fetch(`/api/person/${person._id}`, {
                  method: "PUT",
                  headers: {
                      "Content-Type": "application/json",
                  },
                  body: JSON.stringify(submittedPerson),
              })
            : await fetch(`/api/person/create`, {
                  method: "POST",
                  headers: {
                      "Content-Type": "application/json",
                  },
                  body: JSON.stringify(submittedPerson),
              });

        const result = await response.json();

        if (result.errors) {
            setErrors(result.errors);
        } else {
            router.push("/person/all");
        }
    }

    return (
        <div className={styles["person-form-container"]}>
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    e.currentTarget.reportValidity();
                    submitForm();
                }}
            >
                {person?._id && (
                    <input type="hidden" name="_id" value={person?._id} />
                )}
                <label htmlFor="name">Name: </label>
                <input
                    type="text"
                    name="name"
                    id="name"
                    value={name}
                    required
                    onChange={(e) => {
                        setName(e.target.value);
                    }}
                />
                <label htmlFor="nick">Nick: </label>
                <input
                    type="text"
                    name="nick"
                    id="nick"
                    value={nick}
                    onChange={(e) => {
                        setNick(e.target.value);
                    }}
                />
                <label htmlFor="surname">Surname: </label>
                <input
                    type="text"
                    name="surname"
                    id="surname"
                    required
                    value={surname}
                    onChange={(e) => {
                        setSurname(e.target.value);
                    }}
                />
                <button type="submit">{person?._id ? "Update" : "Add"}</button>
            </form>
            <ErrorsDisplay errors={errors} />
        </div>
    );
}
