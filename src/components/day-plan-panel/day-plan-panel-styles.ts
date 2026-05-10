import { makeStyles, tokens } from "@fluentui/react-components";
import { breakpoints } from "../common/styles/breakpoints";

export const useDayPlanPanelStyles = makeStyles({
    body: {
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        paddingTop: "8px",
        paddingBottom: "8px",
    },
    inputRow: {
        display: "flex",
        gap: "8px",
        alignItems: "center",
    },
    input: {
        flex: 1,
        fontSize: "16px",
    },
    footer: {
        gap: "8px",
        justifyContent: "flex-end",
        "& > button": {
            whiteSpace: "nowrap",
            flexShrink: 0,
        },
    },
    resetButton: {
        marginRight: "auto",
        color: tokens.colorPaletteRedForeground1,
        ":hover": {
            color: tokens.colorPaletteRedForeground1,
            background: tokens.colorPaletteRedBackground1,
        },
    },
    confirmSurface: {
        [breakpoints.mobile]: {
            width: "calc(100% - 64px)",
            maxWidth: "none",
            margin: "auto 32px 25vh",
            boxSizing: "border-box",
        },
    },
    confirmActions: {
        "& > button": {
            whiteSpace: "nowrap",
            flexShrink: 0,
        },
    },
    description: {
        marginTop: "4px",
        fontSize: "14px",
        color: tokens.colorNeutralForeground3,
    },

    // Task list
    list: {
        display: "flex",
        flexDirection: "column",
        gap: "4px",
    },
    listItemWrapper: {
        borderRadius: "8px",
        overflow: "hidden",
        background: tokens.colorNeutralBackground3,
    },
    listItemWrapperDragging: {
        opacity: 0.5,
        transform: "scale(1.01)",
        boxShadow: tokens.shadow8,
    },
    listItem: {
        display: "flex",
        alignItems: "center",
        gap: "8px",
        padding: "10px 10px 10px 12px",
        cursor: "pointer",
        userSelect: "none",
        transition: "background 0.15s",
        ":hover": {
            background: tokens.colorNeutralBackground2Hover,
        },
    },
    listItemOpen: {
        background: tokens.colorNeutralBackground2,
        ":hover": {
            background: tokens.colorNeutralBackground2,
        },
    },
    dragHandle: {
        display: "flex",
        alignItems: "center",
        color: tokens.colorNeutralForeground4,
        flexShrink: 0,
        cursor: "grab",
    },
    taskName: {
        flex: 1,
        fontSize: "14px",
        color: tokens.colorNeutralForeground1,
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
    },

    listItemInput: {
        flex: 1,
        fontSize: "14px",
    },

    // Priority badge on task row
    priorityBadgeEmpty: {
        display: "flex",
        alignItems: "center",
        padding: "3px 8px",
        borderRadius: "100px",
        border: `1px dashed ${tokens.colorNeutralStroke1}`,
        color: tokens.colorNeutralForeground3,
        fontSize: "11px",
        flexShrink: 0,
        whiteSpace: "nowrap",
    },
    priorityBadge: {
        display: "flex",
        alignItems: "center",
        gap: "5px",
        padding: "3px 8px",
        borderRadius: "100px",
        fontSize: "11px",
        fontWeight: "500",
        flexShrink: 0,
        whiteSpace: "nowrap",
        border: "1px solid transparent",
    },
    priorityDot: {
        width: "6px",
        height: "6px",
        borderRadius: "50%",
        flexShrink: 0,
    },

    // Chevron
    chevron: {
        display: "flex",
        alignItems: "center",
        color: tokens.colorNeutralForeground3,
        flexShrink: 0,
        transition: "transform 0.2s ease",
    },
    chevronOpen: {
        transform: "rotate(180deg)",
    },

    // Delete button
    deleteButton: {
        flexShrink: 0,
        background: "none",
        border: "none",
        cursor: "pointer",
        padding: "8px",
        display: "flex",
        alignItems: "center",
        borderRadius: tokens.borderRadiusMedium,
        color: tokens.colorNeutralForeground3,
        fontSize: "16px",
        transition: "color 0.1s, background 0.1s",
        ":hover": {
            background: tokens.colorNeutralBackground1Hover,
            color: tokens.colorNeutralForeground1,
        },
    },

    // Inline priority picker
    priorityPicker: {
        overflow: "hidden",
        maxHeight: "0",
        transition: "max-height 0.22s ease, padding 0.22s ease",
        display: "flex",
        flexWrap: "wrap",
        gap: "6px",
        paddingLeft: "12px",
        paddingRight: "12px",
        paddingTop: "0",
        paddingBottom: "0",
    },
    priorityPickerOpen: {
        maxHeight: "120px",
        paddingTop: "8px",
        paddingBottom: "12px",
    },
    priorityPill: {
        display: "flex",
        alignItems: "center",
        gap: "5px",
        padding: "5px 10px",
        borderRadius: "100px",
        cursor: "pointer",
        fontSize: "12px",
        border: "1px solid transparent",
        background: "none",
        transition: "border-color 0.1s, background 0.1s",
        color: tokens.colorNeutralForeground2,
        ":hover": {
            background: tokens.colorNeutralBackground1Hover,
        },
    },
    priorityPillNone: {
        border: `1px dashed ${tokens.colorNeutralStroke1}`,
        color: tokens.colorNeutralForeground3,
        ":hover": {
            background: tokens.colorNeutralBackground2Hover,
            borderStyle: "solid",
        },
    },
    priorityPillNoneSelected: {
        border: `1px solid ${tokens.colorNeutralStroke1}`,
        background: tokens.colorNeutralBackground2,
    },
    priorityPillSelected: {
        borderWidth: "1.5px",
    },
});
