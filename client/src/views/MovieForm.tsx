import { useState, useEffect } from "react";
import {
    redirect,
    useLocation,
    useNavigate,
    useParams,
} from "react-router-dom";

export default function MovieForm() {
    const navigate = useNavigate();
    const { _id } = useParams();

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [publishedAt, setPublishedAt] = useState("");
    const [genres, setGenres] = useState<string[]>([]);

    //useEffect(() => {}, []);

    return <form></form>;
}
