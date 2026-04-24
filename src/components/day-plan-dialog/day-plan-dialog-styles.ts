import { makeStyles, tokens } from "@fluentui/react-components";
import { breakpoints } from "../common/styles/breakpoints";

export const useDayPlanDialogStyles = makeStyles({
    surface: {
        [breakpoints.mobile]: {
            width: "calc(100% - 32px)",
            maxWidth: "none",
            margin: "auto 16px 25vh",
            padding: "20px 16px 24px",
            boxSizing: "border-box",
        },
    },
    inputRow: {
        display: "flex",
        gap: "8px",
        alignItems: "center",
        marginBottom: "12px",
    },
    input: {
        flex: 1,
        fontSize: "16px",
    },
    actions: {
        [breakpoints.mobile]: {
            display: "flex",
            flexDirection: "column-reverse",
            gap: "8px",
            "& > button": {
                width: "100%",
                justifyContent: "center",
            },
        },
    },
    confirmSurface: {
        [breakpoints.mobile]: {
            width: "calc(100% - 64px)",
            maxWidth: "none",
            margin: "auto 32px 25vh",
            boxSizing: "border-box",
        },
    },
    list: {
        display: "flex",
        flexDirection: "column",
        gap: "4px",
    },
    listItem: {
        display: "flex",
        alignItems: "center",
        gap: "8px",
        padding: "6px 8px",
        borderRadius: "6px",
        background: tokens.colorNeutralBackground3,
        cursor: "grab",
        ":active": { cursor: "grabbing" },
    },
    dragHandle: {
        display: "flex",
        alignItems: "center",
        color: "var(--colorNeutralForeground3)",
        flexShrink: 0,
    },
    listItemLabel: {
        flex: 1,
        fontSize: "14px",
    },
});
