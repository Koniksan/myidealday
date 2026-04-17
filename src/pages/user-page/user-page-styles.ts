import { makeStyles } from "@fluentui/react-components";
import { breakpoints } from "../../styles/breakpoints";

export const useUserPageStyles = makeStyles({
    root: {
        width: "100%",
        maxWidth: "900px",
        padding: "32px 24px 48px",
        boxSizing: "border-box",
        [breakpoints.mobile]: {
            padding: "24px 0 32px",
            maxWidth: "100%",
        },
    },
});
