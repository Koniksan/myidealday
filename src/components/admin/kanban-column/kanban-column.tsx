import { Button, mergeClasses } from "@fluentui/react-components";
import { ChevronLeftRegular, ChevronRightRegular } from "@fluentui/react-icons";
import React from "react";
import { AdminFeedback, FeedbackStatus } from "../../../infrastructure";
import { KanbanCard } from "../kanban-card";
import { useKanbanColumnStyles } from "./kanban-column-styles";

const DOT_COLOR: Record<FeedbackStatus, string> = {
    "New": "#0078d4",
    "In Progress": "#d97706",
    "Completed": "#16a34a",
};

interface KanbanColumnProps {
    status: FeedbackStatus;
    label: string;
    feedbacks: AdminFeedback[];
    unreadIds: Set<string>;
    isDragOver: boolean;
    isCollapsed: boolean;
    onDragOver: (e: React.DragEvent) => void;
    onDragLeave: (e: React.DragEvent) => void;
    onDrop: () => void;
    onCardDragStart: (id: string) => void;
    onCardClick: (feedback: AdminFeedback) => void;
    onToggleCollapse: () => void;
}

export const KanbanColumn: React.FC<KanbanColumnProps> = ({
    status, label, feedbacks, unreadIds, isDragOver,
    onDragOver, onDragLeave, onDrop,
    onCardDragStart, onCardClick, isCollapsed, onToggleCollapse,
}) => {
    const styles = useKanbanColumnStyles();

    if (isCollapsed) {
        return (
            <div
                className={mergeClasses(styles.kanbanColumn, styles.kanbanColumnCollapsed, isDragOver && styles.kanbanColumnDragOver)}
                onDragOver={onDragOver}
                onDragLeave={onDragLeave}
                onDrop={onDrop}
                onClick={onToggleCollapse}
            >
                <Button appearance="subtle" size="small" icon={<ChevronRightRegular />} />
                <div className={styles.kanbanCollapsedBody}>
                    <span className={styles.kanbanDot} style={{ backgroundColor: DOT_COLOR[status] }} />
                    <span className={styles.kanbanColumnTitleVertical}>{label}</span>
                    <span className={styles.kanbanColumnCount}>{feedbacks.length}</span>
                </div>
            </div>
        );
    }

    return (
        <div
            className={mergeClasses(styles.kanbanColumn, styles.kanbanColumnExpanded, isDragOver && styles.kanbanColumnDragOver)}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
        >
            <div className={styles.kanbanColumnHeader}>
                <span className={styles.kanbanDot} style={{ backgroundColor: DOT_COLOR[status] }} />
                <span className={styles.kanbanColumnTitle}>{label}</span>
                <span className={styles.kanbanColumnCount}>{feedbacks.length}</span>
                <Button appearance="subtle" size="small" icon={<ChevronLeftRegular />} onClick={onToggleCollapse} />
            </div>
            <div className={styles.kanbanCards}>
                {feedbacks.map(x => (
                    <KanbanCard
                        key={x.id}
                        feedback={x}
                        isNew={unreadIds.has(x.id)}
                        onDragStart={() => onCardDragStart(x.id)}
                        onClick={() => onCardClick(x)}
                    />
                ))}
            </div>
        </div>
    );
};
