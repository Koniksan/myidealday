import { makeStyles, tokens } from "@fluentui/react-components";

export const usePriorityBadgeStyles = makeStyles({
    base: {
        display: "flex",
        alignItems: "center",
        borderRadius: "100px",
        flexShrink: 0,
        whiteSpace: "nowrap",
    },
    empty: {
        border: `1px dashed ${tokens.colorNeutralStroke1}`,
        color: tokens.colorNeutralForeground3,
    },
    badge: {
        fontWeight: "500",
        border: "1px solid transparent",
    },
    dot: {
        borderRadius: "50%",
        flexShrink: 0,
    },

    // Sizes
    small: {
        gap: "4px",
        padding: "1px 6px",
        fontSize: "10px",
    },
    medium: {
        gap: "5px",
        padding: "3px 8px",
        fontSize: "11px",
    },
    large: {
        gap: "6px",
        padding: "4px 10px",
        fontSize: "13px",
    },
    dotSmall: {
        width: "5px",
        height: "5px",
    },
    dotMedium: {
        width: "6px",
        height: "6px",
    },
    dotLarge: {
        width: "8px",
        height: "8px",
    },
});
