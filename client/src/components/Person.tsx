import { MetaObject, Person } from "../types/types";
import styles from "./person.module.scss";

export default function Person({
    person,
    details,
}: {
    person: Person;
    details?: MetaObject;
}) {
    return (
        <>
            <div>{person.name}</div>
            <div>{person.nick && `"${person.nick}"`}</div>
            <div>{person.surname}</div>
            {details && (
                <div className={styles["person-details"]}>
                    {Object.entries(details).map(([key, values]) => (
                        <div key={key}>
                            <span>
                                {key.charAt(0).toUpperCase() + key.substring(1)}
                                {": "}
                            </span>
                            <span>{values[0]}</span>
                        </div>
                    ))}
                </div>
            )}
        </>
    );
}
