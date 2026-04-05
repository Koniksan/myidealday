import React from "react";
import { DayCardList, PageLayout } from "../../components";
import { useUserPageStyles } from "./user-page-styles";

export const UserPage: React.FC = () => {
    const styles = useUserPageStyles();

    return (
        <PageLayout>
            <div className={styles.root}>
                <DayCardList />
            </div>
        </PageLayout>
    );
};
