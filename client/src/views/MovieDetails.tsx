import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Movie, Person, PersonInMovie, MetaObject } from "../types/movieType";
import axios from "axios";
import LoadingCircle from "../components/LoadingCircle";
import dayjs from "dayjs";

async function getMovieById(id: string) {
    try {
        const result = await axios.get(`http://localhost:7777/api/movie/${id}`);

        result.data.data.published_at = new Date(result.data.data.published_at);
        return result.data.data;
    } catch (error) {
        return false;
    }
}

export default function MovieDetails() {
    const { _id } = useParams();
    const [movie, setMovie] = useState<Movie | false | null>(null);

    useEffect(() => {
        getMovieById(_id ?? "").then(setMovie);
    }, [_id]);

    return (
        <div>
            {movie !== false ? (
                movie !== null ? (
                    <div>
                        <h2>{movie?.title ?? ""}</h2>
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
                            {dayjs(movie?.published_at).format("YYYY-MM-DD") ??
                                ""}
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
                                gap: "30px",
                                flexWrap: "wrap",
                            }}
                        >
                            {
                                // FIXME
                                Object.entries(
                                    movie.people
                                        .filter(
                                            (
                                                p
                                            ): p is PersonInMovie & {
                                                person_id: Person;
                                            } => {
                                                return (
                                                    p?.person_id != undefined &&
                                                    typeof p.person_id ===
                                                        "object"
                                                );
                                            }
                                        )
                                        .reduce(
                                            (
                                                peopleByRole: {
                                                    [role: string]: (Person & {
                                                        details?: MetaObject;
                                                    })[];
                                                },
                                                person
                                            ) => {
                                                const newPerson = {
                                                    ...person.person_id,
                                                    details: person.details,
                                                };

                                                if (
                                                    person.role in peopleByRole
                                                ) {
                                                    peopleByRole[
                                                        person.role
                                                    ].push(newPerson);
                                                } else {
                                                    peopleByRole[person.role] =
                                                        [newPerson];
                                                }

                                                return peopleByRole;
                                            },
                                            {}
                                        )
                                ).map(([role, people]) => (
                                    <div>
                                        <div>{role}</div>
                                        {people.map((p) => (
                                            <div>
                                                <div>{p.name}</div>
                                                <div>
                                                    {p.nick && `"${p.nick}"`}
                                                </div>
                                                <div>{p.surname}</div>
                                            </div>
                                        ))}
                                    </div>
                                ))
                            }
                        </div>
                        <div
                            style={{
                                marginTop: "30px",
                                display: "flex",
                                gap: "30px",
                                flexWrap: "wrap",
                            }}
                        ></div>
                    </div>
                ) : (
                    <LoadingCircle size="15px" />
                )
            ) : (
                <p>Couldn't load movie</p>
            )}
        </div>
    );
}
