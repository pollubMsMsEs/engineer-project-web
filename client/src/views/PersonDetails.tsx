import { useEffect, useState } from "react";
import axiosClient from "../axiosClient";
import { useParams } from "react-router-dom";
import { Person as PersonType } from "../types/movieType";
import Person from "../components/Person";
import LoadingCircle from "../components/LoadingCircle";

async function getPersonById(id: string) {
    try {
        const result = await axiosClient.get(`/person/${id}`);

        return result.data.data;
    } catch (error) {
        return false;
    }
}

export default function PersonDetails() {
    const { _id } = useParams();
    const [person, setPerson] = useState<
        (PersonType & { _id: string }) | false | null
    >(null);

    useEffect(() => {
        getPersonById(_id ?? "").then(setPerson);
    }, [_id]);

    return (
        <div>
            {person !== false ? (
                person !== null ? (
                    <Person person={person} />
                ) : (
                    <LoadingCircle size="15px" />
                )
            ) : (
                <p>Couldn't load movie</p>
            )}
        </div>
    );
}
