import { makeStyles, tokens } from "@fluentui/react-components";

export const useHeaderStyles = makeStyles({
    root: {
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 16px",
        paddingTop: "env(safe-area-inset-top)",
        height: "calc(44px + env(safe-area-inset-top))",
        borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
        background: tokens.colorNeutralBackground1,
        boxSizing: "border-box",
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: 100,
    },
    brand: {
        display: "flex",
        alignItems: "center",
        gap: "8px",
    },
    title: {
        fontWeight: 600,
        fontSize: "16px",
        color: tokens.colorNeutralForeground1,
    },
    actions: {
        display: "flex",
        alignItems: "center",
        gap: "4px",
    },
    divider: {
        flexGrow: 0,
        height: "20px",
        margin: "0 4px",
    },
});
