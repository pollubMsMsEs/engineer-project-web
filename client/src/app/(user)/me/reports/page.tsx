"use client";

import LoadingDisplay from "@/components/loadingDisplay/LoadingDisplay";
import RatingBar from "@/components/ratingBar/RatingBar";
import ReportContainer from "@/components/reportContainer/ReportContainer";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import relativeTime from "dayjs/plugin/relativeTime";
import React, { useCallback, useEffect, useState } from "react";
import styles from "./page.module.scss";
import Icon from "@mdi/react";
import { mdiClock, mdiMarkerCheck } from "@mdi/js";
import {
    Chart as ChartJS,
    DoughnutController,
    ArcElement,
    Tooltip,
    Legend,
} from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(DoughnutController, ArcElement, Tooltip, Legend);

/*average_completion_time
average_rating
finished_count
count_by_type
completions_by_date
*/

export default function Reports() {
    dayjs.extend(duration);
    dayjs.extend(relativeTime);

    const [averageCompletionTime, setAverageCompletionTime] =
        useState<number>();
    const [averageRating, setAverageRating] = useState<number>();
    const [finishedCount, setFinishedCount] = useState<number>();
    const [countByType, setCountByType] = useState<{
        book: number;
        movie: number;
        game: number;
    }>();
    const [completionsByDate, setCompletionsByDate] =
        useState<{ day: Date; total: number }[]>();

    const updateReports = useCallback(async () => {
        const [
            averageCompletionTime,
            averageRating,
            finishedCount,
            countByType,
            completionsByDate,
        ] = await Promise.all(
            (
                await Promise.all([
                    fetch("/api/report/average_completion_time", {
                        method: "GET",
                    }),
                    fetch("/api/report/average_rating", {
                        method: "GET",
                    }),
                    fetch("/api/report/finished_count", {
                        method: "GET",
                    }),
                    fetch("/api/report/count_by_type", {
                        method: "GET",
                    }),
                    fetch("/api/report/completions_by_date", {
                        method: "GET",
                    }),
                ])
            ).map(async (response) => await response.json())
        );

        setAverageCompletionTime(averageCompletionTime.average_completion_time);
        setAverageRating(averageRating.average_rating);
        setFinishedCount(finishedCount.finished_count);
        setCountByType(countByType.count_by_type);
        setCompletionsByDate(
            (
                completionsByDate.completions_by_date as {
                    day: string;
                    total: number;
                }[]
            ).map((completion) => ({
                day: new Date(completion.day),
                total: completion.total,
            }))
        );
    }, []);

    const countByTypeChartData = {
        labels: ["Books", "Movies", "Games"],
        datasets: [
            {
                label: "Count",
                data: [
                    countByType?.book,
                    countByType?.movie,
                    countByType?.game,
                ],
                backgroundColor: ["#10b981", "#ef4444", "#2563eb"],
                hoverOffset: 4,
            },
        ],
    };

    const completionsByMonth = "Da";

    const completionsByDateChartData = {};

    useEffect(() => {
        updateReports();
    }, [updateReports]);

    return (
        <div className={styles["reports"]}>
            <ReportContainer
                title="Collection"
                value={countByType}
                gridArea="c1"
            >
                <div className={styles["reports__chart"]}>
                    <Doughnut data={countByTypeChartData} />
                </div>
            </ReportContainer>
            <ReportContainer
                title="Average completion time"
                value={averageCompletionTime}
            >
                <div className={styles["reports__inline"]}>
                    <Icon path={mdiClock} size={1} />
                    <span>
                        {dayjs.duration(averageCompletionTime!).humanize()}
                    </span>
                </div>
            </ReportContainer>
            <ReportContainer title="Average rating" value={averageRating}>
                <div className={styles["reports__inline"]}>
                    <RatingBar
                        value={Math.floor(averageRating!)}
                        maxValue={5}
                        readOnly
                    />
                    <span>{averageRating!}</span>
                </div>
            </ReportContainer>
            <ReportContainer title="Finished count" value={finishedCount}>
                <div className={styles["reports__inline"]}>
                    <Icon path={mdiMarkerCheck} size={1} />
                    <span>{finishedCount!}</span>
                </div>
            </ReportContainer>
            <ReportContainer
                title="Finished count"
                value={finishedCount}
                gridArea="c2"
            >
                <div className={styles["reports__chart"]}>
                    <Doughnut data={countByTypeChartData} />
                </div>
            </ReportContainer>
        </div>
    );
}
