import { createBrowserRouter } from "react-router-dom";
import App from "./App.tsx";
import DefaultLayout from "./components/layouts/DefaultLayout.tsx";

const router = createBrowserRouter([
    {
        path: "/",
        element: <DefaultLayout />,
        children: [
            {
                path: "/dev",
                element: <App />,
            },
        ],
    },
]);

export default router;
