import { makeStyles, tokens } from "@fluentui/react-components";
import { breakpoints } from "../common/styles/breakpoints";

export const useDayCardStyles = makeStyles({
    card: {
        display: "flex",
        flexDirection: "column",
        alignItems: "stretch",
        width: "100%",
        minHeight: "160px",
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
            ":hover": {
                boxShadow: "none",
            },
        },
    },
    today: {
        gridColumn: "span 2",
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
    otherMonth: {
        background: tokens.colorNeutralBackground2,
        border: `1px solid ${tokens.colorNeutralStrokeDisabled}`,
        pointerEvents: "none",
    },
    progressCircle: {
        position: "absolute",
        top: "10px",
        right: "8px",
        width: "46px",
        height: "46px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        pointerEvents: "none",
        animationName: {
            from: { opacity: "0", transform: "scale(0.6)" },
            to: { opacity: "1", transform: "scale(1)" },
        },
        animationDuration: "0.2s",
        animationTimingFunction: "ease-out",
        animationFillMode: "both",
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
    progressCircleFadeOut: {
        animationName: {
            from: { opacity: "1", transform: "scale(1)" },
            to: { opacity: "0", transform: "scale(0.6)" },
        },
        animationDuration: "0.2s",
        animationTimingFunction: "ease-in",
        animationFillMode: "both",
    },
    progressCircleSmall: {
        position: "absolute",
        top: "4px",
        right: "4px",
        width: "26px",
        height: "26px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        pointerEvents: "none",
        animationName: {
            from: { opacity: "0", transform: "scale(0.6)" },
            to: { opacity: "1", transform: "scale(1)" },
        },
        animationDuration: "0.2s",
        animationTimingFunction: "ease-out",
        animationFillMode: "both",
    },
    progressCircleSmallFadeOut: {
        animationName: {
            from: { opacity: "1", transform: "scale(1)" },
            to: { opacity: "0", transform: "scale(0.6)" },
        },
        animationDuration: "0.2s",
        animationTimingFunction: "ease-in",
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
        width: "100%",
        maxWidth: "100%",
        "& .fui-Label": {
            width: "100%",
        }
    },
    checkboxItemLabel: {
        color: tokens.colorNeutralForeground1,
        fontSize: "16px",
    },
    detailCard: {
        gridColumn: "unset",
        minHeight: "unset",
        borderRadius: "12px",
    },
    detailHeader: {
        padding: "40px 20px 8px",
    },
    detailDate: {
        fontSize: "22px",
        fontWeight: "700",
        color: tokens.colorNeutralForeground1,
        lineHeight: "1.2",
        textTransform: "capitalize",
    },
    detailBody: {
        padding: "0 16px 32px 16px",
        gap: "4px",
    },
    detailCheckboxItem: {
        fontSize: "18px",
    },
    addInput: {
        width: "100%",
        fontSize: "16px",
    },
    menuButton: {
        position: "absolute",
        bottom: "6px",
        right: "6px",
    },
    customDivider: {
        marginTop: "4px",
        marginBottom: "2px",
        fontSize: "10px",
        color: tokens.colorNeutralForeground4,
    },
    customTaskRow: {
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        transition: "opacity 0.2s",
        "--delete-btn-opacity": "0",
        ":hover": {
            "--delete-btn-opacity": "1",
        },
        [breakpoints.mobile]: {
            "--delete-btn-opacity": "1",
        },
    },
    customTaskInner: {
        display: "flex",
        alignItems: "center",
        width: "100%",
    },
    customTaskCheckbox: {
        flex: 1,
        fontSize: "12px",
        minWidth: 0,
    },
    deleteTaskButton: {
        flexShrink: 0,
        background: "none",
        border: "none",
        cursor: "pointer",
        padding: "2px",
        display: "flex",
        alignItems: "center",
        color: tokens.colorNeutralForeground3,
        opacity: "var(--delete-btn-opacity)",
        transition: "opacity 0.15s",
    },
    taskRow: {
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        transition: "opacity 0.2s, background 0.1s",
        borderRadius: "4px",
        padding: "2px 0",
        cursor: "pointer",
        ":hover": {
            background: tokens.colorNeutralBackground1Hover,
        },
        [breakpoints.mobile]: {
            cursor: "default",
            ":hover": {
                background: "transparent",
            },
        },
    },
    checkedTaskRow: {
        opacity: "0.45",
    },
    checkedLabel: {
        textDecorationLine: "line-through",
    },
    taskPriorityLine: {
        display: "block",
        width: "24px",
        height: "3px",
        borderRadius: "2px",
        background: "var(--task-color)",
        marginLeft: "35px",
        marginTop: "-3px",
        marginBottom: "2px",
    },
});
