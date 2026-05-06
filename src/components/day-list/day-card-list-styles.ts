import { makeStyles, tokens } from "@fluentui/react-components";
import { breakpoints } from "../common/styles/breakpoints";

export const useDayCardListStyles = makeStyles({
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
    fab: {
        position: "fixed",
        bottom: "32px",
        right: "32px",
        boxShadow: tokens.shadow16,
    },
    grid: {
        display: "grid",
        gridTemplateColumns: "repeat(7, 1fr)",
        gap: "8px",
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
    weekDayHeader: {
        textAlign: "center",
        fontSize: "11px",
        fontWeight: "600",
        color: tokens.colorNeutralForeground3,
        textTransform: "uppercase",
        letterSpacing: "0.05em",
        padding: "4px 0 8px",
        [breakpoints.mobile]: {
            display: "none",
        },
    },
    desktopLayout: {
        display: "block",
        [breakpoints.mobile]: {
            display: "none",
        },
    },
    desktopColumns: {
        display: "flex",
        gap: "24px",
        alignItems: "center",
    },
    calendarSide: {
        flex: "0 0 65%",
        width: "65%",
    },
    detailSide: {
        flex: 1,
        position: "sticky",
        top: "calc(56px + env(safe-area-inset-top) + 16px)",
    },
    mobileLayout: {
        display: "none",
        [breakpoints.mobile]: {
            display: "block",
        },
    },
    mobileGrid: {
        display: "flex",
        flexWrap: "nowrap",
        overflowX: "auto",
        scrollSnapType: "x mandatory",
        justifyContent: "flex-start",
        padding: "4px 20px 16px",
        scrollbarWidth: "none",
        msOverflowStyle: "none",
        gap: "12px",
        "::-webkit-scrollbar": { display: "none" },
    },
});
