import { createBrowserRouter } from "react-router-dom";
import App from "./App.tsx";
import DefaultLayout from "./components/layouts/DefaultLayout.tsx";
import GuestLayout from "./components/layouts/GuestLayout.tsx";
import Login from "./views/Login.tsx";
import Signup from "./views/Signup.tsx";
import Index from "./views/Index.tsx";
import MovieList from "./views/MovieList.tsx";
import MovieDetails from "./views/MovieDetails.tsx";
import MovieForm from "./views/MovieForm.tsx";

const router = createBrowserRouter([
    {
        path: "/",
        element: <DefaultLayout />,
        children: [
            {
                path: "",
                element: <Index />,
            },
            {
                path: "dev",
                element: <App />,
            },
            {
                path: "movie",
                children: [
                    {
                        path: "all",
                        element: <MovieList />,
                    },
                    {
                        path: ":_id",
                        element: <MovieDetails />,
                    },
                    {
                        path: ":_id/edit",
                        element: <MovieForm />,
                    },
                ],
            },
        ],
    },
    {
        path: "/",
        element: <GuestLayout />,
        children: [
            {
                path: "/login",
                element: <Login />,
            },
            {
                path: "/signup",
                element: <Signup />,
            },
        ],
    },
]);

export default router;
