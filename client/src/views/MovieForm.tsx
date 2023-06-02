import { useState, useEffect } from "react";
import {
    redirect,
    useLocation,
    useNavigate,
    useParams,
} from "react-router-dom";

export default function MovieForm() {
    const movie = useLocation().state;
    const navigate = useNavigate();
    const { _id } = useParams();

    const [title, setTitle] = useState();

    useEffect(() => {
        if ((_id != null && movie == null) || movie._id !== _id) {
            navigate("/movie/all");
        }
    }, []);

    return <form>{movie?.title ?? ""}</form>;
}
