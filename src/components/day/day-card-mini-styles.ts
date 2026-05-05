import { makeStyles, tokens } from "@fluentui/react-components";

export const useDayCardMiniStyles = makeStyles({
    card: {
        display: "flex",
        flexDirection: "column",
        padding: "8px",
        borderRadius: "8px",
        border: `1px solid ${tokens.colorNeutralStroke2}`,
        background: tokens.colorNeutralBackground2,
        cursor: "pointer",
        transition: "border-color 0.15s, box-shadow 0.15s",
        userSelect: "none",
        ":hover": {
            border: `1px solid ${tokens.colorNeutralStroke1}`,
            boxShadow: tokens.shadow4,
        },
    },
    selected: {
        border: `2px solid ${tokens.colorBrandBackground}`,
        ":hover": {
            border: `2px solid ${tokens.colorBrandBackgroundHover}`,
            boxShadow: tokens.shadow8,
        },
    },
    weekend: {
        background: tokens.colorNeutralBackground3,
    },
    otherMonth: {
        background: tokens.colorNeutralBackgroundDisabled,
        border: `1px solid ${tokens.colorNeutralStrokeDisabled}`,
        cursor: "default",
        pointerEvents: "none",
        ":hover": {
            border: `1px solid ${tokens.colorNeutralStrokeDisabled}`,
            boxShadow: "none",
        },
    },
    dayName: {
        fontSize: "10px",
        fontWeight: "600",
        textTransform: "uppercase",
        letterSpacing: "0.04em",
        color: tokens.colorNeutralForeground3,
        lineHeight: 1,
        marginBottom: "2px",
    },
    dayNameSelected: {
        color: tokens.colorBrandForeground1,
    },
    dayNumber: {
        fontSize: "18px",
        fontWeight: "700",
        color: tokens.colorNeutralForeground1,
        lineHeight: 1,
    },
    dots: {
        display: "flex",
        flexWrap: "wrap",
        gap: "3px",
        marginTop: "6px",
    },
    dot: {
        width: "6px",
        height: "6px",
        borderRadius: "50%",
        flexShrink: 0,
        border: `1px solid ${tokens.colorNeutralStroke1}`,
    },
    dotChecked: {
        background: tokens.colorBrandBackground,
        border: `1px solid ${tokens.colorBrandBackground}`,
    },
});
