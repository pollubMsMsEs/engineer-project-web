import { fetchAPIFromServerComponent } from "@/modules/serverSide";
import { MovieFromAPIPopulated } from "@/types/movieType";
import React from "react";

export const revalidate = 60;

export default async function All() {
    const response = await fetchAPIFromServerComponent("/work/all");
    const result: MovieFromAPIPopulated[] = await response.json();

    return (
        <ul>
            {result.map((m) => (
                <li key={m._id}>
                    <a href={`/work/${m._id}`}>{m.title}</a>
                    <ul>
                        {m.people.map((p) => {
                            return (
                                p.person_id && (
                                    <li key={p.person_id._id + m._id + p.role}>
                                        <a
                                            href={`/person/${p.person_id._id}`}
                                        >{`${p.person_id.name} ${
                                            p.person_id.nick
                                                ? `"${p.person_id.nick}" `
                                                : ""
                                        } ${p.person_id.surname}`}</a>
                                    </li>
                                )
                            );
                        })}
                    </ul>
                </li>
            ))}
        </ul>
    );
}
