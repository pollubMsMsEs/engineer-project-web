"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Login() {
    const router = useRouter();

    return (
        <button
            onClick={async () => {
                await fetch("/api/login");
                router.back();
            }}
        >
            Login
        </button>
    );
}
