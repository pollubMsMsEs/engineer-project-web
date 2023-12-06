"use client";

import { STATUSES } from "@/constantValues";
import { WorkInstanceFromAPI, WorkInstanceStatus } from "@/types/types";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import Icon from "@mdi/react";
import {
    mdiCheckboxMarkedCircleOutline,
    mdiCheckboxMarkedCirclePlusOutline,
} from "@mdi/js";
import { toast } from "react-toastify";
import styles from "./statusSwitcher.module.scss";
import Select from "../select/Select";
import Button from "../button/Button";

function hasViewingToday(workInstance: WorkInstanceFromAPI) {
    return workInstance.completions.some((viewing) =>
        dayjs(viewing).isSame(new Date(), "date")
    );
}

export default function StatusSwitcher({
    workInstance,
}: {
    workInstance: WorkInstanceFromAPI;
}) {
    const [_workInstance, setWorkInstance] = useState(workInstance);
    const [status, setStatus] = useState(_workInstance.status ?? "");
    const [viewedToday, setViewedToday] = useState(() => {
        return hasViewingToday(_workInstance);
    });

    function updateWorkInstance(workInstance: WorkInstanceFromAPI) {
        setWorkInstance((prevInstance) => {
            return { ...workInstance, work_id: prevInstance.work_id };
        });
        setStatus(workInstance.status);
        setViewedToday(hasViewingToday(workInstance));
    }

    useEffect(() => {
        if (
            status === _workInstance.status &&
            hasViewingToday(_workInstance) === viewedToday
        )
            return;

        const debounce = setTimeout(async () => {
            const didBegan = status === "doing" || status === "completed";
            const didFinished = status === "completed";

            const updatedWorkInstance: WorkInstanceFromAPI<string> = {
                ..._workInstance,
                work_id: _workInstance.work_id._id,
                status,
                number_of_completions: _workInstance.number_of_completions ?? 0,
                completions: [...(_workInstance.completions ?? [])],
                began_at:
                    _workInstance.began_at ??
                    (didBegan ? new Date() : undefined),
                finished_at:
                    _workInstance.finished_at ??
                    (didFinished ? new Date() : undefined),
            };

            const addedNewViewing =
                viewedToday && !hasViewingToday(_workInstance);

            if (addedNewViewing) {
                updatedWorkInstance.completions.push(new Date());
                updatedWorkInstance.number_of_completions++;
            }

            try {
                const response = await fetch(
                    `/api/workInstance/${_workInstance._id}`,
                    {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(updatedWorkInstance),
                    }
                );
                const result = await response.json();

                if (result.acknowledged) {
                    updateWorkInstance(result.updated);
                    if (addedNewViewing) {
                        toast.success(
                            `Added completion for "${
                                _workInstance.work_id.title ?? ""
                            }"`
                        );
                    }
                } else {
                    throw new Error();
                }
            } catch (error) {
                updateWorkInstance(_workInstance);
                toast.error("Status update failed");
            }
        }, 1000);

        return () => {
            clearTimeout(debounce);
        };
    }, [status, viewedToday, _workInstance]);

    return (
        <div className={styles["status-switcher"]}>
            <div className={styles["status-switcher__select-wrapper"]}>
                <Select
                    name={"status"}
                    id={`status-${_workInstance._id}`}
                    value={status}
                    options={Object.entries(STATUSES[_workInstance.type])}
                    onChange={(value) => {
                        setStatus(value as WorkInstanceStatus);
                    }}
                />
            </div>

            <Button
                disabled={viewedToday} //className={styles["status-switcher__view-button"]}
                style="icon"
                squared
                round
                onClick={() => {
                    setViewedToday(true);
                }}
                dataTooltipId="tooltip-add-viewing"
                dataTooltipContent={viewedToday ? "" : "Complete today"}
            >
                <Icon
                    path={
                        viewedToday
                            ? mdiCheckboxMarkedCircleOutline
                            : mdiCheckboxMarkedCirclePlusOutline
                    }
                    size={1}
                />
            </Button>
        </div>
    );
}
