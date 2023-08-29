import { Navigate, Outlet } from "react-router-dom";
import "./css/DefaultLayout.css";
import { useAuthenticationContext } from "../../stateContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Logo from "../Logo";

export default function DefaultLayout() {
    const { token, username } = useAuthenticationContext();

    if (!token) {
        return <Navigate to="/login" />;
    }

    return (
        <div className="component-default-layout">
            <header style={{ display: "flex" }}>
                <Logo />
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        marginLeft: "auto",
                    }}
                >
                    <div>{username}</div>
                    <button
                        style={{}}
                        onClick={() => {
                            localStorage.removeItem("JWT_TOKEN");
                            location.reload();
                        }}
                    >
                        Logout
                    </button>
                </div>
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
