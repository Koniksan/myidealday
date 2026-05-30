import { makeStyles, tokens } from "@fluentui/react-components";

export const useKanbanCardStyles = makeStyles({
    kanbanCard: {
        display: "flex",
        flexDirection: "column",
        gap: "8px",
        padding: "12px",
        borderRadius: tokens.borderRadiusMedium,
        background: tokens.colorNeutralBackground1,
        border: `1px solid ${tokens.colorNeutralStroke2}`,
        cursor: "grab",
        userSelect: "none",
        ":hover": {
            background: tokens.colorNeutralBackground1Hover,
            border: `1px solid ${tokens.colorNeutralStroke1Hover}`,
        },
        ":active": {
            background: tokens.colorNeutralBackground1Pressed,
        },
    },
    kanbanCardNew: {
        border: `1px solid ${tokens.colorBrandBackground}`,
    },
    kanbanNewBadge: {
        alignSelf: "flex-start",
        fontSize: tokens.fontSizeBase100,
        fontWeight: tokens.fontWeightSemibold,
        borderRadius: tokens.borderRadiusMedium,
        padding: "2px 8px",
        color: tokens.colorNeutralForegroundOnBrand,
        background: tokens.colorBrandBackground,
    },
    kanbanCardHeader: {
        display: "flex",
        alignItems: "center",
        gap: "6px",
        flexWrap: "wrap",
    },
    kanbanCardMessage: {
        fontSize: tokens.fontSizeBase300,
        fontWeight: tokens.fontWeightSemibold,
        color: tokens.colorNeutralForeground1,
        display: "-webkit-box",
        WebkitLineClamp: "2",
        WebkitBoxOrient: "vertical",
        overflow: "hidden",
        lineHeight: "1.4",
    },
    kanbanCardFooter: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "6px",
    },
    kanbanCardSource: {
        display: "flex",
        alignItems: "center",
        gap: "4px",
        fontSize: tokens.fontSizeBase100,
        color: tokens.colorNeutralForeground3,
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
    },
    kanbanCardSourceIcon: {
        fontSize: "12px",
        flexShrink: 0,
    },
    kanbanCardAvatar: {
        width: "16px",
        height: "16px",
        borderRadius: tokens.borderRadiusCircular,
        objectFit: "cover",
        flexShrink: 0,
    },
    kanbanCardDate: {
        flexShrink: 0,
        fontSize: tokens.fontSizeBase100,
        color: tokens.colorNeutralForeground3,
        whiteSpace: "nowrap",
    },
});
