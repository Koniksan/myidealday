import { makeStyles, tokens } from "@fluentui/react-components";

export const useSettingsPageStyles = makeStyles({
    profileSection: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "12px",
        padding: "20px 16px 16px",
        borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
    },
    avatarButtons: {
        display: "flex",
        gap: "8px",
        flexWrap: "wrap",
        justifyContent: "center",
    },
    profileFields: {
        display: "flex",
        flexDirection: "column",
        gap: "16px",
        padding: "16px",
    },
    field: {
        display: "flex",
        flexDirection: "column",
        gap: "6px",
    },
    fieldLabel: {
        fontSize: "13px",
        fontWeight: 600,
        color: tokens.colorNeutralForeground2,
    },
    input: {
        width: "100%",
        fontSize: "15px",
    },
    error: {
        fontSize: "13px",
        color: tokens.colorPaletteRedForeground1,
    },
    saveButton: {
        alignSelf: "flex-end",
    },
    hiddenInput: {
        display: "none",
    },
    themeRow: {
        display: "flex",
        alignItems: "center",
        padding: "4px 16px 4px 12px",
    },
    themeSwitch: {
        flex: 1,
        justifyContent: "space-between",
    },
    checkmark: {
        color: tokens.colorBrandForeground1,
        fontSize: "16px",
    },
});
