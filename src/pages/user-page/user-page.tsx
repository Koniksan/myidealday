import React from "react";
import { DayList, PageLayout } from "../../components";
import { useUserPageStyles } from "./user-page-styles";

export const UserPage: React.FC = () => {
    const styles = useUserPageStyles();

    return (
        <PageLayout>
            <div className={styles.root}>
                <DayList />
            </div>
        </PageLayout>
    );
};
