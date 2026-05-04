import { makeStyles, tokens } from "@fluentui/react-components";
import { breakpoints } from "../common/styles/breakpoints";

export const useDayCardStyles = makeStyles({
    card: {
        display: "flex",
        flexDirection: "column",
        alignItems: "stretch",
        width: "100%",
        minHeight: "200px",
        borderRadius: "10px",
        background: tokens.colorNeutralBackground2,
        border: `1px solid ${tokens.colorNeutralStroke2}`,
        cursor: "default",
        overflow: "hidden",
        position: "relative",
        transition: "box-shadow 0.15s, border-color 0.15s",
        "--add-btn-opacity": "0",
        ":hover": {
            boxShadow: tokens.shadow4,
            border: `1px solid ${tokens.colorNeutralStroke1}`,
            "--add-btn-opacity": "1",
        },
        [breakpoints.mobile]: {
            width: "82vw",
            flexShrink: 0,
            minHeight: "340px",
            scrollSnapAlign: "center",
        },
    },
    today: {
        border: `1.5px solid ${tokens.colorBrandBackground}`,
        ":hover": {
            boxShadow: tokens.shadow8,
            border: `1.5px solid ${tokens.colorBrandBackgroundHover}`,
        },
    },
    todayBadge: {
        position: "absolute",
        top: "10px",
        left: "10px",
        padding: "4px 8px",
    },
    weekend: {
        background: tokens.colorNeutralBackground3,
    },
    progressCircle: {
        position: "absolute",
        top: "10px",
        right: "8px",
        pointerEvents: "none",
    },
    completedCircle: {
        transformBox: "fill-box",
        transformOrigin: "center",
        animationName: {
            from: { transform: "scale(0.5)", opacity: "0" },
            to: { transform: "scale(1)", opacity: "1" },
        },
        animationDuration: "0.35s",
        animationTimingFunction: "cubic-bezier(0.34, 1.56, 0.64, 1)",
        animationFillMode: "both",
    },
    header: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "2px",
        padding: "10px 8px 8px",
    },
    dayName: {
        color: tokens.colorNeutralForeground3,
        fontSize: "11px",
        textTransform: "uppercase",
        letterSpacing: "0.04em",
    },
    dayNumber: {
        fontSize: "20px",
        fontWeight: "600",
        color: tokens.colorNeutralForeground1,
        lineHeight: 1,
    },
    body: {
        display: "flex",
        flexDirection: "column",
        flex: 1,
        padding: "0 6px 8px",
        gap: "2px",
    },
    checkboxItem: {
        fontSize: "12px",
    },
    addInput: {
        width: "100%",
    },
    addButton: {
        marginTop: "auto",
        background: "none",
        border: "none",
        cursor: "pointer",
        color: tokens.colorNeutralForeground3,
        fontSize: "11px",
        textAlign: "left",
        padding: "4px 2px",
        opacity: "var(--add-btn-opacity, 0)" as unknown as number,
        transition: "opacity 0.15s, color 0.15s",
        ":hover": {
            color: tokens.colorNeutralForeground1,
        },
    },
    addButtonVisible: {
        opacity: 1,
    },
});
