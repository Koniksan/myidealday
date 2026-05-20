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
            border: `1px solid ${tokens.colorNeutralStroke1}`,
        },
    },
    priorityPillNoneSelected: {
        border: `1px solid ${tokens.colorNeutralStroke1}`,
        background: tokens.colorNeutralBackground2,
    },
    priorityPillSelected: {
        borderTopWidth: "1.5px",
        borderRightWidth: "1.5px",
        borderBottomWidth: "1.5px",
        borderLeftWidth: "1.5px",
    },

    // Time chip (task row inline)
    timeChip: {
        display: "flex",
        alignItems: "center",
        gap: "4px",
        padding: "2px 7px",
        borderRadius: "8px",
        border: "1px solid",
        fontSize: "11px",
        flexShrink: 0,
        cursor: "pointer",
        whiteSpace: "nowrap",
        background: "none",
        fontFamily: "inherit",
        transition: "background 0.1s, border-color 0.1s, color 0.1s",
    },
    timeChipEmpty: {
        padding: "2px 6px",
        backgroundColor: tokens.colorNeutralBackground3,
        border: `1px solid ${tokens.colorNeutralStroke2}`,
        color: tokens.colorNeutralForeground4,
        ":hover": {
            backgroundColor: tokens.colorNeutralBackground2Hover,
        },
    },
    timeChipSet: {
        backgroundColor: tokens.colorBrandBackground2,
        border: `1px solid ${tokens.colorCompoundBrandStroke}`,
        color: tokens.colorBrandForeground1,
        ":hover": {
            backgroundColor: tokens.colorBrandBackground2Hover,
        },
    },

    // Time picker expand panel
    timePicker: {
        overflow: "hidden",
        maxHeight: "0",
        transition: "max-height 0.22s ease, padding 0.22s ease",
        background: tokens.colorNeutralBackground2,
        display: "flex",
        flexDirection: "column",
        gap: "8px",
        paddingLeft: "12px",
        paddingRight: "12px",
        paddingTop: "0",
        paddingBottom: "0",
    },
    timePickerOpen: {
        maxHeight: "260px",
        paddingBottom: "12px",
    },

    // Tab bar (border-top is inside the clipped container — only visible when open)
    timeTabBar: {
        display: "flex",
        alignItems: "center",
        gap: "2px",
        paddingTop: "12px",
        borderTop: `1px solid ${tokens.colorNeutralStroke2}`,
    },
    timeTab: {
        background: "none",
        border: "none",
        borderBottom: "1.5px solid transparent",
        cursor: "pointer",
        padding: "2px 6px 4px",
        fontSize: "13px",
        color: tokens.colorNeutralForeground4,
        fontFamily: "inherit",
        transition: "color 0.1s, border-color 0.1s",
        ":hover": {
            color: tokens.colorNeutralForeground2,
        },
    },
    timeTabActive: {
        color: tokens.colorNeutralForeground1,
        borderBottomColor: tokens.colorCompoundBrandStroke,
    },
    timeClearBtn: {
        marginLeft: "auto",
        background: "none",
        border: "none",
        cursor: "pointer",
        color: tokens.colorNeutralForeground3,
        display: "flex",
        alignItems: "center",
        gap: "4px",
        fontSize: "12px",
        fontFamily: "inherit",
        padding: "2px 4px",
        borderRadius: tokens.borderRadiusMedium,
        ":hover": {
            color: tokens.colorNeutralForeground1,
            background: tokens.colorNeutralBackground1Hover,
        },
    },

    // Preset chips
    timePresets: {
        display: "flex",
        flexWrap: "wrap",
        gap: "6px",
    },
    timePreset: {
        display: "flex",
        alignItems: "center",
        padding: "4px 10px",
        borderRadius: "100px",
        cursor: "pointer",
        fontSize: "12px",
        border: `1px solid ${tokens.colorNeutralStroke2}`,
        background: tokens.colorNeutralBackground4,
        color: tokens.colorNeutralForeground2,
        fontFamily: "inherit",
        transition: "background 0.1s, border-color 0.1s, color 0.1s",
        ":hover": {
            background: tokens.colorNeutralBackground2Hover,
        },
    },
    timePresetActive: {
        background: tokens.colorBrandBackground2,
        border: `1px solid ${tokens.colorCompoundBrandStroke}`,
        color: tokens.colorBrandForeground1,
        ":hover": {
            background: tokens.colorBrandBackground2Hover,
        },
    },

    // Input row
    timeInputRow: {
        display: "flex",
        alignItems: "center",
        gap: "6px",
    },
    timeInput: {
        background: tokens.colorNeutralBackground3,
        border: `1px solid ${tokens.colorNeutralStroke2}`,
        color: tokens.colorBrandForeground1,
        fontFamily: "monospace",
        borderRadius: tokens.borderRadiusMedium,
        padding: "4px 8px",
        fontSize: "13px",
        outline: "none",
        minWidth: 0,
        ":focus": {
            borderTopColor: tokens.colorCompoundBrandStroke,
            borderRightColor: tokens.colorCompoundBrandStroke,
            borderBottomColor: tokens.colorCompoundBrandStroke,
            borderLeftColor: tokens.colorCompoundBrandStroke,
        },
    },
    timeArrow: {
        color: tokens.colorNeutralForeground3,
        fontSize: "12px",
        flexShrink: 0,
    },
    timeDurationBadge: {
        background: tokens.colorBrandBackground2,
        color: tokens.colorBrandForeground1,
        borderRadius: tokens.borderRadiusMedium,
        padding: "3px 8px",
        fontSize: "11px",
        fontWeight: "500",
        flexShrink: 0,
        whiteSpace: "nowrap",
    },
});
