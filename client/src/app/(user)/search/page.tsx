"use client";
import { useSearchParams } from "next/navigation";
import React from "react";

export default function Search() {
    const searchParams = useSearchParams();

    return <div>Search</div>;
}
