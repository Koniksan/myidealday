import { makeStyles, tokens } from "@fluentui/react-components";
import { breakpoints } from "../common/styles/breakpoints";

export const useUserLogoStyles = makeStyles({
    avatarButton: {
        padding: 0,
        minWidth: "unset",
        height: "unset",
        border: "none",
        background: "none",
        cursor: "pointer",
        borderRadius: "50%",
        ":focus-visible": {
            outline: `2px solid ${tokens.colorBrandForeground1}`,
            outlineOffset: "2px",
        },
    },
    avatarWrapper: {
        position: "relative",
        display: "inline-flex",
    },
    avatarBadge: {
        position: "absolute",
        top: "-4px",
        right: "-4px",
        pointerEvents: "none",
    },
    adminButtonWrapper: {
        position: "relative",
        display: "inline-flex",
        alignItems: "center",
        [breakpoints.mobile]: {
            display: "none",
        },
    },
    adminButtonBadge: {
        position: "absolute",
        top: "-4px",
        right: "-4px",
        pointerEvents: "none",
    },
    menuItemContent: {
        display: "flex",
        alignItems: "center",
        gap: "8px",
        width: "100%",
    },
    menuItemBadge: {
        marginLeft: "auto",
    },
});
