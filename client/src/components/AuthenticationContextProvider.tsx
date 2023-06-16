import { useState } from "react";
import { AuthenticationContext } from "../stateContext.js";

export function AuthenticationContextProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const [username, _setUser] = useState(
        localStorage.getItem("USERNAME") ?? ""
    );
    const [token, _setToken] = useState(localStorage.getItem("JWT_TOKEN"));

    const setToken = (token: string | null) => {
        _setToken(token);
        if (token) {
            localStorage.setItem("JWT_TOKEN", token);
        } else {
            localStorage.removeItem("JWT_TOKEN");
        }
    };

    const setUser = (username: string) => {
        _setUser(username);
        localStorage.setItem("USERNAME", JSON.stringify(username));
    };

    return (
        <AuthenticationContext.Provider
            value={{
                username,
                token,
                setUser,
                setToken,
            }}
        >
            {children}
        </AuthenticationContext.Provider>
    );
}
