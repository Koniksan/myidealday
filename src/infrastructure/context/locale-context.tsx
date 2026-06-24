import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { Locale, Translations, translations } from "./translations";
import { useAuth } from "./auth-context";

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

const systemLocale = (): Locale => navigator.language.startsWith("ru") ? "ru" : "en";

export const LocaleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user, profile, updateProfile } = useAuth();
    const [locale, setLocaleState] = useState<Locale>(systemLocale);

    const profileLoaded = useRef(false);

    useEffect(() => {
        if (profileLoaded.current || !profile) return;
        profileLoaded.current = true;
        if (profile.language === "en" || profile.language === "ru") {
            setLocaleState(profile.language);
        }
    }, [profile]);

    useEffect(() => {
        if (!user) {
            profileLoaded.current = false;
            setLocaleState(systemLocale());
        }
    }, [user]);

    const setLocale = (l: Locale) => {
        setLocaleState(l);
        if (user) updateProfile({ language: l });
    };

    const toggleLocale = () => setLocale(locale === "en" ? "ru" : "en");

    return (
        <LocaleContext.Provider value={{ locale, setLocale, toggleLocale }}>
            {children}
        </LocaleContext.Provider>
    );
};
