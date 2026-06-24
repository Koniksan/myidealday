import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { webLightTheme, webDarkTheme, Theme, FluentProvider } from "@fluentui/react-components";
import { useAuth } from "./auth-context";

interface ThemeContextValue {
    isDark: boolean;
    toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue>({
    isDark: false,
    toggleTheme: () => {},
});

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user, profile, updateProfile } = useAuth();
    const systemDark = window.matchMedia("(prefers-color-scheme: dark)");

    const [theme, setTheme] = useState<"dark" | "light">(systemDark.matches ? "dark" : "light");

    const profileLoaded = useRef(false);

    useEffect(() => {
        if (profileLoaded.current || !profile) return;
        profileLoaded.current = true;
        if (profile.theme === "dark" || profile.theme === "light") {
            setTheme(profile.theme);
        }
    }, [profile]);

    useEffect(() => {
        if (!user) {
            profileLoaded.current = false;
            setTheme(systemDark.matches ? "dark" : "light");
        }
    }, [user]);

    const toggleTheme = () => {
        setTheme(prev => {
            const next = prev === "dark" ? "light" : "dark";
            if (user) updateProfile({ theme: next });
            return next;
        });
    };

    const isDark = theme === "dark";
    const fluentTheme: Theme = isDark ? webDarkTheme : webLightTheme;

    useEffect(() => {
        document.body.style.backgroundColor = fluentTheme.colorNeutralBackground1;
    }, [fluentTheme]);

    return (
        <ThemeContext.Provider value={{ isDark, toggleTheme }}>
            <FluentProvider theme={fluentTheme}>
                {children}
            </FluentProvider>
        </ThemeContext.Provider>
    );
};
