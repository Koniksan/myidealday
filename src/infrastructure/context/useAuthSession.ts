import { User } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { supabase } from "../storages/supabase-client";

export const useAuthSession = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        supabase.auth.getSession().then(({ data }) => {
            const sessionUser = data.session?.user ?? null;
            setIsLoggedIn(!!sessionUser);
            setUser(sessionUser);
            setIsLoading(false);
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            const sessionUser = session?.user ?? null;
            setIsLoggedIn(!!sessionUser);
            setUser(sessionUser);
        });

        return () => subscription.unsubscribe();
    }, []);

    const login = async (email: string, password: string): Promise<string | null> => {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        return error?.message ?? null;
    };

    const signUp = async (email: string, password: string): Promise<string | null> => {
        const { error } = await supabase.auth.signUp({ email, password });
        return error?.message ?? null;
    };

    const logout = () => supabase.auth.signOut();

    return { isLoggedIn, isLoading, user, login, signUp, logout };
};
