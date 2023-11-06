import styles from "./errorsDisplay.module.scss";

export default function ErrorsDisplay({ errors }: { errors?: any[] }) {
    if (errors && errors.length > 0) {
        return (
            <div key={errors.toString()} className={styles["errors-display"]}>
                {errors.map((error) => (
                    <div key={`${error.path ?? ""} ${error.msg}`}>
                        {`${error.path ?? ""}: ${error.msg}`}
                    </div>
                ))}
            </div>
        );
    }
}
