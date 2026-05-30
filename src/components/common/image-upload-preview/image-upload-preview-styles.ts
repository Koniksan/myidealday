import { makeStyles, tokens } from "@fluentui/react-components";

export const useImageUploadPreviewStyles = makeStyles({
    wrapper: {
        display: "flex",
        flexDirection: "column",
        gap: "6px",
        alignSelf: "flex-start",
    },
    imageWrapper: {
        position: "relative",
        display: "inline-flex",
        alignSelf: "flex-start",
        borderRadius: tokens.borderRadiusMedium,
        overflow: "hidden",
        border: `1px solid ${tokens.colorNeutralStroke2}`,
    },
    image: {
        maxWidth: "100%",
        maxHeight: "200px",
        display: "block",
        objectFit: "contain",
    },
    removeButton: {
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
    sizeInfo: {
        fontSize: tokens.fontSizeBase100,
        color: tokens.colorNeutralForeground3,
    },
});
