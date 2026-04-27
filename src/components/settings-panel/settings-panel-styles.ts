import { makeStyles, tokens } from "@fluentui/react-components";
import { breakpoints } from "../common/styles/breakpoints";

export const useSettingsPanelStyles = makeStyles({
    body: {
        display: "flex",
        flexDirection: "column",
        gap: "24px",
        paddingTop: "8px",
    },
    avatarRow: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "12px",
    },
    avatarButtons: {
        display: "flex",
        gap: "8px",
        flexWrap: "wrap",
        justifyContent: "center",
    },
    hiddenInput: {
        display: "none",
    },
    field: {
        display: "flex",
        flexDirection: "column",
        gap: "6px",
    },
    label: {
        fontSize: "14px",
        fontWeight: 600,
        color: tokens.colorNeutralForeground1,
    },
    input: {
        fontSize: "16px",
        width: "100%",
    },
    error: {
        color: tokens.colorPaletteRedForeground1,
        fontSize: "13px",
    },
    footer: {
        gap: "8px",
        justifyContent: "flex-end",
        [breakpoints.mobile]: {
            flexDirection: "column-reverse",
            "& > button": {
                width: "100%",
                justifyContent: "center",
            },
        },
    },
});
