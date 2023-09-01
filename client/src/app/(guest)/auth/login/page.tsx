import Logo from "@/components/Logo";
import { Metadata } from "next";
import styles from "./page.module.scss";
import LoginForm from "./LoginForm";

export const metadata: Metadata = {
    title: "Login",
};

export default function Login() {
    return (
        <div className={styles.container}>
            <div className={styles.logoContainer}>
                <Logo />
            </div>
            <LoginForm />
        </div>
    );
}
