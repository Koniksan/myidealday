import { makeStyles, tokens } from "@fluentui/react-components";

export const useKanbanItemPanelStyles = makeStyles({
    feedbackPanelBody: {
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        paddingBottom: "24px",
    },
    feedbackDialogMessage: {
        padding: "10px 12px",
        borderRadius: tokens.borderRadiusMedium,
        background: tokens.colorNeutralBackground3,
        fontSize: tokens.fontSizeBase300,
        color: tokens.colorNeutralForeground2,
        whiteSpace: "pre-wrap",
    },
    feedbackImage: {
        maxWidth: "100%",
        maxHeight: "320px",
        objectFit: "contain",
        borderRadius: tokens.borderRadiusMedium,
        border: `1px solid ${tokens.colorNeutralStroke2}`,
        display: "block",
    },
    feedbackAnswer: {
        minHeight: "120px",
    },
    feedbackMessage: {
        minHeight: "80px",
    },
    feedbackAnswerLabel: {
        fontSize: tokens.fontSizeBase100,
        fontWeight: tokens.fontWeightSemibold,
        color: tokens.colorBrandForeground1,
        textTransform: "uppercase",
        letterSpacing: "0.04em",
    },
    fieldSection: {
        display: "flex",
        flexDirection: "column",
        gap: "6px",
    },
    fieldLabel: {
        fontSize: tokens.fontSizeBase200,
        fontWeight: tokens.fontWeightSemibold,
        color: tokens.colorNeutralForeground3,
        textTransform: "uppercase",
        letterSpacing: "0.04em",
    },
    radioGroup: {
        display: "flex",
        flexWrap: "wrap",
        gap: "12px",
    },
    radioItem: {
        display: "inline-flex",
        cursor: "pointer",
        borderRadius: tokens.borderRadiusMedium,
        outline: "2px solid transparent",
        outlineOffset: "2px",
        ":hover": {
            outline: `2px solid ${tokens.colorNeutralStroke1Hover}`,
            outlineOffset: "2px",
        },
    },
    radioItemSelected: {
        outline: `2px solid ${tokens.colorBrandStroke1}`,
        outlineOffset: "2px",
    },
    typeRadioNone: {
        display: "inline-block",
        fontSize: tokens.fontSizeBase100,
        fontWeight: tokens.fontWeightSemibold,
        borderRadius: tokens.borderRadiusMedium,
        padding: "2px 8px",
        color: tokens.colorNeutralForeground3,
        background: tokens.colorNeutralBackground3,
        border: `1px solid ${tokens.colorNeutralStroke2}`,
    },
    textareaWrapper: {
        position: "relative",
        display: "flex",
        flexDirection: "column",
    },
    textareaToolbar: {
        display: "flex",
        justifyContent: "flex-end",
        paddingTop: "4px",
    },
    imagePreviewWrapper: {
        position: "relative",
        display: "inline-block",
        alignSelf: "flex-start",
    },
    imagePreview: {
        maxWidth: "100%",
        maxHeight: "200px",
        objectFit: "contain",
        borderRadius: tokens.borderRadiusMedium,
        border: `1px solid ${tokens.colorNeutralStroke2}`,
        display: "block",
    },
    removeImageButton: {
        position: "absolute",
        top: "4px",
        right: "4px",
    },
    panelHeaderTitle: {
        display: "flex",
        alignItems: "center",
        gap: "8px",
    },
    panelHeaderAvatar: {
        width: "24px",
        height: "24px",
        borderRadius: tokens.borderRadiusCircular,
        objectFit: "cover",
        flexShrink: 0,
    },
    drawerFooter: {
        display: "flex",
        gap: "8px",
        padding: "12px 20px",
        borderTop: `1px solid ${tokens.colorNeutralStroke2}`,
    },
});
