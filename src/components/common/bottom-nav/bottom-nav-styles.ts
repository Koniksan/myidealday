import { makeStyles, tokens } from "@fluentui/react-components";
import { breakpoints } from "../styles";

export const useBottomNavStyles = makeStyles({
    root: {
        display: "none",
        [breakpoints.mobile]: {
            position: "fixed",
            bottom: 0,
            left: 0,
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-around",
            paddingBottom: "env(safe-area-inset-bottom)",
            height: "calc(64px + env(safe-area-inset-bottom))",
            borderTop: `1px solid ${tokens.colorNeutralStroke2}`,
            background: tokens.colorNeutralBackground1,
            boxSizing: "border-box",
            zIndex: 100,
        },
    },
    navButton: {
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "3px",
        background: "none",
        border: "none",
        cursor: "pointer",
        padding: "6px 4px",
        color: tokens.colorNeutralForeground3,
        borderRadius: tokens.borderRadiusMedium,
        transition: "color 0.15s",
        ":hover": {
            background: tokens.colorNeutralBackground1Hover,
            color: tokens.colorNeutralForeground2,
        },
        ":active": {
            background: tokens.colorNeutralBackground1Pressed,
        },
    },
    navButtonActive: {
        color: tokens.colorBrandForeground1,
        ":hover": {
            color: tokens.colorBrandForeground1,
        },
    },
    navLabel: {
        fontSize: "10px",
        fontWeight: "500",
        lineHeight: "1",
        whiteSpace: "nowrap",
    },
    iconWrapper: {
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    },
    badge: {
        position: "absolute",
        top: "-4px",
        right: "-8px",
        pointerEvents: "none",
    },
});
