import { CounterBadge, Tab, TabList, makeStyles, tokens } from "@fluentui/react-components";
import React, { useState } from "react";
import { AdminFeedbacksTab } from "../../components/admin/admin-feedbacks-tab";
import { AdminUsersTab } from "../../components/admin/admin-users-tab";
import { useAdminStyles } from "../../components/admin/admin-styles";
import { PageLayout } from "../../components/common";
import { useLocalization } from "../../infrastructure/context/locale-context";
import { useNotificationBadge } from "../../infrastructure/context/notification-badge-context";

const usePageStyles = makeStyles({
    title: {
        fontSize: tokens.fontSizeBase600,
        fontWeight: tokens.fontWeightSemibold,
        color: tokens.colorNeutralForeground1,
        margin: 0,
    },
});

enum AdminTab {
    Users = "users",
    Feedbacks = "feedbacks",
}

export const AdminPage: React.FC = () => {
    const rs = useLocalization();
    const styles = useAdminStyles();
    const pageStyles = usePageStyles();
    const { refresh, getCount } = useNotificationBadge();
    const newFeedbackCount = getCount("admin-feedback");
    const [tab, setTab] = useState<AdminTab>(AdminTab.Users);

    React.useEffect(() => {
        refresh("admin-feedback");
    }, []);

    return (
        <PageLayout>
            <TabList
                selectedValue={tab}
                onTabSelect={(_, d) => setTab(d.value as AdminTab)}
            >
                <Tab value={AdminTab.Users}>{rs.AdminUsers}</Tab>
                <Tab value={AdminTab.Feedbacks}>
                    {rs.AdminFeedbacks}
                    {newFeedbackCount > 0 && <CounterBadge className={styles.tabBadge} count={newFeedbackCount} color="brand" size="small" />}
                </Tab>
            </TabList>
            <div className={styles.tabContent}>
                {tab === AdminTab.Users && <AdminUsersTab />}
                {tab === AdminTab.Feedbacks && <AdminFeedbacksTab />}
            </div>
        </PageLayout>
    );
};
