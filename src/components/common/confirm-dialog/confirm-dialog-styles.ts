import { makeStyles } from "@fluentui/react-components";
import { breakpoints } from "../styles/breakpoints";

export const useConfirmDialogStyles = makeStyles({
    surface: {
        [breakpoints.mobile]: {
            width: "calc(100% - 64px)",
            maxWidth: "none",
            margin: "auto 32px 25vh",
            boxSizing: "border-box",
        },
    },
    actions: {
        "& > button": {
            whiteSpace: "nowrap",
            flexShrink: 0,
        },
    },
});
