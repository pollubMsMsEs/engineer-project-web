"use client";
import { useRouter } from "next/navigation";
import { MetaObject, Person, PersonFromAPI } from "../../types/types";
import styles from "./person.module.scss";
import Icon from "@mdi/react";
import { mdiTrashCan } from "@mdi/js";
import { toast } from "react-toastify";
import Button from "../button/Button";
import { personToString } from "@/modules/ui";

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

export default function Person({
    person,
    details,
    readOnly,
}: {
    person: PersonFromAPI;
    details?: MetaObject;
    readOnly: boolean;
}) {
    const router = useRouter();

    async function deletePersonHandler(_id: string) {
        const result = await deletePerson(_id);
        const deletedPersonId = result && result.deleted?._id;
        if (deletedPersonId) {
            router.push("/");
        }
    }

    return (
        <div className={styles["person"]}>
            <span className={styles["person__name"]}>
                {personToString(person)}
            </span>
            {details && (
                <div className={styles["person__details"]}>
                    {Object.entries(details).map(([key, values]) => (
                        <div key={key}>
                            <span>
                                {key.charAt(0).toUpperCase() + key.substring(1)}
                                {": "}
                            </span>
                            <span>
                                {Array.isArray(values) ? values[0] : values}
                            </span>
                        </div>
                    ))}
                </div>
            )}
            {!readOnly && (
                <Button
                    onClick={() => {
                        deletePersonHandler(person._id);
                    }}
                >
                    <Icon path={mdiTrashCan} size={1} />
                </Button>
            )}
        </div>
    );
}
