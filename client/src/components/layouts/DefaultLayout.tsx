import { Outlet } from "react-router-dom";

export default function DefaultLayout() {
    return (
        <div id="defaultLayout">
            <h1>Default layout</h1>
            <main className="content">
                <Outlet />
            </main>
        </div>
    );
}
