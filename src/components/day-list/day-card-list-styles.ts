import { makeStyles } from "@fluentui/react-components";
import { breakpoints } from "../common/styles/breakpoints";

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
    actions: {
        display: "flex",
        alignItems: "center",
        gap: "8px",
        flexShrink: 0,
        "& > button": {
            whiteSpace: "nowrap",
            flexShrink: 0,
        },
    },
    grid: {
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: "12px",
        [breakpoints.mobile]: {
            display: "flex",
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
});
