import { Avatar, Spinner, Text } from "@fluentui/react-components";
import { PeopleRegular } from "@fluentui/react-icons";
import React, { useEffect, useState } from "react";
import { useLocalization } from "../../infrastructure/context/locale-context";
import { AdminUser, getAllUsers } from "../../infrastructure/storages/admin-storage";
import { useAdminPanelStyles } from "./admin-panel-styles";

export const AdminUsersTab: React.FC = () => {
    const styles = useAdminPanelStyles();
    const rs = useLocalization();
    const [users, setUsers] = useState<AdminUser[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getAllUsers()
            .then(setUsers)
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return <div className={styles.center}><Spinner size="medium" /></div>;
    }

    if (users.length === 0) {
        return (
            <div className={styles.emptyState}>
                <PeopleRegular fontSize={32} />
                <Text>{rs.AdminNoUsers}</Text>
            </div>
        );
    }

    return (
        <>
            {users.map(user => (
                <div key={user.id} className={styles.userItem}>
                    <Avatar
                        name={user.fullName ?? user.email ?? undefined}
                        image={user.avatarUrl ? { src: user.avatarUrl } : undefined}
                        color="colorful"
                        size={36}
                    />
                    <div className={styles.userInfo}>
                        <Text className={styles.userName}>
                            {user.fullName ?? user.email ?? rs.AdminAnonymous}
                        </Text>
                        {user.fullName && user.email && (
                            <Text className={styles.userId}>{user.email}</Text>
                        )}
                        <Text className={styles.userId}>
                            {new Date(user.createdAt).toLocaleDateString(rs.DateLocale, {
                                day: "numeric", month: "short", year: "numeric",
                            })}
                        </Text>
                        <Text className={styles.userId}>
                            {rs.AdminLastLogin}: {user.lastSignInAt
                                ? new Date(user.lastSignInAt).toLocaleDateString(rs.DateLocale, {
                                    day: "numeric", month: "short", year: "numeric",
                                })
                                : rs.AdminNeverLoggedIn}
                        </Text>
                    </div>
                </div>
            ))}
        </>
    );
};
