import { Button, Divider, Text } from "@fluentui/react-components";
import { DesktopTooltip } from "..";
import React from "react";
import { useAuth } from "../../../infrastructure/context/auth-context";
import { useHeaderActions } from "../../../infrastructure/context/header-actions-context";
import { UserLogo } from "../../user-logo";
import { useHeaderStyles } from "./header-styles";
import { Logo } from "./logo";

export const Header: React.FC = () => {
    const { isLoggedIn } = useAuth();
    const { actions } = useHeaderActions();
    const styles = useHeaderStyles();

    return (
        <header className={styles.root}>
            <div className={styles.brand}>
                <Logo />
                <Text className={styles.title}>My Ideal Day</Text>
            </div>

            <div className={styles.actions}>
                {actions.map(action => (
                    <DesktopTooltip key={action.id} content={action.label} relationship="label">
                        <Button
                            appearance={action.appearance ?? "subtle"}
                            icon={action.icon}
                            aria-label={action.label}
                            onClick={(e) => { (e.currentTarget as HTMLElement).blur(); action.onClick(); }}
                        />
                    </DesktopTooltip>
                ))}
                {actions.length > 0 && isLoggedIn && <Divider vertical className={styles.divider} />}
                {isLoggedIn && <div className={styles.userLogo}><UserLogo /></div>}
            </div>
        </header>
    );
};
