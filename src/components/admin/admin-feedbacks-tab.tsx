import { Button, Spinner, Text } from "@fluentui/react-components";
import { AddRegular, ChatRegular } from "@fluentui/react-icons";
import React from "react";
import { useAdminStyles } from "./admin-styles";
import { EditKanbanItemPanel } from "./edit-kanban-item-panel";
import { KanbanColumn } from "./kanban-column";
import { STATUSES, useAdminFeedbacksTab } from "./use-admin-feedbacks-tab";

export const AdminFeedbacksTab: React.FC = () => {
    const styles = useAdminStyles();
    const {
        rs,
        loading,
        feedbacks,
        grouped,
        selected,
        unreadIds,
        dragOver,
        dragId,
        collapsedColumns,
        STATUS_LABEL,
        setSelected,
        setDragOver,
        markSeen,
        toggleCollapse,
        handleSaved,
        handleDrop,
    } = useAdminFeedbacksTab();

    if (loading) return <div className={styles.center}><Spinner size="medium" /></div>;

    if (feedbacks.length === 0) {
        return (
            <div className={styles.emptyState}>
                <ChatRegular fontSize={32} />
                <Text>{rs.AdminNoFeedbacks}</Text>
            </div>
        );
    }

    return (
        <>
            <div className={styles.feedbackTabToolbar}>
                <Button appearance="subtle" icon={<AddRegular />}>
                    {rs.AddCard}
                </Button>
            </div>
            <div className={styles.kanbanBoard}>
                {STATUSES.map(status => (
                    <KanbanColumn
                        key={status}
                        status={status}
                        label={STATUS_LABEL[status]}
                        feedbacks={grouped[status]}
                        unreadIds={unreadIds}
                        isDragOver={dragOver === status}
                        isCollapsed={collapsedColumns.has(status)}
                        onDragOver={e => { e.preventDefault(); setDragOver(status); }}
                        onDragLeave={e => {
                            if (!e.currentTarget.contains(e.relatedTarget as Node)) setDragOver(null);
                        }}
                        onDrop={() => handleDrop(status)}
                        onCardDragStart={id => { dragId.current = id; }}
                        onCardClick={x => { setSelected(x); markSeen("admin-feedback", x.id); }}
                        onToggleCollapse={() => toggleCollapse(status)}
                    />
                ))}
            </div>

            <EditKanbanItemPanel
                feedback={selected}
                onClose={() => setSelected(null)}
                onSaved={handleSaved}
            />
        </>
    );
};
