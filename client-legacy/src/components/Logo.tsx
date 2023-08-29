import Icon from "@mdi/react";
import { mdiMovieOpen } from "@mdi/js";

export default function Logo() {
    return (
        <h1
            style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
            }}
        >
            <span>Movie Database</span>
            <Icon path={mdiMovieOpen} color={"#f87171"} size={"3rem"} />
        </h1>
    );
}
