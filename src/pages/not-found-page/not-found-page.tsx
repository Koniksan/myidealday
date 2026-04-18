import React from "react";
import { Button, Title1, Body1 } from "@fluentui/react-components";
import { useNavigate } from "react-router-dom";
import { makeStyles } from "@fluentui/react-components";
import { PageLayout } from "../../components";

const useStyles = makeStyles({
    content: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "12px",
        textAlign: "center",
    },
});

export const NotFoundPage: React.FC = () => {
    const navigate = useNavigate();
    const styles = useStyles();

    return (
        <PageLayout centered>
            <div className={styles.content}>
                <Title1>404</Title1>
                <Body1>Page not found</Body1>
                <Button appearance="primary" onClick={() => navigate("/")}>Go home</Button>
            </div>
        </PageLayout>
    );
};
