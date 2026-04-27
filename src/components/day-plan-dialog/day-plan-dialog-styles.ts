import { makeStyles, tokens } from "@fluentui/react-components";
import { breakpoints } from "../common/styles/breakpoints";

export const useDayPlanDialogStyles = makeStyles({
    body: {
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        paddingTop: "8px",
        paddingBottom: "8px",
    },
    inputRow: {
        display: "flex",
        gap: "8px",
        alignItems: "center",
    },
    input: {
        flex: 1,
        fontSize: "16px",
    },
    footer: {
        gap: "8px",
        justifyContent: "flex-end",
        "& > button": {
            whiteSpace: "nowrap",
            flexShrink: 0,
        },
    },
    resetButton: {
        marginRight: "auto",
        color: tokens.colorPaletteRedForeground1,
        ":hover": {
            color: tokens.colorPaletteRedForeground1,
            background: tokens.colorPaletteRedBackground1,
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
    confirmActions: {
        "& > button": {
            whiteSpace: "nowrap",
            flexShrink: 0,
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
