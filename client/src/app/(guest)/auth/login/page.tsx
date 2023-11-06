import Logo from "@/components/logo/Logo";
import { Metadata } from "next";
import styles from "./page.module.scss";
import LoginForm from "@/components/loginForm/LoginForm";

export const metadata: Metadata = {
    title: "Login",
};

export default function Login() {
    return (
        <div className={styles["container"]}>
            <div className={styles["logo-container"]}>
                <Logo />
            </div>
            <LoginForm />
        </div>
    );
}
