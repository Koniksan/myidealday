import { makeStyles, tokens } from "@fluentui/react-components";
import { breakpoints } from "../styles";

export const useStyles = makeStyles({
    root: {
        maxWidth: "1400px",
        minHeight: "100dvh",
        background: tokens.colorNeutralBackground1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        paddingTop: "calc(56px + env(safe-area-inset-top))",
        fontFamily: 'Segoe UI, -apple-system, BlinkMacSystemFont, "Helvetica Neue", Arial, sans-serif',
        width: "100%",
        padding: "80px 32px 48px",
        boxSizing: "border-box",
        overflow: "auto",
        [breakpoints.mobile]: {
            maxWidth: "100%",
            paddingTop: "calc(56px + env(safe-area-inset-top))",
            paddingLeft: "0px",
            paddingRight: "0px",
            paddingBottom: "calc(56px + env(safe-area-inset-bottom))",
        },
    },
    centered: {
        justifyContent: "center",
    },
});
