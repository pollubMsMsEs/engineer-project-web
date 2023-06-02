import React from "react";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

export default function MovieDetails() {
    //const [_id, setId] = useState<string>("");
    const { _id } = useParams();

    return <div>{_id}</div>;
}
