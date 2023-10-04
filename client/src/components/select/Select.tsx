import styles from "./select.module.scss";

export default function Select({
    className,
    name,
    id,
    value,
    options,
    onChange,
}: {
    className?: string;
    name: string;
    id: string;
    value: string;
    options: string[];
    onChange: (value: string) => void;
}) {
    return (
        <select
            className={`${styles["select"]} ${className ?? ""}`}
            name={name}
            id={id}
            value={value}
            onChange={(e) => {
                onChange(e.target.value);
            }}
        >
            {options.map((option) => (
                <option
                    key={option}
                    value={option}
                    className={styles["select__option"]}
                >
                    {option}
                </option>
            ))}
        </select>
    );
}
