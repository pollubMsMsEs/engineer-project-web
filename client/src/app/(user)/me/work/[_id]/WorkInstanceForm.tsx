"use client";

import RatingBar from "@/components/ratingBar/RatingBar";
import { WorkInstanceFromAPI } from "@/types/types";
import React, { useState } from "react";

export default function WorkInstanceForm({
    workInstance,
}: {
    workInstance: WorkInstanceFromAPI;
}) {
    const [rating, setRating] = useState(workInstance.rating);

    return <RatingBar value={rating} maxValue={5} setValue={setRating} />;
}
