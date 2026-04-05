import { Button, Text, Tooltip } from "@fluentui/react-components";
import { WeatherMoonRegular, WeatherSunnyRegular } from "@fluentui/react-icons";
import React from "react";
import { useTheme } from "../../infrastructure/context/theme-context";
import { useAuth } from "../../infrastructure/context/auth-context";
import { UserLogo } from "../user-logo";
import { useHeaderStyles } from "./header-styles";
import { Logo } from "./logo";

export const Header: React.FC = () => {
    const { isDark, toggleTheme } = useTheme();
    const { isLoggedIn } = useAuth();
    const styles = useHeaderStyles();

    return (
        <header className={styles.root}>
            <div className={styles.brand}>
                <Logo />
                <Text className={styles.title}>My Ideal Day</Text>
            </div>

            <div className={styles.actions}>
                <Tooltip content={isDark ? "Switch to light mode" : "Switch to dark mode"} relationship="label">
                    <Button
                        appearance="subtle"
                        icon={isDark ? <WeatherSunnyRegular /> : <WeatherMoonRegular />}
                        onClick={toggleTheme}
                    />
                </Tooltip>
                {isLoggedIn && <UserLogo />}
            </div>
        </header>
    );
};
