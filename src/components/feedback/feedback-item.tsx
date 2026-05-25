import { Badge, Text, mergeClasses } from "@fluentui/react-components";
import { ChatRegular, ChevronDownRegular, ImageRegular } from "@fluentui/react-icons";
import React, { useState } from "react";
import { StoredFeedback, useLocalization } from "../../infrastructure";
import { StatusBadge } from "../common";
import { useFeedbackItemStyles } from "./feedback-item-styles";

interface FeedbackItemProps {
    feedback: StoredFeedback;
    isUnread?: boolean;
    onSeen?: () => void;
}

export const FeedbackItem: React.FC<FeedbackItemProps> = ({ feedback, isUnread, onSeen }) => {
    const styles = useFeedbackItemStyles();
    const rs = useLocalization();
    const [expanded, setExpanded] = useState(false);

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
                    {feedback.status && <StatusBadge status={feedback.status} />}
                    {feedback.image_url && (
                        <Badge appearance="tint" color="subtle" size="small" icon={<ImageRegular />} className={styles.badge} />
                    )}
                    {feedback.answer && (
                        <Badge appearance="tint" color="brand" size="small" icon={<ChatRegular />} className={styles.badge} />
                    )}
                </div>
                {(feedback.image_url || feedback.answer) && (
                    <span className={mergeClasses(styles.chevron, expanded && styles.chevronExpanded)}>
                        <ChevronDownRegular />
                    </span>
                )}
            </div>
            <Text className={expanded ? undefined : styles.message}>
                {feedback.message}
            </Text>
            {expanded && feedback.image_url && (
                <img src={feedback.image_url} className={styles.attachedImage} />
            )}
            {expanded && feedback.answer && (
                <div className={styles.answer}>
                    <Text className={styles.answerLabel}>{rs.AdminReply}</Text>
                    <Text className={styles.answerText}>{feedback.answer}</Text>
                </div>
            )}
        </div>
    );
};
