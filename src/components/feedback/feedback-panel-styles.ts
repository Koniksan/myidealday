import { makeStyles, tokens } from "@fluentui/react-components";

export const useFeedbackPanelStyles = makeStyles({
    body: {
        display: "flex",
        flexDirection: "column",
        gap: "16px",
        overflowY: "auto",
    },
    center: {
        display: "flex",
        justifyContent: "center",
        padding: "32px 0",
    },
    emptyState: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "8px",
        padding: "40px 0",
        color: tokens.colorNeutralForeground3,
    },
    list: {
        display: "flex",
        flexDirection: "column",
        gap: "8px",
    },
    composeBody: {
        display: "flex",
        flexDirection: "column",
        gap: "16px",
    },
    textarea: {
        width: "100%",
        minHeight: "160px",
        fontSize: "16px",
    },
});
