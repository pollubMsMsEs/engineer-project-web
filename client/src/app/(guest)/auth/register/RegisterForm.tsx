"use client";

import React from "react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import ErrorsDisplay from "../ErrorsDisplay";
import styles from "./registerForm.module.scss";

export default function RegisterForm() {
    const [user, setUser] = useState({
        name: "",
        email: "",
        password: "",
    });

    const [errors, setErrors] = useState<{ msg: string }[]>([]);
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        document.title = "Register | Covid Visualizer";
    }, []);

    async function onSubmit() {
        try {
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
            <button
                style={{
                    padding: "10px",
                    borderRadius: "4px",
                    backgroundColor: "#ef4444",
                    color: "white",
                    border: "none",
                    cursor: "pointer",
                }}
            >
                Register
            </button>

            <Link href="/auth/login">Already have an account? Login</Link>
        </form>
    );
}
