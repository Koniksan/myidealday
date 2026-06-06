import { makeStyles, tokens } from "@fluentui/react-components";
import { breakpoints } from "../styles";

export const useStyles = makeStyles({
    wrapper: {
        width: "100%",
        minHeight: "100dvh",
        background: tokens.colorNeutralBackground3,
    },
    root: {
        maxWidth: "1400px",
        margin: "0 auto",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        fontFamily: 'Segoe UI, -apple-system, BlinkMacSystemFont, "Helvetica Neue", Arial, sans-serif',
        width: "100%",
        padding: "80px 32px 48px",
        boxSizing: "border-box",
        overflow: "auto",
        [breakpoints.mobile]: {
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
