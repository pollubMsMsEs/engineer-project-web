import React from "react";
import Logo from "@/components/Logo";
import styles from "./layout.module.scss";
import Link from "next/link";
import { cookies } from "next/headers";
import jwtDecode from "jwt-decode";
import ToastContainerWrapper from "@/components/ToastContainerWrapper";
import Icon from "@mdi/react";
import { mdiMagnify } from "@mdi/js";

export default function Layout({ children }: React.PropsWithChildren) {
    const username = jwtDecode<any>(cookies().get("jwt")?.value!!).name;

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
                <a href="/">Home</a>
                <a href="/person/all">People table</a>
            </aside>
            <main className={styles["default-layout-main"]}>{children}</main>
            <ToastContainerWrapper />
        </div>
    );
}
