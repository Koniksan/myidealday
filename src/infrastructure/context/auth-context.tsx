import React, { createContext, useContext, useState } from "react";

interface AuthContextValue {
    isLoggedIn: boolean;
    login: () => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextValue>({
    isLoggedIn: false,
    login: () => {},
    logout: () => {},
});

export const useAuth = () => useContext(AuthContext);

const AUTH_KEY = "MID_isLoggedIn";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(() => localStorage.getItem(AUTH_KEY) === "true");

    const login = () => {
        localStorage.setItem(AUTH_KEY, "true");
        setIsLoggedIn(true);
    };

    const logout = () => {
        localStorage.removeItem(AUTH_KEY);
        setIsLoggedIn(false);
    };

    return (
        <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
