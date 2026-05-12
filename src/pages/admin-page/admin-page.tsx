import { Tab, TabList, makeStyles, tokens } from "@fluentui/react-components";
import React, { useState } from "react";
import { AdminFeedbacksTab } from "../../components/admin-panel/admin-feedbacks-tab";
import { AdminUsersTab } from "../../components/admin-panel/admin-users-tab";
import { useAdminPanelStyles } from "../../components/admin-panel/admin-panel-styles";
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
    const styles = useAdminPanelStyles();
    const pageStyles = usePageStyles();
    const { refresh } = useNotificationBadge();
    const [tab, setTab] = useState<AdminTab>(AdminTab.Users);

    React.useEffect(() => {
        refresh("admin-feedback");
    }, []);

    return (
        <PageLayout>
            <h1 className={pageStyles.title}>{rs.AdminPanel}</h1>
            <TabList
                selectedValue={tab}
                onTabSelect={(_, d) => setTab(d.value as AdminTab)}
            >
                <Tab value={AdminTab.Users}>{rs.AdminUsers}</Tab>
                <Tab value={AdminTab.Feedbacks}>{rs.AdminFeedbacks}</Tab>
            </TabList>
            <div className={styles.tabContent}>
                {tab === AdminTab.Users && <AdminUsersTab />}
                {tab === AdminTab.Feedbacks && <AdminFeedbacksTab />}
            </div>
        </PageLayout>
    );
};
