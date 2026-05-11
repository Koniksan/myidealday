import { makeStyles, tokens } from "@fluentui/react-components";

export const useAccountPageStyles = makeStyles({
    avatarSection: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "8px",
        paddingTop: "8px",
    },
    displayName: {
        fontSize: "18px",
        fontWeight: "600",
        color: tokens.colorNeutralForeground1,
    },
    email: {
        fontSize: "13px",
        color: tokens.colorNeutralForeground3,
    },
    rowIcon: {
        fontSize: "20px",
        color: tokens.colorBrandForeground1,
        flexShrink: 0,
    },
    rowChevron: {
        fontSize: "16px",
        color: tokens.colorNeutralForeground3,
    },
    logoutButton: {
        marginTop: "16px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "8px",
        width: "100%",
        padding: "12px",
        background: "none",
        border: `1px solid ${tokens.colorPaletteRedBorder2}`,
        borderRadius: "12px",
        cursor: "pointer",
        color: tokens.colorPaletteRedForeground1,
        fontSize: "15px",
        ":hover": {
            background: tokens.colorPaletteRedBackground1,
        },
        ":active": {
            background: tokens.colorPaletteRedBackground2,
        },
    },
});
