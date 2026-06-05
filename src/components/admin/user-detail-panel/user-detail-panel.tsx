import {
    Avatar,
    Button,
    DrawerBody,
    DrawerHeader,
    DrawerHeaderTitle,
    OverlayDrawer,
    Text,
} from "@fluentui/react-components";
import { DismissRegular } from "@fluentui/react-icons";
import React from "react";
import { User, UserRole, useLocalization } from "../../../infrastructure";
import { useUserDetailPanelStyles } from "./user-detail-panel-styles";

interface UserDetailPanelProps {
    user: User | null;
    onClose: () => void;
}

export const UserDetailPanel: React.FC<UserDetailPanelProps> = ({ user, onClose }) => {
    const styles = useUserDetailPanelStyles();
    const rs = useLocalization();

    const formatDate = (iso: string) =>
        new Date(iso).toLocaleString(rs.DateLocale, {
            day: "numeric", month: "short", year: "numeric",
            hour: "2-digit", minute: "2-digit",
        });

    return (
        <OverlayDrawer
            open={user !== null}
            size="small"
            position="end"
            onOpenChange={(_, d) => !d.open && onClose()}
        >
            <DrawerHeader>
                <DrawerHeaderTitle
                    action={<Button appearance="subtle" icon={<DismissRegular />} onClick={onClose} />}
                >
                    {rs.AdminUserDetailTitle}
                </DrawerHeaderTitle>
            </DrawerHeader>
            <DrawerBody>
                {user && (
                    <div className={styles.body}>
                        <div className={styles.avatarSection}>
                            <Avatar
                                name={user.fullName ?? user.email ?? undefined}
                                image={user.avatarUrl ? { src: user.avatarUrl } : undefined}
                                color="colorful"
                                size={72}
                            />
                            <Text className={styles.displayName}>
                                {user.fullName ?? user.email ?? rs.AdminAnonymous}
                            </Text>
                            {user.fullName && user.email && (
                                <Text className={styles.emailSubtitle}>{user.email}</Text>
                            )}
                        </div>

                        <div className={styles.fieldList}>
                            <div className={styles.fieldRow}>
                                <Text className={styles.fieldLabel}>{rs.AdminColEmail}</Text>
                                <Text className={styles.fieldValue}>{user.email ?? "—"}</Text>
                            </div>
                            <div className={styles.fieldRow}>
                                <Text className={styles.fieldLabel}>{rs.AdminColRole}</Text>
                                <Text className={styles.fieldValue}>
                                    {user.role === UserRole.Admin ? rs.Admin : rs.AdminUsers}
                                </Text>
                            </div>
                            <div className={styles.fieldRow}>
                                <Text className={styles.fieldLabel}>{rs.AdminColRegistered}</Text>
                                <Text className={styles.fieldValue}>{formatDate(user.createdAt)}</Text>
                            </div>
                            <div className={styles.fieldRow}>
                                <Text className={styles.fieldLabel}>{rs.AdminLastLogin}</Text>
                                <Text className={styles.fieldValue}>
                                    {user.lastSignInAt ? formatDate(user.lastSignInAt) : rs.AdminNeverLoggedIn}
                                </Text>
                            </div>
                        </div>
                    </div>
                )}
            </DrawerBody>
        </OverlayDrawer>
    );
};
