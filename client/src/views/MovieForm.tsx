import { useState, useEffect } from "react";
import {
    redirect,
    useLocation,
    useNavigate,
    useParams,
} from "react-router-dom";
import { MetaObject, Person as PersonType } from "../types/movieType";
import PersonInMovieForm, {
    PeopleList,
    PersonInMovieFormType,
} from "../components/PersonInMovieForm";
import axios from "axios";
import LoadingCircle from "../components/LoadingCircle";

async function getPeopleToPick() {
    try {
        const result = await axios.get<(PersonType & { _id: string })[]>(
            "http://localhost:7777/api/person/all"
        );
        return result.data;
    } catch (error) {
        return false;
    }
}

export default function MovieForm() {
    const navigate = useNavigate();
    const { _id } = useParams();
    const [editedRole, setEditedRole] = useState("");

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [publishedAt, setPublishedAt] = useState("");
    const [genres, setGenres] = useState<string[]>([]);
    const [metadata, setMetadata] = useState<MetaObject>({});
    const [people, setPeople] = useState<PersonInMovieFormType[]>([]);
    const [peopleToPick, setPeopleToPick] = useState<
        PeopleList | false | undefined
    >(undefined);
    const [uniqueKey, setUniqueKey] = useState(0);

    useEffect(() => {
        getPeopleToPick().then(setPeopleToPick);
    }, []);

    const roleSuggestions = people.reduce((roles: string[], person) => {
        if (
            person.role !== "" &&
            person.role !== editedRole &&
            roles.indexOf(person.role) === -1
        ) {
            roles.push(person.role);
        }
        return roles;
    }, []);

    const peopleDetailSuggestions = ["Character"];

    function deletePersonCallback(person: PersonInMovieFormType) {
        setPeople((prevPeople) => {
            return prevPeople.filter(
                (prevPerson) => prevPerson.react_key !== person.react_key
            );
        });
    }

    function editPersonCallback(person: PersonInMovieFormType) {
        setPeople((prevPeople) => {
            const index = prevPeople.findIndex(
                (prevPerson) => prevPerson.react_key === person.react_key
            );
            prevPeople[index] = person;

            return [...prevPeople];
        });
    }

    function setEditedRoleCallback(role: string) {
        setEditedRole(role);
    }

    function getUniqueKey() {
        setUniqueKey((v) => v + 1);
        console.log(uniqueKey);
        return uniqueKey;
    }

    return (
        <form style={{ display: "grid", justifyContent: "start" }}>
            {_id && <input type="hidden" name="_id" value={_id} />}
            <label htmlFor="title">Title: </label>
            <input
                type="title"
                name="title"
                id="title"
                value={title}
                onChange={(e) => {
                    setTitle(e.target.value);
                }}
            />
            <label htmlFor="description">Description: </label>
            <textarea
                name="description"
                id="description"
                value={description}
                onChange={(e) => {
                    setDescription(e.target.value);
                }}
            />
            <label htmlFor="published_at">Published at: </label>
            <input
                type="date"
                name="published_at"
                id="published_at"
                value={publishedAt}
                onChange={(e) => {
                    setPublishedAt(e.target.value);
                }}
            />
            <label htmlFor="genres">Genres (space seperated):</label>
            <input
                type="input"
                name="genres"
                id="genres"
                value={genres.join(" ")}
                onChange={(e) => {
                    console.log(genres);
                    setGenres(e.target.value.split(" "));
                }}
            />
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                }}
            >
                <h3>People</h3>
                {peopleToPick && (
                    <button
                        type="button"
                        onClick={() => {
                            setPeople((prevPeople) => {
                                return [
                                    ...prevPeople,
                                    {
                                        react_key: getUniqueKey(),
                                        role: "",
                                        person_id: "",
                                        formDetails: {},
                                    },
                                ];
                            });
                        }}
                    >
                        +
                    </button>
                )}
            </div>

            <div
                style={{ display: "flex", flexWrap: "wrap", gap: "10px 20px" }}
            >
                {peopleToPick === false && <span>Couldn't load people</span>}
                {peopleToPick === undefined && <LoadingCircle size="15px" />}
                {peopleToPick &&
                    (peopleToPick.length === 0 ? (
                        <span>No people in database, create some first</span>
                    ) : (
                        people.map((p, index) => (
                            <PersonInMovieForm
                                key={p.react_key}
                                person={p}
                                peopleToPick={peopleToPick}
                                index={index}
                                editPersonCallback={editPersonCallback}
                                deletePersonCallback={deletePersonCallback}
                                setEditedRoleCallback={setEditedRoleCallback}
                                getUniqueKey={getUniqueKey}
                            />
                        ))
                    ))}
            </div>
            <datalist id="people-roles">
                {roleSuggestions.map((r) => (
                    <option key={r} value={r}>
                        {r}
                    </option>
                ))}
            </datalist>
            <datalist id="people-details">
                {peopleDetailSuggestions.map((r) => (
                    <option key={r} value={r}>
                        {r}
                    </option>
                ))}
            </datalist>
        </form>
    );
}
