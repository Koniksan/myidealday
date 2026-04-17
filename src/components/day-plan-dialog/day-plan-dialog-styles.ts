import { makeStyles } from "@fluentui/react-components";
import { breakpoints } from "../../styles/breakpoints";

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
    tagGroup: {
        flexWrap: "wrap",
        gap: "6px",
    },
});
