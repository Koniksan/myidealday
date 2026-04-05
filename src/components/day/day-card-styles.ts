import { makeStyles, tokens } from "@fluentui/react-components";

export const useDayCardStyles = makeStyles({
    card: {
        display: "flex",
        flexDirection: "column",
        alignItems: "stretch",
        minHeight: "200px",
        borderRadius: "10px",
        background: tokens.colorNeutralBackground2,
        border: `1px solid ${tokens.colorNeutralStroke2}`,
        cursor: "default",
        overflow: "hidden",
        transition: "box-shadow 0.15s, border-color 0.15s",
        ":hover": {
            boxShadow: tokens.shadow4,
            border: `1px solid ${tokens.colorNeutralStroke1}`,
        },
    },
    today: {
        background: tokens.colorBrandBackground,
        border: `1px solid ${tokens.colorBrandBackground}`,
        ":hover": {
            boxShadow: tokens.shadow8,
            border: `1px solid ${tokens.colorBrandBackgroundHover}`,
        },
    },
    weekend: {
        background: tokens.colorNeutralBackground3,
    },
    progressTrack: {
        width: "100%",
        height: "5px",
        background: tokens.colorNeutralStroke2,
        flexShrink: 0,
    },
    progressFill: {
        height: "100%",
        background: tokens.colorPaletteGreenForeground1,
        transition: "width 0.3s ease",
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
    dayNameToday: {
        color: tokens.colorNeutralForegroundOnBrand,
    },
    dayNumber: {
        fontSize: "20px",
        fontWeight: "600",
        color: tokens.colorNeutralForeground1,
        lineHeight: 1,
    },
    dayNumberToday: {
        color: tokens.colorNeutralForegroundOnBrand,
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
        paddingTop: "6px",
        background: "none",
        border: "none",
        cursor: "pointer",
        color: tokens.colorNeutralForeground3,
        fontSize: "11px",
        textAlign: "left",
        padding: "4px 2px",
        ":hover": {
            color: tokens.colorNeutralForeground1,
        },
    },
});
