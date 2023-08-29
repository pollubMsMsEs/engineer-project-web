import { MetaObject, Person } from "../types/movieType";

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
                <div
                    style={{
                        marginTop: "10px",
                        display: "grid",
                        placeItems: "center",
                    }}
                >
                    {Object.entries(details).map(([key, values]) => (
                        <div>
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
