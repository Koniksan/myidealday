import { makeStyles, tokens } from "@fluentui/react-components";

export const useStyles = makeStyles({
    root: {
        minHeight: "100vh",
        background: tokens.colorNeutralBackground1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        paddingTop: "56px",
        fontFamily: 'Segoe UI, -apple-system, BlinkMacSystemFont, "Helvetica Neue", Arial, sans-serif',
    },
    centered: {
        justifyContent: "center",
    },
});
