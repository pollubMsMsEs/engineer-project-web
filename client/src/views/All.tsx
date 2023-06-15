import { useEffect, useState } from "react";
import axiosClient from "../axiosClient";
import { Person as PersonType } from "../types/movieType";
import LoadingCircle from "../components/LoadingCircle";

async function getMovies() {
    try {
        const result = await axiosClient.get("/movie/all");
        return result.data;
    } catch (error) {
        return false;
    }
}

export default function All() {
    const [movieList, setMovieList] = useState<
        | {
              title: string;
              _id: string;
              people: {
                  person_id: PersonType & { _id: string };
                  role: string;
              }[];
          }[]
        | undefined
    >(undefined);

    useEffect(() => {
        getMovies().then((movies) => {
            console.log(movies);
            setMovieList(movies);
        });
    }, []);

    return (
        <ul>
            {movieList === undefined ? (
                <LoadingCircle size="15px" />
            ) : (
                movieList.map((m) => (
                    <li key={m._id}>
                        <a href={`/movie/${m._id}`}>{m.title}</a>
                        <ul>
                            {m.people.map((p) => {
                                return (
                                    p.person_id && (
                                        <li
                                            key={
                                                p.person_id._id + m._id + p.role
                                            }
                                        >
                                            <a
                                                href={`/person/${p.person_id._id}`}
                                            >{`${p.person_id.name} ${
                                                p.person_id.nick
                                                    ? `"${p.person_id.nick}" `
                                                    : ""
                                            } ${p.person_id.surname}`}</a>
                                        </li>
                                    )
                                );
                            })}
                        </ul>
                    </li>
                ))
            )}
        </ul>
    );
}
