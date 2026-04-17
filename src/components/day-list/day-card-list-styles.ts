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
});
