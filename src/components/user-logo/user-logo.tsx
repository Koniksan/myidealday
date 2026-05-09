import { Avatar, Badge, Menu, MenuItem, MenuList, MenuPopover, MenuTrigger } from "@fluentui/react-components";
import { ArrowExitRegular, ChatRegular, ShieldRegular, SettingsRegular } from "@fluentui/react-icons";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../infrastructure/context/auth-context";
import { useLocalization } from "../../infrastructure/context/locale-context";
import { useNotificationBadge } from "../../infrastructure/context/notification-badge-context";
import { getUnreadFeedbacks, markFeedbackSeen } from "../../infrastructure/storages/feedback-storage";
import { getUnreadFeedbacksForAdmin, markAdminFeedbackSeen } from "../../infrastructure/storages/admin-storage";
import { AdminPanel } from "../admin-panel";
import { FeedbackPanel } from "../feedback";
import { SettingsPanel } from "../settings-panel";
import { useUserLogoStyles } from "./user-logo-styles";

export const UserLogo: React.FC = () => {
    const styles = useUserLogoStyles();
    const navigate = useNavigate();
    const { logout, user, profile } = useAuth();
    const rs = useLocalization();
    const { registerSource, unregisterSource, getCount, totalCount, refresh } = useNotificationBadge();
    const [settingsOpen, setSettingsOpen] = useState(false);
    const [feedbackOpen, setFeedbackOpen] = useState(false);
    const [adminOpen, setAdminOpen] = useState(false);

    useEffect(() => {
        if (!user) return;
        registerSource({
            key: "feedback",
            fetchUnread: () => getUnreadFeedbacks(user.id),
            markSeen: markFeedbackSeen,
        });
        return () => unregisterSource("feedback");
    }, [user?.id]);

    useEffect(() => {
        if (!profile?.isAdmin) return;
        registerSource({
            key: "admin-feedback",
            fetchUnread: getUnreadFeedbacksForAdmin,
            markSeen: markAdminFeedbackSeen,
        });
        return () => unregisterSource("admin-feedback");
    }, [profile?.isAdmin]);

    const handleFeedbackOpen = () => {
        setFeedbackOpen(true);
        refresh("feedback");
    };

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    const displayName = profile?.fullName ?? user?.email ?? undefined;
    const imageUrl = profile?.avatarUrl ?? undefined;
    const feedbackCount = getCount("feedback");
    const adminFeedbackCount = getCount("admin-feedback");

    return (
        <>
            <Menu>
                <MenuTrigger disableButtonEnhancement>
                    <button className={styles.avatarButton} aria-label="User menu">
                        <div className={styles.avatarWrapper}>
                            <Avatar name={displayName} image={imageUrl ? { src: imageUrl } : undefined} color="colorful" size={32} />
                            {totalCount > 0 && (
                                <Badge className={styles.avatarBadge} color="danger" size="small" appearance="filled">
                                    {totalCount}
                                </Badge>
                            )}
                        </div>
                    </button>
                </MenuTrigger>
                <MenuPopover>
                    <MenuList>
                        {profile?.isAdmin && (
                            <MenuItem icon={<ShieldRegular />} onClick={() => { setAdminOpen(true); refresh("admin-feedback"); }}>
                                <div className={styles.menuItemContent}>
                                    {rs.AdminPanel}
                                    {adminFeedbackCount > 0 && (
                                        <Badge className={styles.menuItemBadge} color="danger" size="small" appearance="filled">
                                            {adminFeedbackCount}
                                        </Badge>
                                    )}
                                </div>
                            </MenuItem>
                        )}
                        <MenuItem icon={<SettingsRegular />} onClick={() => setSettingsOpen(true)}>
                            {rs.Settings}
                        </MenuItem>
                        <MenuItem icon={<ChatRegular />} onClick={handleFeedbackOpen}>
                            <div className={styles.menuItemContent}>
                                {rs.Feedback}
                                {feedbackCount > 0 && (
                                    <Badge className={styles.menuItemBadge} color="danger" size="small" appearance="filled">
                                        {feedbackCount}
                                    </Badge>
                                )}
                            </div>
                        </MenuItem>
                        <MenuItem icon={<ArrowExitRegular />} onClick={handleLogout}>
                            {rs.LogOut}
                        </MenuItem>
                    </MenuList>
                </MenuPopover>
            </Menu>
            <AdminPanel open={adminOpen} onClose={() => setAdminOpen(false)} />
            <SettingsPanel open={settingsOpen} onClose={() => setSettingsOpen(false)} />
            <FeedbackPanel open={feedbackOpen} onClose={() => setFeedbackOpen(false)} />
        </>
    );
};
