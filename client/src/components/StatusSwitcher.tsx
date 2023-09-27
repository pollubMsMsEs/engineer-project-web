"use client";

import { statuses } from "@/modules/workInstanceStatus";
import { WorkInstanceFromAPI } from "@/types/types";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import Icon from "@mdi/react";
import {
    mdiCheckboxMarkedCircleOutline,
    mdiCheckboxMarkedCirclePlusOutline,
} from "@mdi/js";
import { toast } from "react-toastify";

function hasViewingToday(workInstance: WorkInstanceFromAPI) {
    return workInstance.viewings.some((viewing) =>
        dayjs(viewing).isSame(new Date(), "date")
    );
}

export default function StatusSwitcher({
    workInstance,
}: {
    workInstance: WorkInstanceFromAPI;
}) {
    const [_workInstance, setWorkInstance] = useState(workInstance);
    const [status, setStatus] = useState(_workInstance.status);
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
        let ignore = false;
        if (
            status === _workInstance.status &&
            hasViewingToday(_workInstance) === viewedToday
        )
            return;

        const debounce = setTimeout(async () => {
            const updatedWorkInstance = {
                ..._workInstance,
                work_id: _workInstance.work_id._id,
                status,
                viewings: [..._workInstance.viewings],
            };

            if (viewedToday && !hasViewingToday(_workInstance)) {
                updatedWorkInstance.viewings.push(new Date());
                updatedWorkInstance.number_of_viewings++;
            }

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
                toast.success("Status updated succesfully!");
            } else {
                updateWorkInstance(_workInstance);
                toast.error("Status update failed");
            }
        }, 1000);

        return () => {
            ignore = true;
            clearTimeout(debounce);
        };
    }, [status, viewedToday, _workInstance]);

    return (
        <div>
            <select
                name="status"
                id={`status-${_workInstance._id}`}
                value={status}
                onChange={(e) => {
                    setStatus(e.target.value);
                }}
            >
                {statuses[_workInstance.type].map((status) => (
                    <option key={status} value={status}>
                        {status}
                    </option>
                ))}
            </select>
            <button
                disabled={viewedToday}
                onClick={() => {
                    setViewedToday(true);
                }}
            >
                <Icon
                    path={
                        viewedToday
                            ? mdiCheckboxMarkedCircleOutline
                            : mdiCheckboxMarkedCirclePlusOutline
                    }
                    size={1}
                />
            </button>
        </div>
    );
}
