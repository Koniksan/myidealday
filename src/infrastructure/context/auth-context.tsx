import { User } from "@supabase/supabase-js";
import React, { createContext, useContext } from "react";
import { UserProfile } from "../storages/profile-storage";
import { useAuthSession } from "./useAuthSession";
import { useProfile, ProfileUpdate } from "./useProfile";

export type { ProfileUpdate };

interface AuthContextValue {
    isLoggedIn: boolean;
    isLoading: boolean;
    user: User | null;
    profile: UserProfile | null;
    login: (email: string, password: string) => Promise<string | null>;
    signUp: (email: string, password: string) => Promise<string | null>;
    logout: () => void;
    updateProfile: (update: ProfileUpdate) => Promise<string | null>;
}

const AuthContext = createContext<AuthContextValue>({
    isLoggedIn: false,
    isLoading: true,
    user: null,
    profile: null,
    login: async () => null,
    signUp: async () => null,
    logout: () => {},
    updateProfile: async () => null,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { isLoggedIn, isLoading, user, login, signUp, logout } = useAuthSession();
    const { profile, updateProfile } = useProfile(user?.id ?? null);

    return (
        <AuthContext.Provider value={{ isLoggedIn, isLoading, user, profile, login, signUp, logout, updateProfile }}>
            {children}
        </AuthContext.Provider>
    );
};
