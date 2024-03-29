"use client";

import { useState, useEffect, useRef, useReducer } from "react";
import {
    MetaObject,
    Work,
    PersonInWork,
    Person,
    WorkFromAPIPopulated,
    PersonFromAPI,
    ExtractedErrors,
    WorkType,
} from "@/types/types";
import PersonInWorkForm, {
    PersonInWorkFormType,
} from "../personInWorkForm/PersonInWorkForm";
import dayjs from "dayjs";
import ErrorsDisplay from "@/components/errorsDisplay/ErrorsDisplay";
import { useRouter, useSearchParams } from "next/navigation";
import styles from "./workForm.module.scss";
import { useUniqueKey } from "@/hooks/useUniqueKey";
import { capitalize } from "radash";
import FilePicker from "../filePicker/FilePicker";
import Icon from "@mdi/react";
import {
    mdiCancel,
    mdiDisc,
    mdiFloppy,
    mdiPlus,
    mdiPlusThick,
    mdiTrashCan,
} from "@mdi/js";
import Image from "next/image";
import LoadingDisplay from "../loadingDisplay/LoadingDisplay";
import { tryExtractErrors } from "@/modules/errorsHandling";
import Button from "../button/Button";
import Select from "../select/Select";
import { TYPES } from "@/constantValues";
import Input from "../input/Input";
import TextArea from "../textArea/TextArea";
import ImageContainer from "../imageContainer/ImageContainer";
import { getAspectRatio, getTypeIcon } from "@/modules/ui";
import Modal from "../modal/Modal";
import PersonForm from "../personForm/PersonForm";
import FindPerson from "../findPerson/FindPerson";

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

export default function WorkForm({
    work,
    errors,
    errorsKey,
    fetchingState,
    setFetchingState,
    handleResponse,
    onSubmit,
    onCancel,
}: {
    work?: WorkFromAPIPopulated;
    errors: ExtractedErrors | undefined;
    errorsKey: string;
    fetchingState: "cover" | "work" | false;
    setFetchingState: (state: "cover" | "work" | false) => void;
    handleResponse: (response: Response) => Promise<any>;
    onSubmit?: (work: WorkFromAPIPopulated) => void;
    onCancel: () => void;
}) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const getUniqueKey = useUniqueKey();
    const [editedRole, setEditedRole] = useState<string | undefined>();
    const [coverFile, setCoverFile] = useState<File>();
    const [isCoverNew, setIsCoverNew] = useState(false);

    const [type, setType] = useState<WorkType>(
        work?.type ??
            (searchParams.get("type") as WorkType | undefined) ??
            "book"
    );
    const [title, setTitle] = useState(work?.title ?? "");
    const [description, setDescription] = useState(work?.description ?? "");
    const [cover, setCover] = useState<string | undefined>(work?.cover);
    const [publishedAt, setPublishedAt] = useState(
        work?.published_at
            ? dayjs(work.published_at).format("YYYY-MM-DD")
            : undefined
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
                    person_id: p.person_id,
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
    const [isPersonFormOpen, setIsPersonFormOpen] = useState(false);
    const [personFormKey, refreshPersonFormKey] = useReducer(() => {
        return Date.now();
    }, Date.now());

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

    async function trySubmitCover(): Promise<string | false | undefined> {
        if (isCoverNew && coverFile) {
            const formData = new FormData();
            formData.append("image", coverFile);

            const response = await fetch("/api/image/create", {
                method: "POST",
                body: formData,
            });

            const result = await handleResponse(response);

            if (!result) return false;

            if (result.acknowledged) {
                setIsCoverNew(false);
                return result.created;
            }
        } else {
            return cover;
        }
    }

    async function submitForm() {
        setFetchingState("cover");

        let newCover = await trySubmitCover();
        if (newCover === false) return;

        setCover(newCover);

        const peopleToRecover = people.map((p) => {
            p.details = Object.entries(p.formDetails).reduce<MetaObject>(
                (acc, [, data]) => ({ ...acc, [data.key]: data.values }),
                {}
            );
            return p;
        });

        const submittedWork: WorkToDB = {
            _id: work?._id,
            title,
            type,
            cover: newCover,
            dev: true,
            description,
            published_at: publishedAt ? new Date(publishedAt) : undefined,
            genres,
            metadata: Object.entries(metadata).reduce<MetaObject>(
                (acc, [, data]) => ({ ...acc, [data.key]: data.values }),
                {}
            ),
            people: people.map((p) => {
                return {
                    ...p,
                    person_id: p.person_id._id as any,
                    details: Object.entries(p.formDetails).reduce<MetaObject>(
                        (acc, [, data]) => ({
                            ...acc,
                            [data.key]: data.values,
                        }),
                        {}
                    ),
                };
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

        const result = await handleResponse(response);

        if (!result) return;

        const updatedWork: WorkFromAPIPopulated = work
            ? result.updated
            : result.created;

        updatedWork.people = peopleToRecover;

        if (onSubmit) {
            onSubmit(updatedWork);
        }
    }

    let submitBtnText: any = work ? "Update" : "Add";

    if (fetchingState) {
        switch (fetchingState) {
            case "cover":
                submitBtnText = (
                    <LoadingDisplay size="15px" text={`Uploading photo... `} />
                );
                break;
            case "work":
                submitBtnText = (
                    <LoadingDisplay
                        size="15px"
                        text={`Uploading ${type}... `}
                    />
                );
                break;
        }
    }

    return (
        <>
            <form
                className={styles["work-form"]}
                onSubmit={(e) => {
                    e.preventDefault();
                    submitForm();
                }}
            >
                {work && <input type="hidden" name="_id" value={work._id} />}
                <div className={styles["work-form__cover"]}>
                    {(coverFile || cover) && (
                        <ImageContainer
                            src={
                                coverFile
                                    ? URL.createObjectURL(coverFile)
                                    : cover!
                            }
                            alt="Work cover"
                            width="300px"
                            aspectRatio={getAspectRatio(type)}
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
                </div>
                <div className={styles["work-form__core"]}>
                    <div className={styles["work-form__title"]}>
                        {work ? (
                            <div>
                                <Icon
                                    path={getTypeIcon(work.type).path}
                                    size={1.5}
                                />
                            </div>
                        ) : (
                            <Select
                                name="type"
                                id="type"
                                label="Type"
                                value={type}
                                options={TYPES}
                                onChange={(value) => {
                                    setType(value as WorkType);
                                }}
                            />
                        )}
                        <Input
                            id="title"
                            type="text"
                            name="title"
                            label="Title"
                            required
                            value={title}
                            onChange={(value: any) => {
                                setTitle(value);
                            }}
                        />
                    </div>
                    <TextArea
                        id="description"
                        name="description"
                        label="Description"
                        value={description}
                        onChange={(value) => {
                            setDescription(value);
                        }}
                        height="300px"
                    />
                    <Input
                        id="published_at"
                        type="date"
                        name="published_at"
                        label="Published at"
                        labelDisplay="always"
                        value={publishedAt}
                        onChange={(value: any) => {
                            setPublishedAt(value);
                        }}
                    />
                    <Input
                        id="genres"
                        type="text"
                        name="genres"
                        label="Genres (space separated)"
                        value={genres.join(" ")}
                        onChange={(value: any, e) => {
                            if (value.includes(",")) {
                                e.target.setCustomValidity(
                                    "Separate values with space, not colon"
                                );
                            } else {
                                e.target.setCustomValidity("");
                            }
                            setGenres(value.split(" "));
                        }}
                    />
                </div>

                <div className={styles["work-form__people-wrapper"]}>
                    <header className={styles["work-form__people-header"]}>
                        <h3>People</h3>
                        <FindPerson
                            setPicked={(newPerson) => {
                                setPeople((prevPeople) => {
                                    return [
                                        ...prevPeople,
                                        {
                                            react_key: getUniqueKey(),
                                            role: "",
                                            person_id: newPerson,
                                            formDetails: {},
                                        },
                                    ];
                                });
                            }}
                        />

                        <Button
                            customStyle={{
                                display: "flex",
                                alignItems: "center",
                                gap: "5px",
                            }}
                            onClick={() => {
                                setIsPersonFormOpen(true);
                            }}
                        >
                            <span>New</span>
                            <Icon path={mdiPlusThick} size="1.2em" />
                        </Button>
                    </header>

                    <div className={styles["work-form__people-list"]}>
                        {people.map((p, index) => (
                            <PersonInWorkForm
                                key={p.react_key}
                                personInWork={p}
                                index={index}
                                editPersonCallback={editPersonCallback}
                                deletePersonCallback={deletePersonCallback}
                                setEditedRoleCallback={setEditedRoleCallback}
                                getUniqueKey={getUniqueKey}
                            />
                        ))}
                    </div>
                </div>
                <div className={styles["work-form__metadata-wrapper"]}>
                    <div className={styles["work-form__metadata-header"]}>
                        <h3>Metadata</h3>
                        <Button
                            padding="2px"
                            width="30px"
                            squared
                            round
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
                            <Icon path={mdiPlusThick} />
                        </Button>
                    </div>
                    <div>
                        {metadata &&
                            Object.entries(metadata).map(
                                ([reactKey, insideMetadata], index) => (
                                    <div
                                        key={reactKey}
                                        className={
                                            styles[
                                                "work-form__metadata-element"
                                            ]
                                        }
                                    >
                                        <Input
                                            type="text"
                                            id={`metakey${index}`}
                                            name={`metakey${index}`}
                                            value={insideMetadata.key}
                                            label="Key"
                                            required
                                            onChange={(value) => {
                                                setMetadata((prev) => {
                                                    return {
                                                        ...prev,
                                                        [reactKey]: {
                                                            key: value,
                                                            values: insideMetadata.values,
                                                        },
                                                    };
                                                });
                                            }}
                                        />
                                        <Input
                                            type="text"
                                            id={`metavalue${index}`}
                                            name={`metavalue${index}`}
                                            value={insideMetadata.values.join(
                                                " "
                                            )}
                                            label="Value"
                                            required
                                            onChange={(value, e) => {
                                                if (value.includes(",")) {
                                                    e.target.setCustomValidity(
                                                        "Separate values with space, not colon"
                                                    );
                                                } else {
                                                    e.target.setCustomValidity(
                                                        ""
                                                    );
                                                }

                                                setMetadata((prev) => {
                                                    return {
                                                        ...prev,
                                                        [reactKey]: {
                                                            key: insideMetadata.key,
                                                            values: e.target.value.split(
                                                                " "
                                                            ),
                                                        },
                                                    };
                                                });
                                            }}
                                        />
                                        <Button
                                            type="button"
                                            onClick={() => {
                                                delete metadata[
                                                    reactKey as unknown as number
                                                ];
                                                setMetadata({ ...metadata });
                                            }}
                                        >
                                            <Icon
                                                path={mdiTrashCan}
                                                size="1.2rem"
                                            />
                                        </Button>
                                    </div>
                                )
                            )}
                    </div>
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

                <ErrorsDisplay key={errorsKey} errors={errors} />
                <div className={styles["work-form__submit"]}>
                    <Button
                        type="submit"
                        style="normal"
                        size="big"
                        loading={fetchingState !== false}
                    >
                        {submitBtnText}
                    </Button>
                    <Button onClick={onCancel}>
                        <Icon
                            path={mdiCancel}
                            size={"2em"}
                            style={{ color: "#ef4444" }}
                        />
                    </Button>
                </div>
            </form>
            <Modal
                size="fit-content"
                isOpen={isPersonFormOpen}
                setIsOpen={setIsPersonFormOpen}
            >
                <PersonForm
                    key={personFormKey}
                    onSubmit={(newPerson) => {
                        setPeople((prevPeople) => {
                            return [
                                ...prevPeople,
                                {
                                    react_key: getUniqueKey(),
                                    role: "",
                                    person_id: newPerson,
                                    formDetails: {},
                                },
                            ];
                        });
                        setIsPersonFormOpen(false);
                        refreshPersonFormKey();
                    }}
                    onCancel={() => {
                        setIsPersonFormOpen(false);
                        refreshPersonFormKey();
                    }}
                />
            </Modal>
        </>
    );
}
