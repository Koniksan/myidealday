import { User } from "@supabase/supabase-js";
import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../storages/supabase-client";

interface AuthContextValue {
    isLoggedIn: boolean;
    user: User | null;
    login: (email: string, password: string) => Promise<string | null>;
    signUp: (email: string, password: string) => Promise<string | null>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextValue>({
    isLoggedIn: false,
    user: null,
    login: async () => null,
    signUp: async () => null,
    logout: () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        supabase.auth.getSession().then(({ data }) => {
            setIsLoggedIn(!!data.session);
            setUser(data.session?.user ?? null);
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setIsLoggedIn(!!session);
            setUser(session?.user ?? null);
        });

        return () => subscription.unsubscribe();
    }, []);

    const login = async (email: string, password: string): Promise<string | null> => {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) return error.message;
        return null;
    };

    const signUp = async (email: string, password: string): Promise<string | null> => {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) return error.message;
        return null;
    };

    const logout = () => {
        supabase.auth.signOut();
    };

    return (
        <AuthContext.Provider value={{ isLoggedIn, user, login, signUp, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
