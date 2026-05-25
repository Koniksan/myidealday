import { makeStyles, tokens } from "@fluentui/react-components";

export const useTypeBadgeStyles = makeStyles({
    badge: {
        alignSelf: "flex-start",
        fontSize: tokens.fontSizeBase100,
        fontWeight: tokens.fontWeightSemibold,
        borderRadius: tokens.borderRadiusMedium,
        padding: "2px 8px",
    },
    feature: {
        color: tokens.colorPaletteLavenderForeground2,
        background: tokens.colorPaletteLavenderBackground2,
        border: `1px solid ${tokens.colorPaletteLavenderBorderActive}`,
    },
    bug: {
        color: tokens.colorNeutralForegroundOnBrand,
        background: tokens.colorStatusDangerBackground3,
        border: `1px solid ${tokens.colorStatusDangerBorderActive}`,
    },
    performance: {
        color: tokens.colorNeutralForegroundOnBrand,
        background: tokens.colorStatusWarningBackground3,
        border: `1px solid ${tokens.colorStatusWarningBorderActive}`,
    },
});
