import styles from "./select.module.scss";

export default function Select({
    className,
    name,
    id,
    value,
    options,
    fontSize,
    onChange,
}: {
    className?: string;
    name: string;
    id: string;
    value: string;
    options: [string, string][];
    fontSize?: string;
    onChange: (value: string) => void;
}) {
    return (
        <select
            className={`${styles["select"]} ${className ?? ""}`}
            name={name}
            id={id}
            value={value}
            style={{
                fontSize,
            }}
            onChange={(e) => {
                onChange(e.target.value);
            }}
        >
            {options.map((option) => (
                <option
                    key={option[0]}
                    value={option[0]}
                    className={styles["select__option"]}
                >
                    {option[1]}
                </option>
            ))}
        </select>
    );
}
