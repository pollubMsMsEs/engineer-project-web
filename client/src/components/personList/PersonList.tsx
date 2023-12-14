"use client";

import { handleResponseErrorWithToast } from "@/modules/errorsHandling";
import { PersonFromAPI } from "@/types/types";
import Link from "next/link";
import React, { useState } from "react";
import { toast } from "react-toastify";
import Button from "../button/Button";
import styles from "./personList.module.scss";

async function deletePerson(_id: string) {
    const response = await fetch(`/api/person/${_id}`, {
        method: "DELETE",
    });

    if (!response.ok) {
        handleResponseErrorWithToast(response);
        return false;
    } else {
        return await response.json();
    }
}

export default function PersonList({ people }: { people: PersonFromAPI[] }) {
    const [peopleList, setPeopleList] = useState(people);

    async function deletePersonHandler(_id: string) {
        const result = await deletePerson(_id);
        const deletedPersonId = result && result.deleted?._id;
        if (deletedPersonId) {
            setPeopleList((previousPeople) => {
                return previousPeople.filter((m) => m._id !== deletedPersonId);
            });
        }
    }

    return (
        <tbody>
            {peopleList.map((person) => (
                <tr key={person._id}>
                    <td>{person.name}</td>
                    <td>{person.nick}</td>
                    <td>{person.surname}</td>
                    <td className={styles["person-list__operations"]}>
                        <Link
                            href={{
                                pathname: `/person/${person._id}/edit`,
                            }}
                        >
                            <Button>Edit</Button>
                        </Link>

                        <Button
                            onClick={() => {
                                deletePersonHandler(person._id);
                            }}
                        >
                            Delete
                        </Button>
                    </td>
                </tr>
            ))}
        </tbody>
    );
}
