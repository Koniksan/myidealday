import { Badge, Button, Text } from "@fluentui/react-components";
import { ChatRegular, DeleteRegular } from "@fluentui/react-icons";
import React, { useState } from "react";
import { FeedbackStatus, StoredFeedback } from "../../infrastructure/storages/feedback-storage";
import { useFeedbackItemStyles } from "./feedback-item-styles";

const STATUS_BADGE: Record<FeedbackStatus, { color: "informative" | "warning" | "success"; label: string }> = {
    "New":         { color: "informative", label: "New" },
    "In Progress": { color: "warning",     label: "In Progress" },
    "Completed":   { color: "success",     label: "Completed" },
};

interface FeedbackItemProps {
    feedback: StoredFeedback;
    onDelete: (id: string) => void;
}

export const FeedbackItem: React.FC<FeedbackItemProps> = ({ feedback, onDelete }) => {
    const styles = useFeedbackItemStyles();
    const [expanded, setExpanded] = useState(false);

    return (
        <div className={styles.item} onClick={() => setExpanded(v => !v)}>
            <div className={styles.header}>
                <div className={styles.meta}>
                    <Text className={styles.date}>
                        {new Date(feedback.created_at).toLocaleDateString(undefined, {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                        })}
                    </Text>
                    {feedback.status && STATUS_BADGE[feedback.status] && (
                        <Badge appearance="tint" color={STATUS_BADGE[feedback.status].color} size="small" className={styles.badge}>
                            {STATUS_BADGE[feedback.status].label}
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
                    <Text className={styles.answerLabel}>Admin reply</Text>
                    <Text className={styles.answerText}>{feedback.answer}</Text>
                </div>
            )}
        </div>
    );
};
