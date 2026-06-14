import { makeStyles, tokens } from "@fluentui/react-components";
import { breakpoints } from "../styles";

export const useStyles = makeStyles({
    wrapper: {
        display: "flex",
        width: "100%",
        height: "100dvh",
        overflow: "hidden",
        background: tokens.colorNeutralBackground3,
    },
    root: {
        maxWidth: "1400px",
        margin: "0 auto",
        display: "flex",
        flexDirection: "column",
        fontFamily: 'Segoe UI, -apple-system, BlinkMacSystemFont, "Helvetica Neue", Arial, sans-serif',
        width: "100%",
        height: "100%",
        minHeight: 0,
        boxSizing: "border-box",
        overflow: "hidden",
    },
    content: {
        flex: 1,
        minHeight: 0,
        overflow: "auto",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "32px",
        boxSizing: "border-box",
        [breakpoints.mobile]: {
            padding: "16px 0",
        },
    },
    centered: {
        justifyContent: "center",
    },
});
