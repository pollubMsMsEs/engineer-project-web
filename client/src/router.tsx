import { createBrowserRouter } from "react-router-dom";
import DefaultLayout from "./components/layouts/DefaultLayout.tsx";
import GuestLayout from "./components/layouts/GuestLayout.tsx";
import Login from "./views/Login.tsx";
import Signup from "./views/Signup.tsx";
import Index from "./views/Index.tsx";
import MovieList from "./views/MovieList.tsx";
import MovieDetails from "./views/MovieDetails.tsx";
import MovieForm from "./views/MovieForm.tsx";
import PeopleList from "./views/PersonList.tsx";
import PersonDetails from "./views/PersonDetails.tsx";
import PersonForm from "./views/PersonForm.tsx";

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
                path: "movie",
                children: [
                    {
                        path: "all",
                        element: <MovieList />,
                    },
                    {
                        path: "create",
                        element: <MovieForm />,
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
            {
                path: "person",
                children: [
                    {
                        path: "all",
                        element: <PeopleList />,
                    },
                    {
                        path: "create",
                        element: <PersonForm />,
                    },
                    {
                        path: ":_id",
                        element: <PersonDetails />,
                    },
                    {
                        path: ":_id/edit",
                        element: <PersonForm />,
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
