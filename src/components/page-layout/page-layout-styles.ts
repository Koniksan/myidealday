import { makeStyles, tokens } from "@fluentui/react-components";
import { breakpoints } from "../../styles/breakpoints";

export const useStyles = makeStyles({
    root: {
        minHeight: "100dvh",
        background: tokens.colorNeutralBackground1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        paddingTop: "56px",
        fontFamily: 'Segoe UI, -apple-system, BlinkMacSystemFont, "Helvetica Neue", Arial, sans-serif',
        [breakpoints.mobile]: {
            paddingTop: "32px",
        },
    },
    centered: {
        justifyContent: "center",
    },
});
