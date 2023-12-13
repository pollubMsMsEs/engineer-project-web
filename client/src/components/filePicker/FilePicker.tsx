import React, { useRef } from "react";
import styles from "./filePicker.module.scss";
import Button from "../button/Button";

export default function FilePicker({
    title,
    name,
    acceptedTypes,
    multiple,
    onChange,
}: {
    title: string;
    name: string;
    acceptedTypes?: string;
    multiple?: boolean;
    onChange: (files: FileList | null) => void;
}) {
    const input = useRef<HTMLInputElement>(null);

    return (
        <div className={styles["file-picker"]}>
            <input
                className={styles["file-picker__input"]}
                type="file"
                name={name}
                ref={input}
                accept={acceptedTypes}
                multiple={multiple}
                onChange={(e) => {
                    console.log(e.target.files);
                    onChange(e.target.files);
                }}
            />
            <Button
                type="button"
                onClick={() => {
                    if (input.current) {
                        input.current.click();
                    }
                }}
            >
                {title}
            </Button>
        </div>
    );
}
