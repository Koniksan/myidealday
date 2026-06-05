import { makeStyles, tokens } from "@fluentui/react-components";
import { breakpoints } from "../common/styles";

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
        width: "100%",
        [breakpoints.mobile]: {
            paddingLeft: "16px",
            paddingRight: "16px",
        },
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
    // user list
    usersTabContainer: {
        minWidth: "360px",
        paddingTop: "12px",
        width: "100%",
    },
    searchBar: {
        marginBottom: "12px",
        width: "300px",
    },
    userList: {
        display: "flex",
        flexDirection: "column",
        gap: "4px",
    },
    userListRow: {
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        alignItems: "center",
        padding: "10px 12px",
        borderRadius: tokens.borderRadiusMedium,
        cursor: "pointer",
        ":hover": {
            backgroundColor: tokens.colorNeutralBackground2Hover,
        },
    },
    userListCol1: {
        display: "flex",
        alignItems: "center",
        gap: "10px",
        overflow: "hidden",
    },
    userListCol2: {
        textAlign: "right",
        flexShrink: 0,
        color: tokens.colorNeutralForeground3,
        fontSize: tokens.fontSizeBase200,
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
    },
    userListSubtitle: {
        fontSize: tokens.fontSizeBase100,
        color: tokens.colorNeutralForeground3,
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
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
