import { makeStyles, tokens } from "@fluentui/react-components";
import { breakpoints } from "../styles";

export const useStyles = makeStyles({
    root: {
        minHeight: "100dvh",
        background: tokens.colorNeutralBackground1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        paddingTop: "calc(56px + env(safe-area-inset-top))",
        fontFamily: 'Segoe UI, -apple-system, BlinkMacSystemFont, "Helvetica Neue", Arial, sans-serif',
        [breakpoints.mobile]: {
            paddingTop: "calc(56px + env(safe-area-inset-top))",
        },
    },
    centered: {
        justifyContent: "center",
    },
});
