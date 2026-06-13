import { mergeClasses } from "@fluentui/react-components";
import React from "react";
import { usePriorityBadgeStyles } from "./priority-badge-styles";

type PriorityBadgeSize = "mini" | "small" | "medium" | "large";

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
    const dotSizeClass = styles[size === "mini" ? "dotMini" : size === "small" ? "dotSmall" : size === "large" ? "dotLarge" : "dotMedium"];

    if (!resolvedColor) {
        if (size === "mini") return <span className={mergeClasses(styles.dot, styles.dotMiniEmpty)} />;
        if (!emptyText) return null;
        return <span className={mergeClasses(styles.base, styles.empty, sizeClass)}>{emptyText}</span>;
    }

    if (size === "mini") {
        return <span className={mergeClasses(styles.dot, dotSizeClass)} style={{ backgroundColor: resolvedColor, border: `1.5px solid ${resolvedColor}99` }} />;
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
