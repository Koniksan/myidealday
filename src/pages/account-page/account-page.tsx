import { Avatar, Badge, Text } from "@fluentui/react-components";
import { ArrowExitRegular, ChatRegular, ChevronRightRegular, SettingsRegular, ShieldRegular } from "@fluentui/react-icons";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AdminPanel } from "../../components/admin-panel";
import { FeedbackPanel } from "../../components/feedback";
import { PageLayout } from "../../components/common/page-layout";
import { PageShell, usePageShellStyles } from "../../components/common/page-shell";
import { useAuth } from "../../infrastructure/context/auth-context";
import { useLocalization } from "../../infrastructure/context/locale-context";
import { useNotificationBadge } from "../../infrastructure/context/notification-badge-context";
import { useAccountPageStyles } from "./account-page-styles";

export const AccountPage: React.FC = () => {
    const styles = useAccountPageStyles();
    const shell = usePageShellStyles();
    const navigate = useNavigate();
    const { logout, user, profile } = useAuth();
    const rs = useLocalization();
    const { getCount, refresh } = useNotificationBadge();
    const [feedbackOpen, setFeedbackOpen] = useState(false);
    const [adminOpen, setAdminOpen] = useState(false);

    const feedbackCount = getCount("feedback");
    const adminFeedbackCount = getCount("admin-feedback");
    const displayName = profile?.fullName ?? undefined;
    const imageUrl = profile?.avatarUrl ?? undefined;

    const handleFeedbackOpen = () => {
        setFeedbackOpen(true);
        refresh("feedback");
    };

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    return (
        <PageLayout>
            <PageShell backTo="/user">
                <div className={styles.avatarSection}>
                    <Avatar name={displayName ?? user?.email} image={imageUrl ? { src: imageUrl } : undefined} color="colorful" size={64} />
                    {displayName && <Text className={styles.displayName}>{displayName}</Text>}
                    {user?.email && <Text className={styles.email}>{user.email}</Text>}
                </div>

                <div className={shell.card}>
                    {profile?.isAdmin && (
                        <button className={shell.row} onClick={() => { setAdminOpen(true); refresh("admin-feedback"); }}>
                            <ShieldRegular className={styles.rowIcon} />
                            <span className={shell.rowLabel}>{rs.AdminPanel}</span>
                            {adminFeedbackCount > 0 && <Badge color="danger" size="small" appearance="filled">{adminFeedbackCount}</Badge>}
                            <ChevronRightRegular className={styles.rowChevron} />
                        </button>
                    )}
                    <button className={shell.row} onClick={() => navigate("/settings")}>
                        <SettingsRegular className={styles.rowIcon} />
                        <span className={shell.rowLabel}>{rs.Settings}</span>
                        <ChevronRightRegular className={styles.rowChevron} />
                    </button>
                    <button className={shell.row} onClick={handleFeedbackOpen}>
                        <ChatRegular className={styles.rowIcon} />
                        <span className={shell.rowLabel}>{rs.Feedback}</span>
                        {feedbackCount > 0 && <Badge color="danger" size="small" appearance="filled">{feedbackCount}</Badge>}
                        <ChevronRightRegular className={styles.rowChevron} />
                    </button>
                </div>

                <button className={styles.logoutButton} onClick={handleLogout}>
                    <ArrowExitRegular />
                    {rs.LogOut}
                </button>
            </PageShell>

            <AdminPanel open={adminOpen} onClose={() => setAdminOpen(false)} />
            <FeedbackPanel open={feedbackOpen} onClose={() => setFeedbackOpen(false)} />
        </PageLayout>
    );
};
