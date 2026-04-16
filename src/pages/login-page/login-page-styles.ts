import { makeStyles, tokens } from "@fluentui/react-components";
import { breakpoints } from "../../styles/breakpoints";

export const useLoginPageStyles = makeStyles({
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
        [breakpoints.mobile]: {
            padding: "28px 20px",
            borderRadius: "14px",
            width: "calc(100% - 32px)",
        },
    },
    form: {
        display: "flex",
        flexDirection: "column",
        gap: "14px",
    },
    input: {
        padding: '8px 5px',
        width: "100%",
        fontSize: "16px",
        boxSizing: "border-box",
        '& input:-webkit-autofill, & input:-webkit-autofill:hover, & input:-webkit-autofill:focus': {
            WebkitBoxShadow: `0 0 0px 1000px ${tokens.colorNeutralBackground1} inset`,
            WebkitTextFillColor: tokens.colorNeutralForeground1,
        },
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
    loginError: {
        color: tokens.colorPaletteRedForeground1,
        textAlign: "center",
    },
    register: {
        textAlign: "center",
        marginTop: "10px",
        fontSize: "13px",
        color: tokens.colorNeutralForeground3,
    },
    loginButton: {
        margin: "10px 0 0",
        width: "fit-content",
        alignSelf: 'center',
        padding: "10px 60px",
        minHeight: "44px",
        [breakpoints.mobile]: {
            width: "100%",
            padding: "10px",
        },
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

