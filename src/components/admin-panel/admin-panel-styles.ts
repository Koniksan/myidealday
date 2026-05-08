import { makeStyles, tokens } from "@fluentui/react-components";

export const useAdminPanelStyles = makeStyles({
    body: {
        display: "flex",
        flexDirection: "column",
        gap: "16px",
        paddingTop: "8px",
        paddingBottom: "8px",
        overflow: "hidden",
    },
    tabContent: {
        display: "flex",
        flexDirection: "column",
        gap: "8px",
        overflowY: "auto",
        flex: 1,
    },
    center: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "48px 0",
    },
    emptyState: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "8px",
        padding: "48px 0",
        color: tokens.colorNeutralForeground3,
    },
    // user item
    userItem: {
        display: "flex",
        alignItems: "center",
        gap: "12px",
        padding: "10px 12px",
        borderRadius: tokens.borderRadiusMedium,
        background: tokens.colorNeutralBackground2,
        border: `1px solid ${tokens.colorNeutralStroke2}`,
    },
    userInfo: {
        display: "flex",
        flexDirection: "column",
        gap: "2px",
        overflow: "hidden",
    },
    userName: {
        fontSize: tokens.fontSizeBase300,
        fontWeight: tokens.fontWeightSemibold,
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
    },
    userId: {
        fontSize: tokens.fontSizeBase100,
        color: tokens.colorNeutralForeground3,
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
    },
    dataGridWrapper: {
        overflowX: "auto",
    },
    dataGrid: {
        minWidth: "1000px",
    },
    userGridRow: {
        padding: '10px 0',
    },
    // feedback item
    feedbackItem: {
        display: "flex",
        flexDirection: "column",
        gap: "6px",
        padding: "12px",
        borderRadius: tokens.borderRadiusMedium,
        background: tokens.colorNeutralBackground2,
        border: `1px solid ${tokens.colorNeutralStroke2}`,
        cursor: "pointer",
        "&:hover": {
            background: tokens.colorNeutralBackground2Hover,
            border: `1px solid ${tokens.colorNeutralStroke1Hover}`,
        },
    },
    feedbackMeta: {
        display: "flex",
        alignItems: "center",
        gap: "8px",
        flexWrap: "wrap",
    },
    feedbackEmail: {
        fontSize: tokens.fontSizeBase200,
        fontWeight: tokens.fontWeightSemibold,
        color: tokens.colorNeutralForeground1,
    },
    feedbackDate: {
        fontSize: tokens.fontSizeBase200,
        color: tokens.colorNeutralForeground3,
        marginLeft: "auto",
    },
    feedbackMessage: {
        fontSize: tokens.fontSizeBase300,
        color: tokens.colorNeutralForeground1,
    },
    feedbackAnswer: {
        display: "flex",
        flexDirection: "column",
        gap: "4px",
        padding: "8px 10px",
        borderRadius: tokens.borderRadiusSmall,
        background: tokens.colorBrandBackground2,
        borderLeft: `3px solid ${tokens.colorBrandForeground1}`,
    },
    feedbackAnswerLabel: {
        fontSize: tokens.fontSizeBase100,
        fontWeight: tokens.fontWeightSemibold,
        color: tokens.colorBrandForeground1,
        textTransform: "uppercase",
        letterSpacing: "0.04em",
    },
    feedbackPanelBody: {
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        paddingBottom: "24px",
    },
    feedbackDialogMessage: {
        padding: "10px 12px",
        borderRadius: tokens.borderRadiusMedium,
        background: tokens.colorNeutralBackground3,
        fontSize: tokens.fontSizeBase300,
        color: tokens.colorNeutralForeground2,
        whiteSpace: "pre-wrap",
    },
});
