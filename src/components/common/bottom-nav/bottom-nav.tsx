import { Button } from "@fluentui/react-components";
import { WeatherMoonRegular, WeatherSunnyRegular } from "@fluentui/react-icons";
import React from "react";
import { useTheme } from "../../../infrastructure/context/theme-context";
import { useAuth } from "../../../infrastructure/context/auth-context";
import { useHeaderActions } from "../../../infrastructure/context/header-actions-context";
import { useLocalization } from "../../../infrastructure/context/locale-context";
import { UserLogo } from "../../user-logo";
import { LanguageSwitcher } from "../language-switcher";
import { useBottomNavStyles } from "./bottom-nav-styles";

export const BottomNav: React.FC = () => {
    const { isDark, toggleTheme } = useTheme();
    const { isLoggedIn } = useAuth();
    const { actions } = useHeaderActions();
    const rs = useLocalization();
    const styles = useBottomNavStyles();

    return (
        <nav className={styles.root}>
            {actions.map(action => (
                <Button
                    key={action.id}
                    appearance={action.appearance ?? "subtle"}
                    icon={action.icon}
                    aria-label={action.label}
                    onClick={(e) => { (e.currentTarget as HTMLElement).blur(); action.onClick(); }}
                />
            ))}
            <LanguageSwitcher />
            <Button
                appearance="subtle"
                icon={isDark ? <WeatherSunnyRegular /> : <WeatherMoonRegular />}
                aria-label={isDark ? rs.SwitchToLight : rs.SwitchToDark}
                onClick={(e) => { (e.currentTarget as HTMLElement).blur(); toggleTheme(); }}
            />
            {isLoggedIn && <UserLogo />}
        </nav>
    );
};
