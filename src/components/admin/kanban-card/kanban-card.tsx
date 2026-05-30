import { mergeClasses } from "@fluentui/react-components";
import { PersonRegular } from "@fluentui/react-icons";
import React from "react";
import { AdminFeedback, FeedbackType, useLocalization } from "../../../infrastructure";
import { TypeBadge } from "../../common";
import { useKanbanCardStyles } from "./kanban-card-styles";

interface KanbanCardProps {
    feedback: AdminFeedback;
    isNew: boolean;
    onDragStart: () => void;
    onClick: () => void;
}

export const KanbanCard: React.FC<KanbanCardProps> = ({ feedback, isNew, onDragStart, onClick }) => {
    const styles = useKanbanCardStyles();
    const rs = useLocalization();
    const dateStr = new Date(feedback.createdAt).toLocaleDateString(rs.DateLocale, {
        day: "numeric",
        month: "short",
    });

    return (
        <div
            className={mergeClasses(styles.kanbanCard, isNew && styles.kanbanCardNew)}
            draggable
            onDragStart={onDragStart}
            onClick={onClick}
        >
            {(!!feedback.type || isNew) && (
                <div className={styles.kanbanCardHeader}>
                    {isNew && <span className={styles.kanbanNewBadge}>{rs.StatusNew}</span>}
                    <TypeBadge type={feedback.type ?? FeedbackType.Unassign} />
                </div>
            )}
            <span className={styles.kanbanCardMessage}>{feedback.message}</span>
            <div className={styles.kanbanCardFooter}>
                <span className={styles.kanbanCardSource}>
                    {feedback.avatarUrl
                        ? <img src={feedback.avatarUrl} className={styles.kanbanCardAvatar} />
                        : <PersonRegular className={styles.kanbanCardSourceIcon} />
                    }
                    {feedback.displayName ?? feedback.email ?? rs.AdminAnonymous}
                </span>
                <span className={styles.kanbanCardDate}>{dateStr}</span>
            </div>
        </div>
    );
};
