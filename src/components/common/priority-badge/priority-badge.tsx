import { mergeClasses } from "@fluentui/react-components";
import React from "react";
import { usePriorityBadgeStyles } from "./priority-badge-styles";

type PriorityBadgeSize = "small" | "medium" | "large";

interface PriorityBadgeProps {
    color: string | null | undefined;
    label: string;
    emptyText?: string;
    size?: PriorityBadgeSize;
}

export const PriorityBadge: React.FC<PriorityBadgeProps> = ({ color, label, emptyText, size = "medium" }) => {
    const styles = usePriorityBadgeStyles();
    const resolvedColor = color ?? null;

    const sizeClass = styles[size];
    const dotSizeClass = styles[size === "small" ? "dotSmall" : size === "large" ? "dotLarge" : "dotMedium"];

    if (!resolvedColor) {
        if (!emptyText) return null;
        return <span className={mergeClasses(styles.base, styles.empty, sizeClass)}>{emptyText}</span>;
    }
    return (
        <span
            className={mergeClasses(styles.base, styles.badge, sizeClass)}
            style={{ backgroundColor: `${resolvedColor}18`, borderColor: `${resolvedColor}70`, color: resolvedColor }}
        >
            <span className={mergeClasses(styles.dot, dotSizeClass)} style={{ backgroundColor: resolvedColor }} />
            {label}
        </span>
    );
};
