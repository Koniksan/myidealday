import React, { createContext, useContext, useState } from "react";
import { Locale, Translations, translations } from "./translations";

interface LocaleContextValue {
    locale: Locale;
    setLocale: (locale: Locale) => void;
    toggleLocale: () => void;
}

const LocaleContext = createContext<LocaleContextValue>({
    locale: "en",
    setLocale: () => {},
    toggleLocale: () => {},
});

export const useLocale = () => useContext(LocaleContext);

export const useLocalization = (): Translations => {
    const { locale } = useLocale();
    return translations[locale];
};

export const LocaleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [locale, setLocaleState] = useState<Locale>(() => {
        const saved = localStorage.getItem("locale") as Locale | null;
        if (saved) return saved;
        return navigator.language.startsWith("ru") ? "ru" : "en";
    });

    const setLocale = (l: Locale) => {
        localStorage.setItem("locale", l);
        setLocaleState(l);
    };

    const toggleLocale = () => setLocale(locale === "en" ? "ru" : "en");

    return (
        <LocaleContext.Provider value={{ locale, setLocale, toggleLocale }}>
            {children}
        </LocaleContext.Provider>
    );
};
