"use client";

import React, { useEffect } from "react";
import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import ErrorsDisplay from "@/components/errorsDisplay/ErrorsDisplay";
import styles from "./registerForm.module.scss";
import LoadingDisplay from "@/components/loadingDisplay/LoadingDisplay";
import { useHandleRequest } from "@/hooks/useHandleRequests";
import Button from "../button/Button";
import Input from "../input/Input";

export default function RegisterForm() {
    const [user, setUser] = useState({
        name: "",
        email: "",
        password: "",
    });

    const {
        errors,
        errorsKey,
        fetchingState,
        setFetchingState,
        handleResponse,
    } = useHandleRequest<true>();

    const router = useRouter();
    const pathname = usePathname();

    async function onSubmit() {
        setFetchingState(true);

        const response = await fetch(`/api${pathname}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(user),
        });

        if (await handleResponse(response)) router.refresh();
    }

    return (
        <form
            className={styles["auth-form"]}
            onSubmit={(e) => {
                e.preventDefault();
                e.currentTarget.reportValidity();
                onSubmit();
            }}
        >
            <h2>Register</h2>

            <div className={styles[`auth-form__inputs`]}>
                <Input
                    id="name"
                    type="text"
                    name="name"
                    label="Username"
                    labelDisplay="always"
                    placeholder="Enter your username"
                    required
                    value={user.name}
                    onChange={(value: any) => setUser({ ...user, name: value })}
                />
                <Input
                    id="email"
                    type="email"
                    name="email"
                    label="Email"
                    labelDisplay="always"
                    placeholder="Enter your email"
                    required
                    value={user.email}
                    onChange={(value: any) =>
                        setUser({ ...user, email: value })
                    }
                />
                <Input
                    id="password"
                    type="password"
                    name="password"
                    label="Password"
                    labelDisplay="always"
                    placeholder="Enter your password"
                    required
                    value={user.password}
                    onChange={(value) => setUser({ ...user, password: value })}
                />
            </div>
            <ErrorsDisplay key={errorsKey} errors={errors} />
            <Button type="submit" style="major" size="big">
                {fetchingState ? <LoadingDisplay size="1.3rem" /> : "Register"}
            </Button>

            <Link href="/auth/login">Already have an account? Login</Link>
        </form>
    );
}
