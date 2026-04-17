import { makeStyles } from "@fluentui/react-components";
import { breakpoints } from "../../styles/breakpoints";

export const useDayCardListStyles = makeStyles({
    header: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: "24px",
        [breakpoints.mobile]: {
            padding: "0 20px",
        },
    },
    grid: {
        display: "flex",
        flexWrap: "wrap",
        gap: "12px",
        justifyContent: "center",
        [breakpoints.mobile]: {
            flexWrap: "nowrap",
            overflowX: "auto",
            scrollSnapType: "x mandatory",
            justifyContent: "flex-start",
            padding: "4px 20px 16px",
            scrollbarWidth: "none",
            msOverflowStyle: "none",
            "::-webkit-scrollbar": { display: "none" },
        },
    },
    dialogSurface: {
        [breakpoints.mobile]: {
            width: "calc(100% - 32px)",
            maxWidth: "none",
            margin: "0 16px",
            padding: "20px 16px 24px",
            boxSizing: "border-box",
        },
    },
    dialogInputRow: {
        display: "flex",
        gap: "8px",
        alignItems: "center",
        marginBottom: "12px",
    },
    dialogInput: {
        flex: 1,
        fontSize: "16px",
    },
    dialogActions: {
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
    tagGroup: {
        flexWrap: "wrap",
        gap: "6px",
    },
});
