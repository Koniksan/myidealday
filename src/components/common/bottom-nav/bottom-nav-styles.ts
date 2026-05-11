import { makeStyles, tokens } from "@fluentui/react-components";
import { breakpoints } from "../styles";

export const useBottomNavStyles = makeStyles({
    root: {
        display: "none",
        [breakpoints.mobile]: {
            position: "fixed",
            bottom: 0,
            left: 0,
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-around",
            paddingBottom: "env(safe-area-inset-bottom)",
            height: "calc(56px + env(safe-area-inset-bottom))",
            borderTop: `1px solid ${tokens.colorNeutralStroke2}`,
            background: tokens.colorNeutralBackground1,
            boxSizing: "border-box",
            zIndex: 100,
        },
    },
});
