import { WorkInstanceFromAPI } from "@/types/types";
import Image from "next/image";
import React from "react";
import Icon from "@mdi/react";
import { mdiImageOff } from "@mdi/js";

export default function WorkInstanceCard({
    workInstance,
}: {
    workInstance: WorkInstanceFromAPI;
}) {
    const { title, cover } = workInstance.work_id;

    return (
        <div>
            {cover ? (
                <Image
                    src={cover}
                    alt={`${title} cover`}
                    width={300}
                    height={300}
                />
            ) : (
                <Icon path={mdiImageOff} size={1} />
            )}
            <div>{title}</div>
        </div>
    );
}
