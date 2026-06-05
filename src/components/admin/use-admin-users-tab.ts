import { useEffect, useMemo, useState } from "react";
import { useLocalization, getAllUsers, User } from "../../infrastructure";

export const useAdminUsersTab = () => {
    const rs = useLocalization();
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedUser, setSelectedUser] = useState<User | null>(null);

    useEffect(() => {
        getAllUsers()
            .then(setUsers)
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    const filteredUsers = useMemo(() => {
        const q = searchQuery.trim().toLowerCase();
        return users
            .filter(x => {
                if (!q) return true;
                return (x.fullName ?? "").toLowerCase().includes(q) || (x.email ?? "").toLowerCase().includes(q);
            })
            .sort((a, b) => {
                if (!a.lastSignInAt && !b.lastSignInAt) return 0;
                if (!a.lastSignInAt) return 1;
                if (!b.lastSignInAt) return -1;
                return b.lastSignInAt.localeCompare(a.lastSignInAt);
            });
    }, [users, searchQuery]);

    return {
        rs,
        loading,
        filteredUsers,
        searchQuery,
        selectedUser,
        setSearchQuery,
        setSelectedUser,
    };
};
