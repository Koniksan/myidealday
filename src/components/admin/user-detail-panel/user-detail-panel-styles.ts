import { makeStyles, tokens } from "@fluentui/react-components";

export const useUserDetailPanelStyles = makeStyles({
    body: {
        display: "flex",
        flexDirection: "column",
        gap: "20px",
        padding: "16px 0",
    },
    avatarSection: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "8px",
        paddingBottom: "8px",
    },
    displayName: {
        fontSize: tokens.fontSizeBase400,
        fontWeight: tokens.fontWeightSemibold,
        textAlign: "center",
    },
    emailSubtitle: {
        fontSize: tokens.fontSizeBase200,
        color: tokens.colorNeutralForeground3,
        textAlign: "center",
    },
    fieldList: {
        display: "flex",
        flexDirection: "column",
        gap: "12px",
    },
    fieldRow: {
        display: "flex",
        flexDirection: "column",
        gap: "2px",
    },
    fieldLabel: {
        fontSize: tokens.fontSizeBase100,
        color: tokens.colorNeutralForeground3,
        fontWeight: tokens.fontWeightSemibold,
        textTransform: "uppercase",
        letterSpacing: "0.05em",
    },
    fieldValue: {
        fontSize: tokens.fontSizeBase300,
    },
});
