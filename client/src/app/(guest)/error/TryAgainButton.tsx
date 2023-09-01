"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function TryAgainButton() {
    const router = useRouter();
    const [attempts, setAttempts] = useState(0);

    useEffect(() => {
        router.push("/");
        router.refresh();
    }, [router]);

    return (
        <button
            onClick={() => {
                router.push("/");
                router.refresh();
                setAttempts(attempts + 1);
            }}
        >
            Try again {attempts > 0 ? "later" : ""}
        </button>
    );
}
