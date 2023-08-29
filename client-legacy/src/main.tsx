import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import router from "./router.tsx";
import "./index.css";
import { AuthenticationContextProvider } from "./components/AuthenticationContextProvider.tsx";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <React.StrictMode>
        <AuthenticationContextProvider>
            <RouterProvider router={router} />
        </AuthenticationContextProvider>
    </React.StrictMode>
);
