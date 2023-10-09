"use client";

import { useState, useEffect, useRef } from "react";
import {
    MetaObject,
    Work,
    PersonInWork,
    Person,
    WorkFromAPIPopulated,
    PersonFromAPI,
} from "@/types/types";
import PersonInWorkForm, { PersonInWorkFormType } from "./PersonInWorkForm";
import dayjs from "dayjs";
import ErrorsDisplay from "@/components/ErrorsDisplay";
import { useRouter, useSearchParams } from "next/navigation";
import styles from "./workForm.module.scss";
import { useUniqueKey } from "@/hooks/useUniqueKey";
import { capitalize } from "radash";
import FilePicker from "./filePicker/FilePicker";
import Icon from "@mdi/react";
import { mdiDisc, mdiFloppy } from "@mdi/js";
import Image from "next/image";
import LoadingCircle from "./LoadingCircle";

type WorkToDB = Work & {
    _id?: string;
    people: (PersonInWork & {
        person_id: string | PersonFromAPI;
    })[];
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

export default function WorkForm({
    work,
    onSubmit,
}: {
    work?: WorkFromAPIPopulated;
    onSubmit?: (work: WorkFromAPIPopulated) => void;
}) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const getUniqueKey = useUniqueKey();
    const [editedRole, setEditedRole] = useState<string | undefined>();
    const [coverFile, setCoverFile] = useState<File>();
    const [isCoverNew, setIsCoverNew] = useState(false);
    const [fetchingState, setFetchingState] = useState<
        "cover" | "work" | false
    >(false);

    const [type, setType] = useState(
        work?.type ?? searchParams.get("type") ?? ""
    );
    const [title, setTitle] = useState(work?.title ?? "");
    const [description, setDescription] = useState(work?.description ?? "");
    const [cover, setCover] = useState<string | undefined>(work?.cover);
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

    async function trySubmitCover(): Promise<string | undefined> {
        if (isCoverNew && coverFile) {
            const formData = new FormData();
            formData.append("image", coverFile);

            const response = await fetch("/api/image/create", {
                method: "POST",
                body: formData,
            });
            const result = await response.json();

            if (result.acknowledged) {
                setIsCoverNew(false);
                return result.created;
            }
        }
    }

    async function submitForm() {
        setFetchingState("cover");

        let newCover = (await trySubmitCover()) || cover;
        setCover(newCover);

        const submittedWork: WorkToDB = {
            _id: work?._id,
            title,
            type,
            cover: newCover,
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

        setFetchingState("work");
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

        const updatedWork: WorkFromAPIPopulated = work
            ? result.updated
            : result.created;

        if (result.errors) {
            setErrors(result.errors);
            setFetchingState(false);
        } else {
            if (onSubmit) {
                onSubmit(updatedWork);
            }
        }
    }

    let submitBtnText: any = work ? "Update" : "Add";

    if (fetchingState) {
        switch (fetchingState) {
            case "cover":
                submitBtnText = (
                    <LoadingCircle size="15px" text={`Uploading photo... `} />
                );
                break;
            case "work":
                submitBtnText = (
                    <LoadingCircle size="15px" text={`Uploading ${type}... `} />
                );
                break;
        }
    }

    return (
        <div>
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    trySubmitCover();
                }}
            >
                {(coverFile || cover) && (
                    <Image
                        src={
                            coverFile ? URL.createObjectURL(coverFile) : cover!
                        }
                        alt="Work cover"
                        width={300}
                        height={400}
                        style={{ objectFit: "cover" }}
                    />
                )}
                <FilePicker
                    title="Pick cover"
                    name="cover"
                    acceptedTypes="image/*"
                    onChange={(fileList) => {
                        setCoverFile(fileList?.[0]);
                        setIsCoverNew(true);
                    }}
                />
                {false && ( // this will be usefull if endpoint for updating image will exist
                    <button type="submit" disabled={!coverFile}>
                        <Icon path={mdiFloppy} size={1} />
                    </button>
                )}
            </form>
            <form
                className={styles["work-form"]}
                onSubmit={(e) => {
                    e.preventDefault();
                    submitForm();
                }}
            >
                {work && <input type="hidden" name="_id" value={work._id} />}
                {work ? (
                    <div>{capitalize(work.type ?? "")}</div>
                ) : (
                    <select
                        onChange={(e) => {
                            setType(e.target.value);
                        }}
                        value={type}
                    >
                        <option value="book">Book</option>
                        <option value="movie">Movie</option>
                        <option value="computerGame">ComputerGame</option>
                    </select>
                )}
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
                <button type="submit">{submitBtnText}</button>
                <ErrorsDisplay errors={errors} />
            </form>
        </div>
    );
}
