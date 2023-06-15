import { useEffect, useState } from "react";
import axiosClient from "../axiosClient";
import { Person } from "../types/movieType";
import { Link } from "react-router-dom";

async function getPeople() {
    try {
        const result = await axiosClient.get("/person/all");
        return result.data;
    } catch (error) {
        console.error("People", error);
        return false;
    }
}

async function deletePerson(_id: string) {
    try {
        const result = await axiosClient.delete<{
            acknowledged: boolean;
            deleted: (Person & { _id: string }) | null;
        }>(`/person/${_id}`);
        console.log(result.data);
        return result.data;
    } catch (error) {
        console.error(error);
        return false;
    }
}

export default function PeopleList() {
    const [peopleList, setPeopleList] = useState<(Person & { _id: string })[]>(
        []
    );

    useEffect(() => {
        getPeople().then((people) => {
            setPeopleList(people);
        });
    }, []);

    async function deletePersonHandler(_id: string) {
        const result = await deletePerson(_id);
        const deletedPersonId = result && result.deleted?._id;
        if (deletedPersonId) {
            setPeopleList((previousPeople) => {
                return previousPeople.filter((m) => m._id !== deletedPersonId);
            });
        }
    }

    return (
        <>
            <a href="/person/create">
                <button style={{ width: "100%" }}>Add person</button>
            </a>
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Nick</th>
                        <th>Surname</th>
                        <th>Operations</th>
                    </tr>
                </thead>
                <tbody>
                    {peopleList.map((person) => (
                        <tr key={person._id}>
                            <td>{person.name}</td>
                            <td>{person.nick}</td>
                            <td>{person.surname}</td>
                            <td>
                                <a href={`/person/${person._id}`}>
                                    <button>Details</button>
                                </a>
                                <Link
                                    to={{
                                        pathname: `/person/${person._id}/edit`,
                                    }}
                                >
                                    <button>Edit</button>
                                </Link>

                                <button
                                    onClick={() => {
                                        deletePersonHandler(person._id);
                                    }}
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <a href="/person/create">
                <button style={{ width: "100%" }}>Add person</button>
            </a>
        </>
    );
}
