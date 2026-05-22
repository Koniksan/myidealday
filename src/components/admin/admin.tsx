import {
    Button,
    CounterBadge,
    DrawerBody,
    DrawerHeader,
    DrawerHeaderTitle,
    OverlayDrawer,
    Tab,
    TabList,
} from "@fluentui/react-components";
import { DismissRegular } from "@fluentui/react-icons";
import React, { useState } from "react";
import { useLocalization } from "../../infrastructure/context/locale-context";
import { useNotificationBadge } from "../../infrastructure/context/notification-badge-context";
import { useAdminStyles } from "./admin-styles";
import { AdminFeedbacksTab } from "./admin-feedbacks-tab";
import { AdminUsersTab } from "./admin-users-tab";


enum AdminTab {
    Users = "users",
    Feedbacks = "feedbacks",
}

interface AdminProps {
    open: boolean;
    onClose: () => void;
}

export const Admin: React.FC<AdminProps> = ({ open, onClose }) => {
    const styles = useAdminStyles();
    const rs = useLocalization();
    const { getCount } = useNotificationBadge();
    const newFeedbackCount = getCount("admin-feedback");
    const [tab, setTab] = useState<AdminTab>(AdminTab.Users);

    return (
        <OverlayDrawer
            open={open}
            onOpenChange={(_, d) => !d.open && onClose()}
            position="end"
            size="large"
        >
            <DrawerHeader>
                <DrawerHeaderTitle
                    action={
                        <Button
                            appearance="subtle"
                            icon={<DismissRegular />}
                            aria-label={rs.Close}
                            onClick={onClose}
                        />
                    }
                >
                    {rs.AdminPanel}
                </DrawerHeaderTitle>
            </DrawerHeader>

            <DrawerBody className={styles.body}>
                <TabList
                    selectedValue={tab}
                    onTabSelect={(_, d) => setTab(d.value as AdminTab)}
                >
                    <Tab value={AdminTab.Users}>{rs.AdminUsers}</Tab>
                    <Tab value={AdminTab.Feedbacks}>
                        {rs.AdminFeedbacks}
                        {newFeedbackCount > 0 && <CounterBadge count={newFeedbackCount} color="brand" size="small" />}
                    </Tab>
                </TabList>

                <div className={styles.tabContent}>
                    {tab === AdminTab.Users && <AdminUsersTab />}
                    {tab === AdminTab.Feedbacks && <AdminFeedbacksTab />}
                </div>
            </DrawerBody>
        </OverlayDrawer>
    );
};
