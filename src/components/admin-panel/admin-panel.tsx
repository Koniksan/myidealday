import {
    Button,
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
import { useAdminPanelStyles } from "./admin-panel-styles";
import { AdminFeedbacksTab } from "./admin-feedbacks-tab";
import { AdminUsersTab } from "./admin-users-tab";


enum AdminPanelTab {
    Users = "users",
    Feedbacks = "feedbacks",
}

interface AdminPanelProps {
    open: boolean;
    onClose: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ open, onClose }) => {
    const styles = useAdminPanelStyles();
    const rs = useLocalization();
    const [tab, setTab] = useState<AdminPanelTab>(AdminPanelTab.Users);

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
                    onTabSelect={(_, d) => setTab(d.value as AdminPanelTab)}
                >
                    <Tab value={AdminPanelTab.Users}>{rs.AdminUsers}</Tab>
                    <Tab value={AdminPanelTab.Feedbacks}>{rs.AdminFeedbacks}</Tab>
                </TabList>

                <div className={styles.tabContent}>
                    {tab === AdminPanelTab.Users && <AdminUsersTab />}
                    {tab === AdminPanelTab.Feedbacks && <AdminFeedbacksTab />}
                </div>
            </DrawerBody>
        </OverlayDrawer>
    );
};
