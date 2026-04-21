import { Avatar, Menu, MenuItem, MenuList, MenuPopover, MenuTrigger } from "@fluentui/react-components";
import { ArrowExitRegular, SettingsRegular } from "@fluentui/react-icons";
import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../infrastructure/context/auth-context";
import { useUserLogoStyles } from "./user-logo-styles";

export const UserLogo: React.FC = () => {
    const styles = useUserLogoStyles();
    const navigate = useNavigate();
    const { logout, user } = useAuth();

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    const displayName = user?.user_metadata?.full_name ?? user?.email ?? undefined;
    const imageUrl = user?.user_metadata?.avatar_url ?? undefined;

    return (
        <Menu>
            <MenuTrigger disableButtonEnhancement>
                <button className={styles.avatarButton} aria-label="User menu">
                    <Avatar name={displayName} image={imageUrl ? { src: imageUrl } : undefined} color="colorful" size={32} />
                </button>
            </MenuTrigger>
            <MenuPopover>
                <MenuList>
                    <MenuItem icon={<SettingsRegular />}>Settings</MenuItem>
                    <MenuItem icon={<ArrowExitRegular />} onClick={handleLogout}>
                        Log out
                    </MenuItem>
                </MenuList>
            </MenuPopover>
        </Menu>
    );
};
