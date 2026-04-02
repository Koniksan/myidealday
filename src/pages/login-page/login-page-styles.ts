import { makeStyles, tokens } from "@fluentui/react-components";

export const useLoginPageStyles = makeStyles({
    title: {
        fontSize: "44px",
        lineHeight: "44px",
        marginTop: 0,
        marginBottom: "12px",
    },
    subtitle: {
        marginBottom: "16px",
        fontSize: "18px",
        textAlign: "center",
    },
    card: {
        display: "flex",
        flexDirection: "column",
        width: "100%",
        maxWidth: "420px",
        background: tokens.colorNeutralBackground2,
        borderRadius: "18px",
        boxShadow:
            "0 8px 24px rgba(0, 0, 0, 0.08), 0 2px 6px rgba(0, 0, 0, 0.06)",
        padding: "34px",
        boxSizing: "border-box",
    },
    form: {
        display: "flex",
        flexDirection: "column",
        gap: "14px",
    },
    input: {
        padding: '8px 5px',
        width: "100%",
        fontSize: "14px",
        boxSizing: "border-box",
    },
    passwordInput: {
        paddingRight: "40px",
        '& .fui-Input__contentAfter': {
            position: "absolute",
            right: "10px",
        }
    },
    forgot: {
        textAlign: "center",
        marginTop: "18px",
        color: tokens.colorBrandForegroundLink,
        fontSize: "14px",
        textDecoration: "none",
    },
    themeToggle: {
        position: "fixed",
        top: "16px",
        right: "16px",
        fontSize: "20px",
    },
    loginButton: {
        margin: "10px 0 0",
        width: "fit-content",
        alignSelf: 'center',
        padding: "10px 60px",
        background: tokens.colorPaletteGreenBackground3,
        border: "none",
        borderRadius: "8px",
        boxShadow: "0 2px 6px rgba(0, 0, 0, 0.15)",
        "&:hover": {
            background: tokens.colorPaletteGreenForeground1,
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
        },
         "&:active:hover": {
            background: tokens.colorPaletteGreenForeground2,
            boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
        },
    },
});

