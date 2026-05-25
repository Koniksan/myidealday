import { Badge } from "@fluentui/react-components";
import React from "react";
import { FeedbackStatus, useLocalization } from "../../../infrastructure";
import { useStatusBadgeStyles } from "./status-badge-styles";

interface StatusBadgeProps {
    status: FeedbackStatus;
}

const STATUS_COLOR: Record<FeedbackStatus, "informative" | "warning" | "success"> = {
    "New": "informative",
    "In Progress": "warning",
    "Completed": "success",
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
    const styles = useStatusBadgeStyles();
    const rs = useLocalization();

    const STATUS_LABEL: Record<FeedbackStatus, string> = {
        "New": rs.StatusNew,
        "In Progress": rs.StatusInProgress,
        "Completed": rs.StatusCompleted,
    };

    return (
        <Badge appearance="tint" color={STATUS_COLOR[status]} size="small" className={styles.badge}>
            {STATUS_LABEL[status]}
        </Badge>
    );
};
