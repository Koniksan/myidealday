import React, { createContext, useContext, useEffect, useState } from "react";
import { webLightTheme, webDarkTheme, Theme, FluentProvider } from "@fluentui/react-components";

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
    const systemDark = window.matchMedia("(prefers-color-scheme: dark)");
    const [isDark, setIsDark] = useState(systemDark.matches);

    useEffect(() => {
        const handleChange = (e: MediaQueryListEvent) => setIsDark(e.matches);
        systemDark.addEventListener("change", handleChange);
        return () => systemDark.removeEventListener("change", handleChange);
    }, []);

    const toggleTheme = () => setIsDark(prev => !prev);
    const theme: Theme = isDark ? webDarkTheme : webLightTheme;

    return (
        <ThemeContext.Provider value={{ isDark, toggleTheme }}>
            <FluentProvider theme={theme}>
                {children}
            </FluentProvider>
        </ThemeContext.Provider>
    );
};
