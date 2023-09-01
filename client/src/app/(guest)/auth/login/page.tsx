"use client";

import { useEffect, useState } from "react";
import Logo from "@/components/Logo";
import ErrorsDisplay from "../ErrorsDisplay";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Login() {
    const [user, setUser] = useState({
        email: "",
        password: "",
    });

    const [errors, setErrors] = useState<{ msg: string }[]>([]);
    const router = useRouter();

    useEffect(() => {
        document.title = "Login | Covid Visualizer";
    }, []);

    async function onSubmit() {
        try {
            const response = await fetch("/api/login", {
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
            console.error({ error });
        }
    }

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                minHeight: "100vh",
            }}
        >
            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    marginBottom: "20px",
                }}
            >
                <Logo />
            </div>
            <form
                style={{
                    padding: "20px",
                    width: "500px",
                    borderRadius: "8px",
                    boxShadow: "0px 2px 20px 5px rgba(0, 0, 0, 0.1)",
                }}
                onSubmit={(e) => {
                    e.preventDefault();
                    e.currentTarget.reportValidity();
                    onSubmit();
                }}
            >
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "10px",
                    }}
                >
                    <h2
                        style={{
                            fontSize: "24px",
                            fontWeight: "bold",
                            textAlign: "center",
                            textTransform: "uppercase",
                        }}
                    >
                        Login
                    </h2>

                    <ErrorsDisplay
                        errors={errors}
                        containerStyle={{
                            color: "#e63946",
                        }}
                    />
                    <input
                        type="email"
                        placeholder="Enter your email"
                        required
                        value={user.email}
                        onChange={(e) =>
                            setUser({ ...user, email: e.target.value })
                        }
                        style={{
                            padding: "10px",
                            borderRadius: "4px",
                            border: "1px solid #ccc",
                        }}
                    />
                    <input
                        type="password"
                        placeholder="Enter your password"
                        required
                        value={user.password}
                        onChange={(e) =>
                            setUser({ ...user, password: e.target.value })
                        }
                        style={{
                            padding: "10px",
                            borderRadius: "4px",
                            border: "1px solid #ccc",
                        }}
                    />
                    <button
                        style={{
                            padding: "10px",
                            borderRadius: "4px",
                            backgroundColor: "#ef4444",
                            border: "none",
                            cursor: "pointer",
                        }}
                    >
                        Login
                    </button>
                    <Link
                        href="/register"
                        style={{
                            textAlign: "center",
                            textDecoration: "underline",
                            fontSize: "14px",
                        }}
                    >
                        Don&apos;t have an account? Register
                    </Link>
                </div>
            </form>
        </div>
    );
}
