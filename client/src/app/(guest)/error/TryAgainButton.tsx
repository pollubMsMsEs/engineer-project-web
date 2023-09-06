"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export default function TryAgainButton() {
    const router = useRouter();
    const [attempts, setAttempts] = useState(0);
    const reconectInterval = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        router.push("/");
        router.refresh();

        reconectInterval.current = setInterval(() => {
            router.push("/");
            router.refresh();
        }, 30 * 1000);

        return () => {
            clearInterval(reconectInterval.current!!);
        };
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
