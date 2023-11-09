import Logo from "@/components/logo/Logo";
import { Metadata } from "next";

import styles from "./page.module.scss";
import RegisterForm from "@/components/registerForm/RegisterForm";

export const metadata: Metadata = {
    title: "Register",
};

export default function Register() {
    return (
        <div className={styles["container"]}>
            <div className={styles["logo-container"]}>
                <Logo />
            </div>
            <RegisterForm />
        </div>
    );
}
