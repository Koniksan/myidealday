import { makeStyles, tokens } from "@fluentui/react-components";

export const useFeedbackItemStyles = makeStyles({
    item: {
        display: "flex",
        flexDirection: "column",
        gap: "6px",
        padding: "12px",
        borderRadius: tokens.borderRadiusMedium,
        background: tokens.colorNeutralBackground2,
        border: `1px solid ${tokens.colorNeutralStroke2}`,
        cursor: "pointer",
        transition: "background 0.1s",
        ":hover": {
            background: tokens.colorNeutralBackground2Hover,
        },
    },
    header: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
    },
    meta: {
        display: "flex",
        alignItems: "center",
        gap: "8px",
    },
    date: {
        fontSize: tokens.fontSizeBase200,
        color: tokens.colorNeutralForeground3,
    },
    badge: {
        paddingLeft: tokens.spacingHorizontalS,
        paddingRight: tokens.spacingHorizontalS,
    },
    message: {
        display: "-webkit-box",
        WebkitLineClamp: "3",
        WebkitBoxOrient: "vertical",
        overflow: "hidden",
    },
    answer: {
        display: "flex",
        flexDirection: "column",
        gap: "4px",
        marginTop: "4px",
        padding: "8px 10px",
        borderRadius: tokens.borderRadiusSmall,
        background: tokens.colorBrandBackground2,
        borderLeft: `3px solid ${tokens.colorBrandForeground1}`,
    },
    answerLabel: {
        fontSize: tokens.fontSizeBase100,
        fontWeight: tokens.fontWeightSemibold,
        color: tokens.colorBrandForeground1,
        textTransform: "uppercase",
        letterSpacing: "0.04em",
    },
    answerText: {
        fontSize: tokens.fontSizeBase300,
        color: tokens.colorNeutralForeground1,
    },
});
