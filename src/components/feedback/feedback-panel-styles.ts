import { makeStyles, tokens } from "@fluentui/react-components";

export const useFeedbackPanelStyles = makeStyles({
    body: {
        display: "flex",
        flexDirection: "column",
        gap: "16px",
        overflowY: "auto",
    },
    center: {
        display: "flex",
        justifyContent: "center",
        padding: "32px 0",
    },
    emptyState: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "8px",
        padding: "40px 0",
        color: tokens.colorNeutralForeground3,
    },
    addFeedbackButton: {
        maxWidth: "200px",
        marginTop: "16px",
        alignSelf: "start",
    },
    list: {
        display: "flex",
        flexDirection: "column",
        gap: "8px",
    },
    composeBody: {
        display: "flex",
        flexDirection: "column",
        gap: "16px",
    },
    feedbackDescription: {
        color: tokens.colorNeutralForeground3,
        fontSize: "13px",
        lineHeight: "18px",
    },
    imagePreviewWrapper: {
        position: "relative",
        display: "inline-flex",
        alignSelf: "flex-start",
        borderRadius: tokens.borderRadiusMedium,
        overflow: "hidden",
        border: `1px solid ${tokens.colorNeutralStroke2}`,
    },
    imagePreview: {
        maxWidth: "100%",
        maxHeight: "200px",
        display: "block",
        objectFit: "contain",
    },
    imageSizeInfo: {
        fontSize: tokens.fontSizeBase100,
        color: tokens.colorNeutralForeground3,
        alignSelf: "flex-start",
        marginTop: "-8px",
    },
    removeImageButton: {
        position: "absolute",
        top: "4px",
        right: "4px",
        backgroundColor: tokens.colorNeutralBackground1,
        borderRadius: tokens.borderRadiusLarge,
        ":hover": {
            backgroundColor: tokens.colorNeutralBackground1Hover,
        },
        ":active": {
            backgroundColor: tokens.colorNeutralBackground1Pressed,
        },
    },
    textareaWrapper: {
        display: "flex",
        flexDirection: "column",
        border: `1px solid ${tokens.colorNeutralStroke1}`,
        borderRadius: tokens.borderRadiusMedium,
        overflow: "hidden",
        ":focus-within": {
            border: `1px solid ${tokens.colorCompoundBrandStroke}`,
        },
    },
    textarea: {
        width: "100%",
        minHeight: "160px",
        fontSize: "16px",
        border: "none",
        ":focus-within": {
            border: "none",
        },
        "::after": {
            border: "none",
        },
    },
    textareaToolbar: {
        display: "flex",
        alignItems: "center",
        padding: "4px 6px",
        borderTop: `1px solid ${tokens.colorNeutralStroke2}`,
        background: tokens.colorNeutralBackground2,
    },
});
