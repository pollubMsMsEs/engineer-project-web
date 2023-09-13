"use client";

import { useState, useEffect, useRef } from "react";
import {
    MetaObject,
    Movie,
    PersonInMovie,
    Person,
    PopulatedMovieFromAPI,
} from "@/types/movieType";
import PersonInMovieForm, {
    PersonInMovieFormType,
} from "../components/PersonInMovieForm";
import dayjs from "dayjs";
import ErrorsDisplay from "@/components/ErrorsDisplay";
import { useRouter } from "next/navigation";

type MovieToDB = Movie & {
    people: (PersonInMovie & { person_id: string })[];
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

export default function MovieForm({
    movie,
}: {
    movie?: PopulatedMovieFromAPI;
}) {
    const router = useRouter();
    const uniqueKey = useRef(0);
    const [editedRole, setEditedRole] = useState<string | undefined>();

    const [title, setTitle] = useState(movie?.title ?? "");
    const [description, setDescription] = useState(movie?.description ?? "");
    const [publishedAt, setPublishedAt] = useState(
        movie ? dayjs(movie.published_at).format("YYYY-MM-DD") : ""
    );
    const [genres, setGenres] = useState<string[]>(movie?.genres ?? []);
    const [metadata, setMetadata] = useState<MetadataInForm>(
        movie
            ? Object.entries(movie.metadata).reduce<MetadataInForm>(
                  (acc, [key, values]) => {
                      acc[getUniqueKey()] = { key, values };
                      return acc;
                  },
                  {}
              )
            : {}
    );
    const [people, setPeople] = useState<PersonInMovieFormType[]>(
        movie?.people
            .filter((p) => p?.person_id?._id)
            .map<PersonInMovieFormType>((p) => {
                const newPerson: PersonInMovieFormType = {
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

    function deletePersonCallback(person: PersonInMovieFormType) {
        setPeople((prevPeople) => {
            return prevPeople.filter(
                (prevPerson) => prevPerson.react_key !== person.react_key
            );
        });
    }

    function editPersonCallback(person: PersonInMovieFormType) {
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

    function getUniqueKey() {
        uniqueKey.current++;

        console.log(uniqueKey);
        return uniqueKey.current;
    }

    async function submitForm() {
        const submittedMovie: MovieToDB = {
            _id: movie?._id,
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

        console.log(submittedMovie);

        const response = movie
            ? await fetch(`/api/movie/${movie._id}`, {
                  method: "PUT",
                  headers: {
                      "Content-Type": "application/json",
                  },
                  body: JSON.stringify(submittedMovie),
              })
            : await fetch(`/api/movie/create`, {
                  method: "POST",
                  headers: {
                      "Content-Type": "application/json",
                  },
                  body: JSON.stringify(submittedMovie),
              });
        console.log(response);
        const result = await response.json();

        if (result.errors) {
            setErrors(result.errors);
        } else {
            router.push("/movie/all");
        }
    }

    return (
        <div
            style={{
                display: "grid",
                gridTemplateColumns: "1fr max(200px,10%)",
            }}
        >
            <form
                style={{ display: "grid", justifyContent: "start" }}
                onSubmit={(e) => {
                    e.preventDefault();
                    submitForm();
                }}
            >
                {movie && <input type="hidden" name="_id" value={movie._id} />}
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
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                    }}
                >
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
                </div>

                <div
                    style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: "10px 20px",
                    }}
                >
                    {peopleToPick.length === 0 ? (
                        <span>No people in database, create some first</span>
                    ) : (
                        people.map((p, index) => (
                            <PersonInMovieForm
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
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                    }}
                >
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
                <button type="submit">{movie ? "Update" : "Add"}</button>
            </form>
            <ErrorsDisplay errors={errors} />
        </div>
    );
}
