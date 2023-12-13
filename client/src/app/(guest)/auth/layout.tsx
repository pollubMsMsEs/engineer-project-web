import Logo from "@/components/logo/Logo";
import React from "react";
import styles from "./layout.module.scss";

export default function AuthLayout({ children }: React.PropsWithChildren) {
    return (
        <div className={styles["container"]}>
            <div className={styles["logo-container"]}>
                <Logo />
            </div>
            {children}
        </div>
    );
}
