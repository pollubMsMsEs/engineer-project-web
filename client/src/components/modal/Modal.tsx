import React, { useEffect, useRef } from "react";
import styles from "./modal.module.scss";
import Button from "../button/Button";
import Icon from "@mdi/react";
import { mdiCloseThick } from "@mdi/js";

export default function Modal({
    isOpen,
    setIsOpen,
    size,
    children,
}: React.PropsWithChildren<{
    isOpen: boolean;
    setIsOpen: (state: boolean) => void;
    size: "fit-content" | "screen";
}>) {
    const dialog = useRef<HTMLDialogElement>(null);
    let modalClassName = styles["modal"];
    modalClassName += ` ${styles[`modal--size-${size}`]}`;

    useEffect(() => {
        const handleKeyDown = (event: any) => {
            if (event.key === "Escape") {
                setIsOpen(false);
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [setIsOpen]);

    useEffect(() => {
        if (isOpen) {
            dialog.current?.showModal();
        } else {
            dialog.current?.close();
        }
    }, [isOpen]);

    return (
        <dialog className={modalClassName} ref={dialog}>
            <Button
                style="icon"
                squared
                round
                padding="0"
                customStyle={{ borderWidth: "2px" }}
                onClick={() => setIsOpen(false)}
                className={styles["modal__close-button"]}
            >
                <Icon path={mdiCloseThick} size={1.8} />
            </Button>
            {children}
        </dialog>
    );
}
