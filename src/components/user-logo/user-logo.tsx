import { Avatar, Menu, MenuItem, MenuList, MenuPopover, MenuTrigger } from "@fluentui/react-components";
import { ArrowExitRegular, SettingsRegular } from "@fluentui/react-icons";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../infrastructure/context/auth-context";
import { SettingsPanel } from "../settings-panel";
import { useUserLogoStyles } from "./user-logo-styles";

export const UserLogo: React.FC = () => {
    const styles = useUserLogoStyles();
    const navigate = useNavigate();
    const { logout, user, profile } = useAuth();
    const [settingsOpen, setSettingsOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    const displayName = profile?.fullName ?? user?.email ?? undefined;
    const imageUrl = profile?.avatarUrl ?? undefined;

    return (
        <>
            <Menu>
                <MenuTrigger disableButtonEnhancement>
                    <button className={styles.avatarButton} aria-label="User menu">
                        <Avatar name={displayName} image={imageUrl ? { src: imageUrl } : undefined} color="colorful" size={32} />
                    </button>
                </MenuTrigger>
                <MenuPopover>
                    <MenuList>
                        <MenuItem icon={<SettingsRegular />} onClick={() => setSettingsOpen(true)}>
                            Settings
                        </MenuItem>
                        <MenuItem icon={<ArrowExitRegular />} onClick={handleLogout}>
                            Log out
                        </MenuItem>
                    </MenuList>
                </MenuPopover>
            </Menu>
            {settingsOpen && (
                <SettingsPanel open={settingsOpen} onClose={() => setSettingsOpen(false)} />
            )}
        </>
    );
};
