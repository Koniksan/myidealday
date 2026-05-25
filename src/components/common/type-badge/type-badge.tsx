import { mergeClasses } from "@fluentui/react-components";
import React from "react";
import { FeedbackType, useLocalization } from "../../../infrastructure";
import { useTypeBadgeStyles } from "./type-badge-styles";

interface TypeBadgeProps {
    type: FeedbackType;
}

export const TypeBadge: React.FC<TypeBadgeProps> = ({ type }) => {
    const styles = useTypeBadgeStyles();
    const rs = useLocalization();

    const TYPE_LABELS: Record<FeedbackType, string> = {
        [FeedbackType.Unassign]: "",
        [FeedbackType.Feature]: rs.TagFeature,
        [FeedbackType.Bug]: rs.TagBug,
        [FeedbackType.Performance]: rs.Performance,
    };

    const TYPE_STYLES: Record<FeedbackType, string> = {
        [FeedbackType.Unassign]: "",
        [FeedbackType.Feature]: styles.feature,
        [FeedbackType.Bug]: styles.bug,
        [FeedbackType.Performance]: styles.performance,
    };

    if (!type) return null;

    return (
        <span className={mergeClasses(styles.badge, TYPE_STYLES[type])}>
            {TYPE_LABELS[type]}
        </span>
    );
};
