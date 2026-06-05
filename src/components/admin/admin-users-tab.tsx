import { Avatar, SearchBox, Spinner, Text } from "@fluentui/react-components";
import { PeopleRegular } from "@fluentui/react-icons";
import React from "react";
import { UserDetailPanel } from "./user-detail-panel";
import { useAdminStyles } from "./admin-styles";
import { useAdminUsersTab } from "./use-admin-users-tab";

export const AdminUsersTab: React.FC = () => {
    const styles = useAdminStyles();
    const { rs, loading, filteredUsers, searchQuery, selectedUser, setSearchQuery, setSelectedUser } = useAdminUsersTab();

    if (loading) {
        return <div className={styles.usersTabContainer}><div className={styles.center}><Spinner size="medium" /></div></div>;
    }

    return (
        <div className={styles.usersTabContainer}>
            <SearchBox
                className={styles.searchBar}
                placeholder={rs.AdminSearchPlaceholder}
                value={searchQuery}
                dismiss={searchQuery ? undefined : null}
                onChange={(e, d) => setSearchQuery(d.value)}
            />

            {filteredUsers.length === 0 ? (
                <div className={styles.emptyState}>
                    <PeopleRegular fontSize={32} />
                    <Text>{rs.AdminNoUsers}</Text>
                </div>
            ) : (
                <div className={styles.userList}>
                    {filteredUsers.map(x => (
                        <div
                            key={x.id}
                            className={styles.userListRow}
                            onClick={e => setSelectedUser(x)}
                        >
                            <div className={styles.userListCol1}>
                                <Avatar
                                    name={x.fullName ?? x.email ?? undefined}
                                    image={x.avatarUrl ? { src: x.avatarUrl } : undefined}
                                    color="colorful"
                                    size={32}
                                />
                                <div className={styles.userInfo}>
                                    <Text className={styles.userName}>
                                        {x.fullName ?? x.email ?? rs.AdminAnonymous}
                                    </Text>
                                    {x.fullName && x.email && (
                                        <Text className={styles.userListSubtitle}>{x.email}</Text>
                                    )}
                                </div>
                            </div>
                            <Text className={styles.userListCol2}>
                                {x.lastSignInAt
                                    ? new Date(x.lastSignInAt).toLocaleString(rs.DateLocale, {
                                        day: "numeric", month: "short", year: "numeric",
                                    })
                                    : rs.AdminNeverLoggedIn}
                            </Text>
                        </div>
                    ))}
                </div>
            )}

            <UserDetailPanel
                user={selectedUser}
                onClose={() => setSelectedUser(null)}
            />
        </div>
    );
};
