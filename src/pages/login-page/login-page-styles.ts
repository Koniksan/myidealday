import { makeStyles, tokens } from "@fluentui/react-components";

export const useLoginPageStyles = makeStyles({
    page: {
        minHeight: "100vh",
        background: tokens.colorNeutralBackground1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px 16px 48px",
        boxSizing: "border-box",
        fontFamily:
            'Segoe UI, -apple-system, BlinkMacSystemFont, "Helvetica Neue", Arial, sans-serif',
    },
    title: {
        fontSize: "44px",
        lineHeight: "44px",
        marginTop: 0,
    },
    subtitle: {
        marginTop: "6px",
        marginBottom: "26px",
        fontSize: "18px",
        fontWeight: 400,
        color: "#605e5c",
        textAlign: "center",
    },
    card: {
        width: "100%",
        maxWidth: "420px",
        background: "#ffffff",
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
        width: "100%",
        boxSizing: "border-box",
    },
    passwordToggleButton: {
        minWidth: "auto",
        width: "28px",
        height: "28px",
    },
    forgot: {
        textAlign: "center",
        marginTop: "18px",
        color: "#605e5c",
        fontSize: "18px",
        textDecoration: "none",
    },
    loginButton: {
        margin: "10px 0 20px",
        width: "fit-content",
        alignSelf: 'center',
        padding: "7px 60px",
        background: tokens.colorPaletteGreenBackground3,
        border: "none",
        borderRadius: "8px",
        boxShadow: "0 2px 6px rgba(0, 0, 0, 0.15)",
    },
});

