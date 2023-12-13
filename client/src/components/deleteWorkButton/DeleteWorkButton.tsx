"use client";
import React from "react";
import Icon from "@mdi/react";
import { mdiTrashCan } from "@mdi/js";
import { WorkFromAPIPopulated, WorkInstanceFromAPI } from "@/types/types";
import { useRouter } from "next/navigation";
import Button from "../button/Button";

export default function DeleteWork({
    workInstance,
}: {
    workInstance:
        | WorkInstanceFromAPI
        | WorkInstanceFromAPI<WorkFromAPIPopulated>;
}) {
    const router = useRouter();

    return (
        <Button
            onClick={async () => {
                const responseInstance = await fetch(
                    `/api/workInstance/${workInstance._id}`,
                    {
                        method: "DELETE",
                    }
                );
                const resultInstance = await responseInstance.json();

                if (resultInstance.acknowledged) {
                    const responseWork = await fetch(
                        `/api/${
                            workInstance.from_api ? "workFromAPI" : "work"
                        }/${workInstance.work_id._id}`,
                        {
                            method: "DELETE",
                        }
                    );
                    const resultWork = await responseWork.json();

                    if (resultWork.acknowledged) {
                        router.push("/", {});
                        router.refresh();
                    }
                }
            }}
        >
            <Icon path={mdiTrashCan} size={1} />
        </Button>
    );
}
