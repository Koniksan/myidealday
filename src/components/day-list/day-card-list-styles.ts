import { makeStyles, tokens } from "@fluentui/react-components";
import { breakpoints } from "../common/styles/breakpoints";

export const useDayCardListStyles = makeStyles({
    header: {
        display: "flex",
        alignItems: "center",
        marginBottom: "24px",
        [breakpoints.mobile]: {
            padding: "0 20px",
        },
    },
    monthNav: {
        position: "sticky",
        top: "calc(56px + env(safe-area-inset-top) + 8px)",
        zIndex: 10,
        display: "flex",
        justifyContent: "center",
        pointerEvents: "none",
        marginBottom: "16px",
    },
    monthNavAction: {
        borderRadius: tokens.borderRadiusCircular,
    },
    monthNavPill: {
        display: "flex",
        alignItems: "center",
        gap: "4px",
        padding: "4px",
        background: tokens.colorNeutralBackground1,
        borderRadius: tokens.borderRadiusCircular,
        boxShadow: tokens.shadow16,
        border: `1px solid ${tokens.colorNeutralStroke2}`,
        pointerEvents: "all",
    },
    actions: {
        display: "flex",
        alignItems: "center",
        gap: "8px",
        marginLeft: "auto",
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
