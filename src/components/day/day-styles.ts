import { makeStyles, tokens } from "@fluentui/react-components";

export const useDayStyles = makeStyles({
    card: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "4px",
        padding: "12px 4px",
        borderRadius: "10px",
        background: tokens.colorNeutralBackground2,
        border: `1px solid ${tokens.colorNeutralStroke2}`,
        cursor: "pointer",
        transition: "box-shadow 0.15s, border-color 0.15s",
        ":hover": {
            boxShadow: tokens.shadow4,
            borderColor: tokens.colorNeutralStroke1,
        },
    },
    today: {
        background: tokens.colorBrandBackground,
        borderColor: tokens.colorBrandBackground,
        ":hover": {
            boxShadow: tokens.shadow8,
            borderColor: tokens.colorBrandBackgroundHover,
        },
    },
    weekend: {
        background: tokens.colorNeutralBackground3,
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
        fontSize: "18px",
        fontWeight: "600",
        color: tokens.colorNeutralForeground1,
        lineHeight: 1,
    },
    dayNumberToday: {
        color: tokens.colorNeutralForegroundOnBrand,
    },
});
