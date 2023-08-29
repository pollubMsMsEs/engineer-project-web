import { useEffect, useState } from "react";
import axiosClient from "../axiosClient";
import { useParams } from "react-router-dom";
import { Person as PersonType } from "../types/movieType";
import Person from "../components/Person";
import LoadingCircle from "../components/LoadingCircle";
import { ToastContainer, toast } from "react-toastify";

async function getPersonById(id: string) {
    try {
        const result = await axiosClient.get(`/person/${id}`);

        return result.data.data;
    } catch (error: any) {
        toast.error(error.data.errors[0].msg);
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
            <h2>Person</h2>
            {person !== false ? (
                person !== null ? (
                    <Person person={person} />
                ) : (
                    <LoadingCircle size="15px" />
                )
            ) : (
                <p>Couldn't load person</p>
            )}
        </div>
    );
}
