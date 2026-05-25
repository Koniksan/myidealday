import { makeStyles, tokens } from "@fluentui/react-components";

export const useAdminStyles = makeStyles({
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
    tabBadge: {
        position: "absolute",
        top: "4px",
        right: "0px",
    },
    // kanban board
    kanbanBoard: {
        display: "flex",
        gap: "12px",
    },
    feedbackTabToolbar: {
        display: "flex",
        justifyContent: "flex-end",
        paddingBottom: "4px",
    },
});
