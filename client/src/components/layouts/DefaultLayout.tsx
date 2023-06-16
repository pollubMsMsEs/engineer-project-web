import { Navigate, Outlet } from "react-router-dom";
import "./css/DefaultLayout.css";
import Icon from "@mdi/react";
import { mdiMovieOpen } from "@mdi/js";
import { useAuthenticationContext } from "../../stateContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function DefaultLayout() {
    const { token } = useAuthenticationContext();

    if (!token) {
        return <Navigate to="/login" />;
    }

    return (
        <div className="component-default-layout">
            <header>
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
            </header>
            <aside>
                <a href="/">Home</a>
                <a href="/all">Everything list</a>
                <a href="/movie/all">Movies table</a>
                <a href="/person/all">People table</a>
            </aside>
            <main className="content">
                <Outlet />
            </main>
            <ToastContainer
                position={toast.POSITION.BOTTOM_CENTER}
                theme="dark"
            />
        </div>
    );
}
