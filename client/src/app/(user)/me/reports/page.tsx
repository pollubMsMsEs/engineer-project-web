"use client";

import LoadingDisplay from "@/components/loadingDisplay/LoadingDisplay";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import relativeTime from "dayjs/plugin/relativeTime";
import React, { useCallback, useEffect, useState } from "react";

/*average_completion_time
average_rating
count_by_type
completions_by_date
finished_count*/

export default function Reports() {
    dayjs.extend(duration);
    dayjs.extend(relativeTime);

    const [averageCompletionTime, setAverageCompletionTime] =
        useState<number>();

    const updateReports = useCallback(async () => {
        const [averageCompletionTime] = await Promise.all(
            (
                await Promise.all([
                    fetch("/api/report/average_completion_time", {
                        method: "GET",
                    }),
                ])
            ).map(async (response) => await response.json())
        );

        setAverageCompletionTime(averageCompletionTime.average_completion_time);
    }, []);

    useEffect(() => {
        updateReports();
    }, [updateReports]);

    return (
        <div>
            {averageCompletionTime ? (
                <div>
                    <div>Average completion time</div>
                    <div>
                        {dayjs.duration(averageCompletionTime).humanize()}
                    </div>
                </div>
            ) : (
                <LoadingDisplay size="30px" />
            )}
        </div>
    );
}
