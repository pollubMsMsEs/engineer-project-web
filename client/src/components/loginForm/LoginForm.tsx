"use client";

import React, { useEffect } from "react";
import ErrorsDisplay from "@/components/errorsDisplay/ErrorsDisplay";
import Link from "next/link";
import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import styles from "./loginForm.module.scss";
import LoadingDisplay from "@/components/loadingDisplay/LoadingDisplay";

export default function LoginForm() {
    const [user, setUser] = useState({
        email: "",
        password: "",
    });
    const [isFetching, setIsFetching] = useState(false);

    const [errors, setErrors] = useState<{ msg: string }[]>([]);
    const [errorsKey, setErrorsKey] = useState(new Date().toUTCString());
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        if (!isFetching) {
            setErrorsKey(new Date().toUTCString());
        }
    }, [isFetching]);

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
                setIsFetching(false);
                setErrors(result.errors);
            } else {
                router.refresh();
            }
        } catch (error: any) {
            console.error({ error });
        }
    }

    return (
        <form
            className={styles[`login-form-contaier`]}
            onSubmit={(e) => {
                e.preventDefault();
                e.currentTarget.reportValidity();
                onSubmit();
            }}
        >
            <h2>Login</h2>

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
            <ErrorsDisplay key={errorsKey} errors={errors} />
            <button>
                {isFetching ? <LoadingDisplay size="1.3em" /> : "Login"}
            </button>
            <Link href="/auth/register">
                Don&apos;t have an account? Register
            </Link>
        </form>
    );
}
