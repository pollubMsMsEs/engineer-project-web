import React from "react";
import Logo from "@/components/logo/Logo";
import styles from "./layout.module.scss";
import Link from "next/link";
import { cookies } from "next/headers";
import jwtDecode from "jwt-decode";
import ToastContainerWrapper from "@/components/toastContainerWrapper/ToastContainerWrapper";
import Icon from "@mdi/react";
import { mdiMagnify } from "@mdi/js";

export default function Layout({ children }: React.PropsWithChildren) {
    const username = jwtDecode<any>(cookies().get("jwt")?.value!!).name;
    const routes = [
        {
            href: "/",
            title: "Home",
        },
        {
            href: "/person/all",
            title: "People table",
        },
        {
            href: "/me/reports",
            title: "Reports",
        },
    ];

    return (
        <div className={styles["default-layout"]}>
            <header className={styles["default-layout-header"]}>
                <Logo />
                <div className={styles["default-layout-header__user"]}>
                    <Link href={"/search"}>
                        <Icon path={mdiMagnify} size={1.2} />
                    </Link>
                    <span
                        className={styles["default-layout-header__user-name"]}
                    >
                        {username}
                    </span>
                    <Link href={"/api/auth/logout"}>Logout</Link>
                </div>
            </header>
            <aside className={styles["default-layout-aside"]}>
                {routes.map((route) => (
                    <a
                        className={styles["default-layout-aside__link"]}
                        key={route.href}
                        href={route.href}
                    >
                        {route.title}
                    </a>
                ))}
            </aside>
            <main className={styles["default-layout-main"]}>{children}</main>
            <ToastContainerWrapper />
        </div>
    );
}
