"use client";

import { PersonFromAPI } from "@/types/types";
import Link from "next/link";
import React, { useState } from "react";
import { toast } from "react-toastify";

async function deletePerson(_id: string) {
    const response = await fetch(`/api/person/${_id}`, {
        method: "DELETE",
    });
    const result = await response.json();

    const msg = result?.errors?.[0]?.msg;
    if (msg) {
        toast.error(msg);
        return false;
    }

    return result;
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
                    <td>
                        <a href={`/person/${person._id}`}>
                            <button>Details</button>
                        </a>
                        <Link
                            href={{
                                pathname: `/person/${person._id}/edit`,
                            }}
                        >
                            <button>Edit</button>
                        </Link>

                        <button
                            onClick={() => {
                                deletePersonHandler(person._id);
                            }}
                        >
                            Delete
                        </button>
                    </td>
                </tr>
            ))}
        </tbody>
    );
}
