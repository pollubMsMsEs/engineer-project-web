"use client";

import { useState, useEffect, useRef } from "react";
import {
    MetaObject,
    Work,
    PersonInWork,
    Person,
    WorkFromAPIPopulated,
} from "@/types/types";
import PersonInWorkForm, { PersonInWorkFormType } from "./PersonInWorkForm";
import dayjs from "dayjs";
import ErrorsDisplay from "@/components/ErrorsDisplay";
import { useRouter } from "next/navigation";
import styles from "./workForm.module.scss";
import { useUniqueKey } from "@/hooks/useUniqueKey";

type WorkToDB = Work & {
    people: (PersonInWork & { person_id: string })[];
};

type MetadataInForm = {
    [reactKey: number]: {
        key: string;
        values: string[];
    };
};

type PersonWithID = Person & { _id: string };

async function getPeopleToPick(): Promise<PersonWithID[]> {
    const response = await fetch("/api/person/all", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });
    return await response.json();
}

export default function WorkForm({ work }: { work?: WorkFromAPIPopulated }) {
    const router = useRouter();
    const uniqueKey = useRef(0);
    const getUniqueKey = useUniqueKey();
    const [editedRole, setEditedRole] = useState<string | undefined>();

    const [title, setTitle] = useState(work?.title ?? "");
    const [description, setDescription] = useState(work?.description ?? "");
    const [publishedAt, setPublishedAt] = useState(
        work ? dayjs(work.published_at).format("YYYY-MM-DD") : ""
    );
    const [genres, setGenres] = useState<string[]>(work?.genres ?? []);
    const [metadata, setMetadata] = useState<MetadataInForm>(
        work
            ? Object.entries(work.metadata).reduce<MetadataInForm>(
                  (acc, [key, values]) => {
                      acc[getUniqueKey()] = { key, values };
                      return acc;
                  },
                  {}
              )
            : {}
    );
    const [people, setPeople] = useState<PersonInWorkFormType[]>(
        work?.people
            .filter((p) => p?.person_id?._id)
            .map<PersonInWorkFormType>((p) => {
                const newPerson: PersonInWorkFormType = {
                    ...p,
                    person_id: p.person_id._id,
                    react_key: getUniqueKey(),
                    formDetails: {},
                };
                if (p.details) {
                    newPerson.formDetails = Object.entries(p.details).reduce(
                        (acc, [key, values]) => {
                            return {
                                ...acc,
                                [getUniqueKey()]: {
                                    key,
                                    values,
                                },
                            };
                        },
                        {}
                    );
                }
                return newPerson;
            }) ?? []
    );
    const [errors, setErrors] = useState([]);

    const [peopleToPick, setPeopleToPick] = useState<PersonWithID[]>([]);

    useEffect(() => {
        getPeopleToPick().then(setPeopleToPick);
    }, []);

    const roleSuggestions = people.reduce((roles: string[], person) => {
        if (
            person.role !== "" &&
            person.role !== editedRole &&
            roles.indexOf(person.role) === -1
        ) {
            roles.push(person.role);
        }
        return roles;
    }, []);

    const peopleDetailSuggestions = ["Character"];

    function deletePersonCallback(person: PersonInWorkFormType) {
        setPeople((prevPeople) => {
            return prevPeople.filter(
                (prevPerson) => prevPerson.react_key !== person.react_key
            );
        });
    }

    function editPersonCallback(person: PersonInWorkFormType) {
        setPeople((prevPeople) => {
            const index = prevPeople.findIndex(
                (prevPerson) => prevPerson.react_key === person.react_key
            );
            prevPeople[index] = person;

            return [...prevPeople];
        });
    }

    function setEditedRoleCallback(role: string) {
        setEditedRole(role);
    }

    async function submitForm() {
        const submittedWork: WorkToDB = {
            _id: work?._id,
            title,
            dev: true,
            description,
            published_at: new Date(publishedAt),
            genres,
            metadata: Object.entries(metadata).reduce<MetaObject>(
                (acc, [, data]) => ({ ...acc, [data.key]: data.values }),
                {}
            ),
            people: people.map((p) => {
                p.details = Object.entries(p.formDetails).reduce<MetaObject>(
                    (acc, [, data]) => ({ ...acc, [data.key]: data.values }),
                    {}
                );
                return p;
            }),
        };

        const response = work
            ? await fetch(`/api/work/${work._id}`, {
                  method: "PUT",
                  headers: {
                      "Content-Type": "application/json",
                  },
                  body: JSON.stringify(submittedWork),
              })
            : await fetch(`/api/work/create`, {
                  method: "POST",
                  headers: {
                      "Content-Type": "application/json",
                  },
                  body: JSON.stringify(submittedWork),
              });
        const result = await response.json();

        if (result.errors) {
            setErrors(result.errors);
        } else {
            router.push("/work/all");
        }
    }

    return (
        <form
            className={styles["work-form"]}
            onSubmit={(e) => {
                e.preventDefault();
                submitForm();
            }}
        >
            {work && <input type="hidden" name="_id" value={work._id} />}
            <label htmlFor="title">Title: </label>
            <input
                type="text"
                name="title"
                id="title"
                required
                value={title}
                onChange={(e) => {
                    setTitle(e.target.value);
                }}
            />
            <label htmlFor="description">Description: </label>
            <textarea
                name="description"
                id="description"
                value={description}
                onChange={(e) => {
                    setDescription(e.target.value);
                }}
            />
            <label htmlFor="published_at">Published at: </label>
            <input
                type="date"
                name="published_at"
                id="published_at"
                required
                value={publishedAt}
                onChange={(e) => {
                    setPublishedAt(e.target.value);
                }}
            />
            <label htmlFor="genres">Genres (space seperated):</label>
            <input
                type="input"
                name="genres"
                id="genres"
                value={genres.join(" ")}
                onChange={(e) => {
                    if (e.target.value.includes(",")) {
                        e.target.setCustomValidity(
                            "Seperate values with space, not colon"
                        );
                    } else {
                        e.target.setCustomValidity("");
                    }
                    setGenres(e.target.value.split(" "));
                }}
            />
            <header className={styles["people-header"]}>
                <h3>People</h3>
                {peopleToPick && (
                    <button
                        type="button"
                        onClick={() => {
                            setPeople((prevPeople) => {
                                return [
                                    ...prevPeople,
                                    {
                                        react_key: getUniqueKey(),
                                        role: "",
                                        person_id: peopleToPick[0]._id,
                                        formDetails: {},
                                    },
                                ];
                            });
                        }}
                    >
                        +
                    </button>
                )}
            </header>

            <div className={styles["people"]}>
                {peopleToPick.length === 0 ? (
                    <span>No people in database, create some first</span>
                ) : (
                    people.map((p, index) => (
                        <PersonInWorkForm
                            key={p.react_key}
                            person={p}
                            peopleToPick={peopleToPick}
                            index={index}
                            editPersonCallback={editPersonCallback}
                            deletePersonCallback={deletePersonCallback}
                            setEditedRoleCallback={setEditedRoleCallback}
                            getUniqueKey={getUniqueKey}
                        />
                    ))
                )}
            </div>
            <div className={styles["metadata-header"]}>
                <h3>Metadata</h3>
                <button
                    type="button"
                    onClick={() => {
                        setMetadata((prev) => {
                            return {
                                ...prev,
                                [getUniqueKey()]: {
                                    key: "",
                                    values: [],
                                },
                            };
                        });
                    }}
                >
                    +
                </button>
            </div>
            <div>
                {metadata &&
                    Object.entries(metadata).map(
                        ([reactKey, metadata], index) => (
                            <div key={reactKey}>
                                <input
                                    type="text"
                                    name={`metakey${index}`}
                                    value={metadata.key}
                                    required
                                    onChange={(e) => {
                                        setMetadata((prev) => {
                                            return {
                                                ...prev,
                                                [reactKey]: {
                                                    key: e.target.value,
                                                    values: metadata.values,
                                                },
                                            };
                                        });
                                    }}
                                />
                                <input
                                    type="text"
                                    name={`metavalue${index}`}
                                    value={metadata.values.join(" ")}
                                    required
                                    onChange={(e) => {
                                        if (e.target.value.includes(",")) {
                                            e.target.setCustomValidity(
                                                "Seperate values with space, not colon"
                                            );
                                        } else {
                                            e.target.setCustomValidity("");
                                        }

                                        setMetadata((prev) => {
                                            return {
                                                ...prev,
                                                [reactKey]: {
                                                    key: metadata.key,
                                                    values: e.target.value.split(
                                                        " "
                                                    ),
                                                },
                                            };
                                        });
                                    }}
                                />
                            </div>
                        )
                    )}
            </div>
            <datalist id="people-roles">
                {roleSuggestions.map((r) => (
                    <option key={r} value={r}>
                        {r}
                    </option>
                ))}
            </datalist>
            <datalist id="people-details">
                {peopleDetailSuggestions.map((r) => (
                    <option key={r} value={r}>
                        {r}
                    </option>
                ))}
            </datalist>
            <button type="submit">{work ? "Update" : "Add"}</button>
            <ErrorsDisplay errors={errors} />
        </form>
    );
}
