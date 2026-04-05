import { makeStyles, tokens } from "@fluentui/react-components";

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
});
