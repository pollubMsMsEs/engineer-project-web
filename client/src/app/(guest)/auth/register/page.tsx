import { Metadata } from "next";
import RegisterForm from "@/components/registerForm/RegisterForm";

export const metadata: Metadata = {
    title: "Register",
};

export default function Register() {
    return <RegisterForm />;
}
