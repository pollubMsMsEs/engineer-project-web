import { createContext, useContext } from "react";

export const AuthenticationContext = createContext<{
    username: string;
    token: string | null;
    setUser: (username: string) => void;
    setToken: (token: string) => void;
}>({
    username: "",
    token: null,
    setUser: () => {
        console.error("setUser: Implement me!");
    },
    setToken: () => {
        console.error("setToken: Implement me!");
    },
});

export function useAuthenticationContext() {
    return useContext(AuthenticationContext);
}
