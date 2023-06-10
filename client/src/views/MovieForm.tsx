import { useState, useEffect } from "react";
import {
    redirect,
    useLocation,
    useNavigate,
    useParams,
} from "react-router-dom";
import { MetaObject, PersonInMovie } from "../types/movieType";

export default function MovieForm() {
    const navigate = useNavigate();
    const { _id } = useParams();
    const [editedRole, setEditedRole] = useState("");

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [publishedAt, setPublishedAt] = useState("");
    const [genres, setGenres] = useState<string[]>([]);
    const [metadata, setMetadata] = useState<MetaObject>({});
    const [detailKey, setDetailKey] = useState(0);
    const [people, setPeople] = useState<
        (PersonInMovie & { person_id: string } & {
            formDetails?: {
                [reactKey: number]: { key: string; values: string[] };
            };
        })[]
    >([]);

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

    return (
        <form style={{ display: "grid", justifyContent: "start" }}>
            {_id && <input type="hidden" name="_id" value={_id} />}
            <label htmlFor="title">Title: </label>
            <input
                type="title"
                name="title"
                id="title"
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
                    console.log(genres);
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
                <button
                    type="button"
                    onClick={() => {
                        setPeople((prevPeople) => {
                            return [...prevPeople, { role: "", person_id: "" }];
                        });
                    }}
                >
                    +
                </button>
            </div>

            <div
                style={{ display: "flex", flexWrap: "wrap", gap: "10px 20px" }}
            >
                {people.map((p, index) => (
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns: "min-content 1fr",
                            gap: "5px",
                        }}
                    >
                        <button
                            type="button"
                            style={{
                                gridColumn: "2",
                                justifySelf: "end",
                                padding: "0 10px",
                            }}
                            onClick={() => {
                                setPeople((prevPeople) => {
                                    return prevPeople.filter(
                                        (prevPerson) =>
                                            prevPerson.person_id !== p.person_id
                                    );
                                });
                            }}
                        >
                            -
                        </button>
                        <label htmlFor={`person${index}`}>Person</label>
                        <input
                            type="text"
                            id={`person${index}`}
                            value={p.person_id}
                            onChange={(e) => {
                                setPeople((prevPeople) => {
                                    const index = prevPeople.findIndex(
                                        (prevPerson) =>
                                            prevPerson.person_id === p.person_id
                                    );

                                    const prevPerson = prevPeople[index];
                                    prevPerson.person_id = e.target.value;
                                    prevPeople[index] = prevPerson;

                                    return [...prevPeople];
                                });
                            }}
                        />
                        <label htmlFor={`role${index}`}>Role</label>
                        {p.person_id === "" ? (
                            <span>Pick person to set role</span>
                        ) : (
                            <input
                                type="text"
                                id={`role${index}`}
                                list="people-roles"
                                value={p.role}
                                onChange={(e) => {
                                    setPeople((prevPeople) => {
                                        const index = prevPeople.findIndex(
                                            (prevPerson) =>
                                                prevPerson.person_id ===
                                                p.person_id
                                        );

                                        const prevPerson = prevPeople[index];
                                        prevPerson.role = e.target.value;
                                        setEditedRole(e.target.value);
                                        prevPeople[index] = prevPerson;

                                        return [...prevPeople];
                                    });
                                }}
                                onFocus={(e) => {
                                    setEditedRole(e.target.value);
                                }}
                                onBlur={() => {
                                    setEditedRole("");
                                }}
                            />
                        )}
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "5px",
                                gridColumn: "1 / -1",
                            }}
                        >
                            <h4 style={{ margin: "0" }}>Details</h4>
                            <button
                                style={{ padding: "5px", aspectRatio: "1/1" }}
                                type="button"
                                onClick={() => {
                                    setPeople((prevPeople) => {
                                        const index = prevPeople.findIndex(
                                            (prevPerson) =>
                                                prevPerson.person_id ===
                                                p.person_id
                                        );

                                        const prevPerson = prevPeople[index];
                                        if (
                                            prevPerson.formDetails == undefined
                                        ) {
                                            prevPerson.formDetails = {
                                                [detailKey]: {
                                                    key: "",
                                                    values: [""],
                                                },
                                            };
                                        } else {
                                            prevPerson.formDetails[detailKey] =
                                                {
                                                    key: "",
                                                    values: [""],
                                                };
                                        }

                                        setDetailKey((prevKey) => {
                                            console.log(prevKey);
                                            return prevKey + 1;
                                        });

                                        prevPeople[index] = prevPerson;

                                        return [...prevPeople];
                                    });
                                }}
                            >
                                +
                            </button>
                        </div>
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "stretch",
                                gap: "5px",
                                gridColumn: "1 / -1",
                            }}
                        >
                            {p.formDetails &&
                                Object.entries(p.formDetails).map(
                                    ([reactKey, data]) => (
                                        <div key={reactKey}>
                                            <input
                                                type="text"
                                                value={data.key}
                                                onChange={(e) => {
                                                    setPeople((prevPeople) => {
                                                        const index =
                                                            prevPeople.findIndex(
                                                                (prevPerson) =>
                                                                    prevPerson.person_id ===
                                                                    p.person_id
                                                            );

                                                        const prevPerson =
                                                            prevPeople[index];
                                                        prevPerson.formDetails![
                                                            Number.parseInt(
                                                                reactKey
                                                            )
                                                        ].key = e.target.value;

                                                        prevPeople[index] =
                                                            prevPerson;

                                                        return [...prevPeople];
                                                    });
                                                }}
                                            />
                                            {data && (
                                                <input
                                                    type="text"
                                                    value={data.values.join(
                                                        " "
                                                    )}
                                                    onChange={(e) => {
                                                        setPeople(
                                                            (prevPeople) => {
                                                                const index =
                                                                    prevPeople.findIndex(
                                                                        (
                                                                            prevPerson
                                                                        ) =>
                                                                            prevPerson.person_id ===
                                                                            p.person_id
                                                                    );

                                                                const prevPerson =
                                                                    prevPeople[
                                                                        index
                                                                    ];
                                                                prevPerson.formDetails![
                                                                    Number.parseInt(
                                                                        reactKey
                                                                    )
                                                                ].values =
                                                                    e.target.value.split(
                                                                        " "
                                                                    );

                                                                prevPeople[
                                                                    index
                                                                ] = prevPerson;

                                                                return [
                                                                    ...prevPeople,
                                                                ];
                                                            }
                                                        );
                                                    }}
                                                />
                                            )}
                                            <button
                                                style={{
                                                    padding: "5px",
                                                    aspectRatio: "1/1",
                                                }}
                                                type="button"
                                                onClick={() => {
                                                    setPeople((prevPeople) => {
                                                        const index =
                                                            prevPeople.findIndex(
                                                                (prevPerson) =>
                                                                    prevPerson.person_id ===
                                                                    p.person_id
                                                            );

                                                        const prevPerson =
                                                            prevPeople[index];

                                                        delete prevPerson.formDetails![
                                                            Number.parseInt(
                                                                reactKey
                                                            )
                                                        ];

                                                        prevPeople[index] =
                                                            prevPerson;

                                                        return [...prevPeople];
                                                    });
                                                }}
                                            >
                                                -
                                            </button>
                                        </div>
                                    )
                                )}
                        </div>
                    </div>
                ))}
            </div>
            <datalist id="people-roles">
                {roleSuggestions.map((r) => (
                    <option value={r}>{r}</option>
                ))}
            </datalist>
            <datalist id="people-details">
                {peopleDetailSuggestions.map((r) => (
                    <option value={r}>{r}</option>
                ))}
            </datalist>
        </form>
    );
}
