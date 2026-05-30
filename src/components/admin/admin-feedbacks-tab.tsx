import { Button, Spinner, Text } from "@fluentui/react-components";
import { AddRegular, ChatRegular } from "@fluentui/react-icons";
import React, { useState } from "react";
import { AdminFeedback } from "../../infrastructure";
import { KanbanItemPanel } from "../common";
import { useAdminStyles } from "./admin-styles";
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
        handleCreated,
        handleDrop,
    } = useAdminFeedbacksTab();
    const [createOpen, setCreateOpen] = useState(false);

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
                <Button appearance="subtle" icon={<AddRegular />} onClick={() => setCreateOpen(true)}>
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

            <KanbanItemPanel
                mode="Edit"
                feedback={selected}
                onClose={() => setSelected(null)}
                onSaved={handleSaved}
            />
            <KanbanItemPanel
                mode="Create"
                open={createOpen}
                onClose={() => setCreateOpen(false)}
                onCreated={(x: AdminFeedback) => { handleCreated(x); setCreateOpen(false); }}
            />
        </>
    );
};
