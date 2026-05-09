import { Badge, Button, Text } from "@fluentui/react-components";
import { ChatRegular, DeleteRegular } from "@fluentui/react-icons";
import React, { useState } from "react";
import { useLocalization } from "../../infrastructure/context/locale-context";
import { FeedbackStatus, StoredFeedback } from "../../infrastructure/storages/feedback-storage";
import { useFeedbackItemStyles } from "./feedback-item-styles";
import { mergeClasses } from "@fluentui/react-components";

const STATUS_COLOR: Record<FeedbackStatus, "informative" | "warning" | "success"> = {
    "New": "informative",
    "In Progress": "warning",
    "Completed": "success",
};

interface FeedbackItemProps {
    feedback: StoredFeedback;
    onDelete: (id: string) => void;
    isUnread?: boolean;
    onSeen?: () => void;
}

export const FeedbackItem: React.FC<FeedbackItemProps> = ({ feedback, onDelete, isUnread, onSeen }) => {
    const styles = useFeedbackItemStyles();
    const rs = useLocalization();
    const [expanded, setExpanded] = useState(false);

    const STATUS_LABEL: Record<FeedbackStatus, string> = {
        "New": rs.StatusNew,
        "In Progress": rs.StatusInProgress,
        "Completed": rs.StatusCompleted,
    };

    const handleClick = () => {
        setExpanded(v => !v);
        if (isUnread) onSeen?.();
    };

    return (
        <div className={mergeClasses(styles.item, isUnread && styles.itemUnread)} onClick={handleClick}>
            <div className={styles.header}>
                <div className={styles.meta}>
                    <Text className={styles.date}>
                        {new Date(feedback.created_at).toLocaleDateString(undefined, {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                        })}
                    </Text>
                    {feedback.status && STATUS_COLOR[feedback.status] && (
                        <Badge appearance="tint" color={STATUS_COLOR[feedback.status]} size="small" className={styles.badge}>
                            {STATUS_LABEL[feedback.status]}
                        </Badge>
                    )}
                    {feedback.answer && (
                        <Badge appearance="tint" color="brand" size="small" icon={<ChatRegular />} className={styles.badge} />
                    )}
                </div>
                <Button
                    appearance="subtle"
                    size="small"
                    icon={<DeleteRegular />}
                    onClick={e => { e.stopPropagation(); onDelete(feedback.id); }}
                />
            </div>
            <Text className={expanded ? undefined : styles.message}>
                {feedback.message}
            </Text>
            {expanded && feedback.answer && (
                <div className={styles.answer}>
                    <Text className={styles.answerLabel}>{rs.AdminReply}</Text>
                    <Text className={styles.answerText}>{feedback.answer}</Text>
                </div>
            )}
        </div>
    );
};
