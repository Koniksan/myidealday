import {
    Avatar,
    DataGrid,
    DataGridBody,
    DataGridCell,
    DataGridHeader,
    DataGridHeaderCell,
    DataGridRow,
    Spinner,
    TableCellLayout,
    TableColumnDefinition,
    Text,
    createTableColumn,
} from "@fluentui/react-components";
import { PeopleRegular } from "@fluentui/react-icons";
import React, { useEffect, useMemo, useState } from "react";
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

    const columns: TableColumnDefinition<AdminUser>[] = useMemo(() => [
        createTableColumn<AdminUser>({
            columnId: "user",
            compare: (a, b) => (a.fullName ?? a.email ?? "").localeCompare(b.fullName ?? b.email ?? ""),
            renderHeaderCell: () => rs.AdminColName,
            renderCell: (user) => (
                <TableCellLayout
                    media={
                        <Avatar
                            name={user.fullName ?? user.email ?? undefined}
                            image={user.avatarUrl ? { src: user.avatarUrl } : undefined}
                            color="colorful"
                            size={32}
                        />
                    }
                >
                    <Text className={styles.userName}>
                        {user.fullName ?? user.email ?? rs.AdminAnonymous}
                    </Text>
                </TableCellLayout>
            ),
        }),
        createTableColumn<AdminUser>({
            columnId: "email",
            renderHeaderCell: () => rs.AdminColEmail,
            renderCell: (user) => (
                <Text className={styles.userId}>{user.email ?? "—"}</Text>
            ),
        }),
        createTableColumn<AdminUser>({
            columnId: "registered",
            compare: (a, b) => a.createdAt.localeCompare(b.createdAt),
            renderHeaderCell: () => rs.AdminColRegistered,
            renderCell: (user) => (
                <Text className={styles.userId}>
                    {new Date(user.createdAt).toLocaleString(rs.DateLocale, {
                        day: "numeric", month: "short", year: "numeric",
                        hour: "2-digit", minute: "2-digit",
                    })}
                </Text>
            ),
        }),
        createTableColumn<AdminUser>({
            columnId: "lastLogin",
            compare: (a, b) => (a.lastSignInAt ?? "").localeCompare(b.lastSignInAt ?? ""),
            renderHeaderCell: () => rs.AdminLastLogin,
            renderCell: (user) => (
                <Text className={styles.userId}>
                    {user.lastSignInAt
                        ? new Date(user.lastSignInAt).toLocaleString(rs.DateLocale, {
                            day: "numeric", month: "short", year: "numeric",
                            hour: "2-digit", minute: "2-digit",
                        })
                        : rs.AdminNeverLoggedIn}
                </Text>
            ),
        }),
    ], [rs]);

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
        <div className={styles.dataGridWrapper}>
        <div className={styles.dataGrid}>
        <DataGrid
            items={users}
            columns={columns}
            sortable
            getRowId={(user) => user.id}
            size="small"
            resizableColumns
            columnSizingOptions={{
                user: { defaultWidth: 400, minWidth: 150 },
                email: { defaultWidth: 250, minWidth: 120 },
                registered: { defaultWidth: 175, minWidth: 140 },
                lastLogin: { defaultWidth: 195, minWidth: 140 },
            }}
        >
            <DataGridHeader>
                <DataGridRow>
                    {({ renderHeaderCell }) => (
                        <DataGridHeaderCell>{renderHeaderCell()}</DataGridHeaderCell>
                    )}
                </DataGridRow>
            </DataGridHeader>
            <DataGridBody<AdminUser>>
                {({ item, rowId }) => (
                    <DataGridRow<AdminUser> className={styles.userGridRow} key={rowId}>
                        {({ renderCell }) => (
                            <DataGridCell>{renderCell(item)}</DataGridCell>
                        )}
                    </DataGridRow>
                )}
            </DataGridBody>
        </DataGrid>
        </div>
        </div>
    );
};
