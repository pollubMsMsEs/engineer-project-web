import {
    MetaObject,
    Person as PersonType,
    PersonInMovie,
    PopulatedMovieFromAPI,
} from "../types/movieType";
import dayjs from "dayjs";
import Person from "./Person";

type PeopleByRole = {
    [role: string]: (PersonType & {
        _id: string;
        details?: MetaObject;
    })[];
};

type PersonInMovieFromAPI = PersonInMovie & {
    person_id: PersonType & { _id: string };
};

function groupPeopleInMovieByRole(people: PersonInMovieFromAPI[]) {
    return Object.entries(
        people
            .filter((p) => p?.person_id?._id)
            .reduce((peopleByRole: PeopleByRole, person) => {
                const newPerson = {
                    ...person.person_id,
                    details: person.details,
                };

                if (person.role in peopleByRole) {
                    peopleByRole[person.role].push(newPerson);
                } else {
                    peopleByRole[person.role] = [newPerson];
                }

                return peopleByRole;
            }, {})
    );
}

export default function MovieWithPeople({
    movie,
}: {
    movie: PopulatedMovieFromAPI;
}) {
    const peopleByRole = groupPeopleInMovieByRole(movie.people);

    return (
        <div>
            <h2>{movie.title}</h2>
            <div>
                <span
                    style={{
                        fontSize: "1.1rem",
                        fontWeight: "bold",
                    }}
                >
                    Description:{" "}
                </span>
                <span>{movie?.description ?? ""}</span>
            </div>
            <div>
                <span
                    style={{
                        fontSize: "1.1rem",
                        fontWeight: "bold",
                    }}
                >
                    Published at:{" "}
                </span>
                {dayjs(movie?.published_at).format("YYYY-MM-DD") ?? ""}
            </div>
            <div>
                <span
                    style={{
                        fontSize: "1.1rem",
                        fontWeight: "bold",
                    }}
                >
                    Genres:{" "}
                </span>
                <span>
                    {movie?.genres.reduce((acc, genre) => {
                        return `${acc}${genre}, `;
                    }, "") ?? ""}
                </span>
            </div>
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                }}
            >
                {peopleByRole.map(([role, people]) => (
                    <div key={role}>
                        <h3>
                            {role.charAt(0).toUpperCase() +
                                role.substring(1) +
                                "(s)"}
                        </h3>
                        <div style={{ display: "flex", gap: "10px" }}>
                            {people.map((p) => (
                                <div
                                    key={p._id}
                                    style={{
                                        display: "grid",
                                        placeItems: "center",
                                    }}
                                >
                                    <Person person={p} details={p.details} />
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
            <h3>Metadata</h3>
            <div
                style={{
                    marginTop: "30px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "5px",
                    flexWrap: "wrap",
                }}
            >
                {Object.entries(movie.metadata).map(([key, values]) => (
                    <div key={key}>
                        <span>
                            {key.charAt(0).toUpperCase() + key.substring(1)}
                            {": "}
                        </span>
                        <span>{values[0]}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
