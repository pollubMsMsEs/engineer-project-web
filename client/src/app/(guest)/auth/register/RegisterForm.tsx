"use client";

import React from "react";
import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import ErrorsDisplay from "../ErrorsDisplay";
import styles from "./registerForm.module.scss";
import LoadingCircle from "@/components/LoadingCircle";

export default function RegisterForm() {
    const [user, setUser] = useState({
        name: "",
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
            setErrors(error.response.data.errors);

            console.error(error.response);
        }
    }

    return (
        <form
            className={styles.registerFormContainer}
            onSubmit={(e) => {
                e.preventDefault();
                e.currentTarget.reportValidity();
                onSubmit();
            }}
        >
            <h2>Register</h2>
            <ErrorsDisplay errors={errors} />
            <input
                type="text"
                placeholder="Enter your username"
                required
                value={user.name}
                onChange={(e) => setUser({ ...user, name: e.target.value })}
            />
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
                {isFetching ? <LoadingCircle size="15px" /> : "Register"}
            </button>

            <Link href="/auth/login">Already have an account? Login</Link>
        </form>
    );
}
