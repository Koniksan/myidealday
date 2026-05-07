import { makeStyles, tokens } from "@fluentui/react-components";
import { breakpoints } from "../common";

export const useDayCardMiniStyles = makeStyles({
    card: {
        display: "flex",
        flexDirection: "column",
        padding: "10px",
        borderRadius: "8px",
        minHeight: "110px",
        position: "relative",
        border: `1px solid ${tokens.colorNeutralStroke2}`,
        background: tokens.colorNeutralBackground2,
        cursor: "pointer",
        transition: "border-color 0.15s, box-shadow 0.15s",
        userSelect: "none",
        ":hover": {
            border: `1px solid ${tokens.colorNeutralStroke1}`,
            boxShadow: tokens.shadow4,
        },
        [breakpoints.tablet]: {
           padding: "6px",
        },
    },
    selected: {
        border: `2px solid ${tokens.colorBrandBackground}`,
        ":hover": {
            border: `2px solid ${tokens.colorBrandBackgroundHover}`,
            boxShadow: tokens.shadow8,
        },
    },
    today: {
        border: `2px solid ${tokens.colorBrandBackground}`,
        ":hover": {
            border: `2px solid ${tokens.colorBrandBackgroundHover}`,
        },
    },
    todayDot: {
        position: "absolute",
        bottom: "6px",
        right: "6px",
        width: "6px",
        height: "6px",
        borderRadius: "50%",
        background: tokens.colorBrandBackground,
        pointerEvents: "none",
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
        fontSize: "20px",
        fontWeight: "700",
        color: tokens.colorNeutralForeground1,
        lineHeight: 1,
    },
    todayNumber: {
        background: tokens.colorBrandBackground,
        color: tokens.colorNeutralForegroundOnBrand,
        borderRadius: "50%",
        width: "28px",
        height: "28px",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "14px",
    },
    dots: {
        display: "flex",
        flexWrap: "wrap",
        gap: "5px",
        marginTop: "14px",
    },
    dot: {
        width: "10px",
        height: "10px",
        borderRadius: "50%",
        flexShrink: 0,
        border: `1px solid ${tokens.colorNeutralStroke1}`,
    },
    dotChecked: {
        background: tokens.colorBrandBackground,
        border: `1px solid ${tokens.colorBrandBackground}`,
    },
});
