import {
    MetaObject,
    Person as PersonType,
    PersonInMovie,
    MovieFromAPIPopulated,
} from "../types/movieType";
import dayjs from "dayjs";
import Person from "./Person";
import styles from "./movie.module.scss";

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

export default function Movie({ movie }: { movie: MovieFromAPIPopulated }) {
    const peopleByRole = groupPeopleInMovieByRole(movie.people);

    return (
        <div className={styles["movie-container"]}>
            <h2>{movie.title}</h2>
            <div>
                <span className={styles["label"]}>Description: </span>
                <span>{movie?.description ?? ""}</span>
            </div>
            <div>
                <span className={styles["label"]}>Published at: </span>
                {dayjs(movie?.published_at).format("YYYY-MM-DD") ?? ""}
            </div>
            <div>
                <span className={styles["label"]}>Genres: </span>
                <span>
                    {movie?.genres.reduce((acc, genre) => {
                        return `${acc}${genre}, `;
                    }, "") ?? ""}
                </span>
            </div>
            <div className={styles["roles"]}>
                {peopleByRole.map(([role, people]) => (
                    <div key={role}>
                        <h3>
                            {role.charAt(0).toUpperCase() +
                                role.substring(1) +
                                "(s)"}
                        </h3>
                        <div className={styles["people"]}>
                            {people.map((p) => (
                                <div key={p._id} className={styles["person"]}>
                                    <Person person={p} details={p.details} />
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
            <h3>Metadata</h3>
            <div className={styles["metadata"]}>
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
