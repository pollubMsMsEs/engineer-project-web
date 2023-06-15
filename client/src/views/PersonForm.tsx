import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosClient from "../axiosClient";
import { Person } from "../types/movieType";

export default function PersonForm() {
    const navigate = useNavigate();
    const { _id } = useParams();

    const [name, setName] = useState("");
    const [nick, setNick] = useState<string | undefined>(undefined);
    const [surname, setSurname] = useState("");

    useEffect(() => {
        if (_id) {
            getPerson(_id);
        }
    }, [_id]);

    async function getPerson(_id: string) {
        try {
            const result = await axiosClient.get(`/person/${_id}`);
            const loadedPerson: Person = result.data.data;

            setName(loadedPerson.name);
            setNick(loadedPerson.nick);
            setSurname(loadedPerson.surname);
        } catch (error) {
            console.error(error);
        }
    }

    async function submitForm() {
        const person: Person & { _id: string | undefined } = {
            _id,
            name,
            nick,
            surname,
        };

        console.log(person);

        try {
            if (_id) {
                //Update
                await axiosClient.put(`/person/${_id}`, person);
            } else {
                //Create
                await axiosClient.post("/person/create", person);
            }

            navigate("/person/all");
        } catch (error: any) {
            if (error.response?.data?.errors) {
                console.error("Validation failed:", error.response.data.errors);
            } else {
                console.error("Undefined error", error);
            }
        }
    }

    return (
        <form
            style={{ display: "grid", justifyContent: "start" }}
            onSubmit={(e) => {
                e.preventDefault();
                submitForm();
            }}
        >
            {_id && <input type="hidden" name="_id" value={_id} />}
            <label htmlFor="name">Name: </label>
            <input
                type="text"
                name="name"
                id="name"
                value={name}
                onChange={(e) => {
                    setName(e.target.value);
                }}
            />
            <label htmlFor="nick">Nick: </label>
            <input
                type="text"
                name="nick"
                id="nick"
                value={nick}
                onChange={(e) => {
                    const value =
                        e.target.value === "" ? undefined : e.target.value;
                    setNick(value);
                }}
            />
            <label htmlFor="surname">Surname: </label>
            <input
                type="text"
                name="surname"
                id="surname"
                value={surname}
                onChange={(e) => {
                    setSurname(e.target.value);
                }}
            />
            <button type="submit">{_id ? "Update" : "Add"}</button>
        </form>
    );
}
