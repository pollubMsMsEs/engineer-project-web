"use client";

import { Work } from "@/types/types";
import { useState } from "react";
import React from "react";
import Link from "next/link";

async function deleteWork(_id: string) {
    const response = await fetch(`/api/work/${_id}`, {
        method: "DELETE",
    });
    const result = await response.json();

    return result;
}

export default function WorkList({ works: works }: { works: Work[] }) {
    const [workList, setWorkList] = useState(works);

    async function deleteWorkHandler(_id: string) {
        const result = await deleteWork(_id);
        const deletedWorkId = result && result.deleted?._id;
        if (deletedWorkId) {
            setWorkList((previousWorks) => {
                return previousWorks.filter((m) => m._id !== deletedWorkId);
            });
        }
    }

    return (
        <tbody>
            {workList.map((work) => (
                <tr key={work._id}>
                    <td>{work.title}</td>
                    <td>
                        {work.genres.reduce((acc, genre) => {
                            return `${acc}${genre}, `;
                        }, "")}
                    </td>
                    <td>
                        <a href={`/work/${work._id}`}>
                            <button>Details</button>
                        </a>
                        <Link href={`/work/${work._id}/edit`} prefetch={false}>
                            <button>Edit</button>
                        </Link>

                        <button
                            onClick={() => {
                                deleteWorkHandler(work._id!);
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
