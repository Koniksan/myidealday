import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../storages/supabase-client";

interface AuthContextValue {
    isLoggedIn: boolean;
    login: (email: string, password: string) => Promise<string | null>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextValue>({
    isLoggedIn: false,
    login: async () => null,
    logout: () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        supabase.auth.getSession().then(({ data }) => {
            setIsLoggedIn(!!data.session);
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setIsLoggedIn(!!session);
        });

        return () => subscription.unsubscribe();
    }, []);

    const login = async (email: string, password: string): Promise<string | null> => {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) return error.message;
        return null;
    };

    const logout = () => {
        supabase.auth.signOut();
    };

    return (
        <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
