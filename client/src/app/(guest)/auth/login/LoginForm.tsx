"use client";

import React from "react";
import ErrorsDisplay from "../ErrorsDisplay";
import Link from "next/link";
import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import styles from "./loginForm.module.scss";
import LoadingCircle from "@/components/LoadingCircle";

export default function LoginForm() {
    const [user, setUser] = useState({
        email: "",
        password: "",
    });
    const [isFetching, setIsFetching] = useState(false);

    const [errors, setErrors] = useState<{ msg: string }[]>([]);
    const router = useRouter();
    const pathname = usePathname();

    async function onSubmit() {
        try {
            setIsFetching(true);
            const response = await fetch(`/api${pathname}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(user),
            });
            const result = await response.json();

            if (result.errors) {
                setErrors(result.errors);
            } else {
                router.refresh();
            }
            setIsFetching(false);
        } catch (error: any) {
            console.error({ error });
        }
    }

    return (
        <form
            className={styles.loginFormContaier}
            onSubmit={(e) => {
                e.preventDefault();
                e.currentTarget.reportValidity();
                onSubmit();
            }}
        >
            <h2>Login</h2>

            <ErrorsDisplay errors={errors} />
            <input
                type="email"
                placeholder="Enter your email"
                required
                value={user.email}
                onChange={(e) => setUser({ ...user, email: e.target.value })}
            />
            <input
                type="password"
                placeholder="Enter your password"
                required
                value={user.password}
                onChange={(e) => setUser({ ...user, password: e.target.value })}
            />
            <button>
                {isFetching ? <LoadingCircle size="15px" /> : "Login"}
            </button>
            <Link href="/auth/register">
                Don&apos;t have an account? Register
            </Link>
        </form>
    );
}
