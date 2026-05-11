import { makeStyles, tokens } from "@fluentui/react-components";

export const usePageShellStyles = makeStyles({
    root: {
        width: "100%",
        maxWidth: "480px",
        margin: "0 auto",
        padding: "0px 16px 32px",
        paddingBottom: "calc(64px + env(safe-area-inset-bottom) + 24px)",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        gap: "24px",
    },
    backButton: {
        display: "inline-flex",
        alignItems: "center",
        gap: "4px",
        background: "none",
        border: "none",
        cursor: "pointer",
        padding: "6px 4px",
        color: tokens.colorBrandForeground1,
        fontSize: "14px",
        borderRadius: tokens.borderRadiusMedium,
        ":hover": {
            background: tokens.colorNeutralBackground1Hover,
        },
    },
    sectionLabel: {
        fontSize: "12px",
        fontWeight: 600,
        textTransform: "uppercase",
        letterSpacing: "0.06em",
        color: tokens.colorNeutralForeground3,
        paddingLeft: "4px",
        marginBottom: "-16px",
    },
    card: {
        display: "flex",
        flexDirection: "column",
        borderRadius: "12px",
        border: `1px solid ${tokens.colorNeutralStroke2}`,
        overflow: "hidden",
        background: tokens.colorNeutralBackground1,
    },
    row: {
        display: "flex",
        alignItems: "center",
        gap: "12px",
        padding: "14px 16px",
        background: "none",
        border: "none",
        borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
        cursor: "pointer",
        textAlign: "left",
        color: tokens.colorNeutralForeground1,
        ":last-child": {
            borderBottom: "none",
        },
        ":hover": {
            background: tokens.colorNeutralBackground1Hover,
        },
        ":active": {
            background: tokens.colorNeutralBackground1Pressed,
        },
    },
    rowLabel: {
        flex: 1,
        fontSize: "15px",
    },
});
