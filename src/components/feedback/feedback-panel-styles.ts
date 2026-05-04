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
    item: {
        display: "flex",
        flexDirection: "column",
        gap: "6px",
        padding: "12px",
        borderRadius: tokens.borderRadiusMedium,
        background: tokens.colorNeutralBackground2,
        border: `1px solid ${tokens.colorNeutralStroke2}`,
    },
    itemHeader: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
    },
    itemMeta: {
        display: "flex",
        alignItems: "center",
        gap: "8px",
    },
    itemDate: {
        fontSize: tokens.fontSizeBase200,
        color: tokens.colorNeutralForeground3,
    },
    itemMessage: {
        display: "-webkit-box",
        WebkitLineClamp: "3",
        WebkitBoxOrient: "vertical",
        overflow: "hidden",
    },
    textarea: {
        width: "100%",
        minHeight: "120px",
    },
});
