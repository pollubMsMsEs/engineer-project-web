"use client";

import { useEffect, useState } from "react";
import { ExtractedErrors, Person, PersonFromAPI } from "../../types/types";
import ErrorsDisplay from "../errorsDisplay/ErrorsDisplay";
import { useRouter } from "next/navigation";
import styles from "./personForm.module.scss";
import { tryExtractErrors } from "@/modules/errorsHandling";
import { useHandleRequest } from "@/hooks/useHandleRequests";
import LoadingDisplay from "../loadingDisplay/LoadingDisplay";
import Button from "../button/Button";
import Input from "../input/Input";
import Icon from "@mdi/react";
import { mdiCancel } from "@mdi/js";

export default function PersonForm({
    person,
    onSubmit,
    onCancel,
}: {
    person?: PersonFromAPI;
    onSubmit?: (person: PersonFromAPI) => void;
    onCancel?: () => void;
}) {
    const router = useRouter();

    const [name, setName] = useState(person?.name ?? "");
    const [nick, setNick] = useState(person?.nick ?? "");
    const [surname, setSurname] = useState(person?.surname ?? "");
    const {
        errors,
        errorsKey,
        fetchingState,
        setFetchingState,
        handleResponse,
    } = useHandleRequest<true>();

    const buttonText = person?._id ? "Update" : "Add";

    async function submitForm() {
        setFetchingState(true);
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

        const result = await handleResponse(response);

        if (!result) return;

        const newPerson = person ? result.updated : result.created;

        if (onSubmit) {
            onSubmit(newPerson);
        } else {
            router.push("/person/all");
        }
    }

    return (
        <form
            className={styles["person-form"]}
            onSubmit={(e) => {
                e.preventDefault();
                e.currentTarget.reportValidity();
                submitForm();
            }}
        >
            {person?._id && (
                <input type="hidden" name="_id" value={person?._id} />
            )}
            <Input
                type="text"
                name="name"
                id="name"
                label="Name"
                required
                value={name}
                onChange={(value) => {
                    setName(value);
                }}
            />
            <Input
                type="text"
                name="nick"
                id="nick"
                label="Nick"
                value={nick}
                onChange={(value) => {
                    setNick(value);
                }}
            />
            <Input
                type="text"
                name="surname"
                id="surname"
                label="Surname"
                required
                value={surname}
                onChange={(value) => {
                    setSurname(value);
                }}
            />
            <ErrorsDisplay key={errorsKey} errors={errors} />
            <div className={styles["person-form__submit"]}>
                <Button
                    type="submit"
                    loading={fetchingState}
                    customStyle={{
                        paddingLeft: "30px",
                        paddingRight: "30px",
                        fontSize: "1.2rem",
                    }}
                >
                    {fetchingState ? (
                        <LoadingDisplay size="1.3rem" />
                    ) : (
                        buttonText
                    )}
                </Button>
                <Button
                    onClick={() => {
                        if (onCancel) {
                            onCancel();
                        } else {
                            router.push("/person/all");
                        }
                    }}
                >
                    <Icon
                        path={mdiCancel}
                        size={"1.5em"}
                        style={{ color: "#ef4444" }}
                    />
                </Button>
            </div>
        </form>
    );
}
