import { makeStyles, tokens } from "@fluentui/react-components";

export const useAvatarCropperStyles = makeStyles({
    surface: {
        width: "min(92vw, 420px)",
        maxWidth: "unset",
    },
    content: {
        display: "flex",
        flexDirection: "column",
        gap: "20px",
        paddingTop: "12px",
    },
    cropContainer: {
        position: "relative",
        width: "100%",
        height: "280px",
        borderRadius: tokens.borderRadiusMedium,
        overflow: "hidden",
        background: tokens.colorNeutralBackground3,
    },
    slider: {
        width: "100%",
        paddingLeft: 0,
        paddingRight: 0,
    },
});
