import {
    Button,
    DrawerBody,
    DrawerHeader,
    DrawerHeaderTitle,
    OverlayDrawer,
    Select,
    Spinner,
    Text,
    Textarea,
    mergeClasses,
} from "@fluentui/react-components";
import { AddRegular, ChatRegular, ChevronLeftRegular, ChevronRightRegular, DismissRegular, PersonRegular } from "@fluentui/react-icons";
import React, { useEffect, useRef, useState } from "react";
import { useLocalization } from "../../infrastructure/context/locale-context";
import { AdminFeedback, getAllFeedbacks, updateFeedback } from "../../infrastructure/storages/admin-storage";
import { useNotificationBadge } from "../../infrastructure/context/notification-badge-context";
import { FeedbackStatus } from "../../infrastructure/storages/feedback-storage";
import { useAdminStyles } from "./admin-styles";
import { FeedbackType } from "../../infrastructure";

const STATUSES: FeedbackStatus[] = ["New", "In Progress", "Completed"];

const DOT_COLOR: Record<FeedbackStatus, string> = {
    "New": "#0078d4",
    "In Progress": "#d97706",
    "Completed": "#16a34a",
};

interface EditDrawerProps {
    feedback: AdminFeedback | null;
    onClose: () => void;
    onSaved: (id: string, status: FeedbackStatus, answer: string | null, type: FeedbackType) => void;
}

const EditDrawer: React.FC<EditDrawerProps> = ({ feedback, onClose, onSaved }) => {
    const styles = useAdminStyles();
    const rs = useLocalization();
    const [editStatus, setEditStatus] = useState<FeedbackStatus>("New");
    const [editType, setEditType] = useState<FeedbackType>(FeedbackType.Unassign);
    const [editAnswer, setEditAnswer] = useState("");
    const [saving, setSaving] = useState(false);

    const STATUS_LABEL: Record<FeedbackStatus, string> = {
        "New": rs.StatusNew,
        "In Progress": rs.StatusInProgress,
        "Completed": rs.StatusCompleted,
    };

    const TAG_LABELS: Record<FeedbackType, string> = {
        [FeedbackType.Unassign]: "—",
        [FeedbackType.Feature]: rs.TagFeature,
        [FeedbackType.Bug]: rs.TagBug,
        [FeedbackType.Performance]: rs.Performance,
    };

    useEffect(() => {
        if (feedback) {
            setEditStatus(feedback.status);
            setEditType(feedback.type ?? FeedbackType.Unassign);
            setEditAnswer(feedback.answer ?? "");
        }
    }, [feedback?.id]);

    const handleSave = async () => {
        if (!feedback) return;
        setSaving(true);
        try {
            const type = editType === FeedbackType.Unassign ? null : editType;
            await updateFeedback(feedback.id, editStatus, editAnswer || null, type);
            onSaved(feedback.id, editStatus, editAnswer || null, editType);
            onClose();
        } catch (e) {
            console.error(e);
        } finally {
            setSaving(false);
        }
    };

    return (
        <OverlayDrawer
            open={!!feedback}
            size="medium"
            onOpenChange={(_, d) => !d.open && onClose()}
            position="end"
        >
            <DrawerHeader>
                <DrawerHeaderTitle
                    action={<Button appearance="subtle" icon={<DismissRegular />} onClick={onClose} />}
                >
                    {feedback?.email ?? rs.AdminAnonymous}
                </DrawerHeaderTitle>
            </DrawerHeader>
            <DrawerBody className={styles.feedbackPanelBody}>
                <Text className={styles.feedbackDialogMessage}>{feedback?.message}</Text>
                {feedback?.imageUrl && (
                    <img src={feedback.imageUrl} className={styles.feedbackImage} />
                )}
                <Select
                    value={editType}
                    onChange={(_, d) => setEditType(Number(d.value) as FeedbackType)}
                >
                    {Object.values(FeedbackType).map(x => {
                        if (typeof x == "number") {
                            return <option key={x} value={x}>{TAG_LABELS[x as FeedbackType]}</option>;
                        }
                        return null;
                    })}
                </Select>
                <Select value={editStatus} onChange={(_, d) => setEditStatus(d.value as FeedbackStatus)}>
                    {STATUSES.map(s => (
                        <option key={s} value={s}>{STATUS_LABEL[s]}</option>
                    ))}
                </Select>
                <Textarea
                    className={styles.feedbackAnswer}
                    resize="vertical"
                    placeholder={rs.AdminReplyPlaceholder}
                    value={editAnswer}
                    onChange={(_, d) => setEditAnswer(d.value)}
                />
                <Button appearance="primary" disabled={saving} onClick={handleSave}>
                    {saving ? rs.Saving : rs.Save}
                </Button>
            </DrawerBody>
        </OverlayDrawer>
    );
};

// --- Kanban card ---

interface KanbanCardProps {
    feedback: AdminFeedback;
    isNew: boolean;
    onDragStart: () => void;
    onClick: () => void;
}

const KanbanCard: React.FC<KanbanCardProps> = ({ feedback, isNew, onDragStart, onClick }) => {
    const styles = useAdminStyles();
    const rs = useLocalization();
    const dateStr = new Date(feedback.createdAt).toLocaleDateString(rs.DateLocale, {
        day: "numeric",
        month: "short",
    });

    const TAG_LABELS: Record<FeedbackType, string> = {
        [FeedbackType.Unassign]: "",
        [FeedbackType.Feature]: rs.TagFeature,
        [FeedbackType.Bug]: rs.TagBug,
        [FeedbackType.Performance]: rs.Performance,
    };

    const TAG_STYLES: Record<FeedbackType, string> = {
        [FeedbackType.Unassign]: "",
        [FeedbackType.Feature]: styles.kanbanTagFeature,
        [FeedbackType.Bug]: styles.kanbanTagBug,
        [FeedbackType.Performance]: styles.kanbanTagPerformance,
    };

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
                    {!!feedback.type && (
                        <span className={mergeClasses(styles.kanbanTag, TAG_STYLES[feedback.type])}>
                            {TAG_LABELS[feedback.type]}
                        </span>
                    )}
                </div>
            )}
            <span className={styles.kanbanCardMessage}>{feedback.message}</span>
            <div className={styles.kanbanCardFooter}>
                <span className={styles.kanbanCardSource}>
                    <PersonRegular className={styles.kanbanCardSourceIcon} />
                    {feedback.email ?? rs.AdminAnonymous}
                </span>
                <span className={styles.kanbanCardDate}>{dateStr}</span>
            </div>
        </div>
    );
};

// --- Kanban column ---

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

const KanbanColumn: React.FC<KanbanColumnProps> = ({
    status, label, feedbacks, unreadIds, isDragOver,
    onDragOver, onDragLeave, onDrop,
    onCardDragStart, onCardClick, isCollapsed, onToggleCollapse,
}) => {
    const styles = useAdminStyles();

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
                {feedbacks.map(f => (
                    <KanbanCard
                        key={f.id}
                        feedback={f}
                        isNew={unreadIds.has(f.id)}
                        onDragStart={() => onCardDragStart(f.id)}
                        onClick={() => onCardClick(f)}
                    />
                ))}
            </div>
        </div>
    );
};

// --- Main tab ---

export const AdminFeedbacksTab: React.FC = () => {
    const styles = useAdminStyles();
    const rs = useLocalization();
    const { markSeen, getUnreadIds } = useNotificationBadge();
    const unreadIds = getUnreadIds("admin-feedback");
    const [feedbacks, setFeedbacks] = useState<AdminFeedback[]>([]);
    const [loading, setLoading] = useState(true);
    const [selected, setSelected] = useState<AdminFeedback | null>(null);
    const dragId = useRef<string | null>(null);
    const [dragOver, setDragOver] = useState<FeedbackStatus | null>(null);
    const [collapsedColumns, setCollapsedColumns] = useState<Set<FeedbackStatus>>(new Set());

    const toggleCollapse = (status: FeedbackStatus) =>
        setCollapsedColumns(prev => {
            const next = new Set(prev);
            if (next.has(status)) next.delete(status);
            else next.add(status);
            return next;
        });

    const STATUS_LABEL: Record<FeedbackStatus, string> = {
        "New": rs.StatusNew,
        "In Progress": rs.StatusInProgress,
        "Completed": rs.StatusCompleted,
    };

    useEffect(() => {
        getAllFeedbacks()
            .then(setFeedbacks)
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    useEffect(() => {
        const clear = () => { dragId.current = null; setDragOver(null); };
        document.addEventListener("dragend", clear);
        return () => document.removeEventListener("dragend", clear);
    }, []);

    const handleSaved = (id: string, status: FeedbackStatus, answer: string | null, type: FeedbackType) =>
        setFeedbacks(prev => prev.map(f => f.id === id ? { ...f, status, answer, type } : f));

    const handleDrop = async (targetStatus: FeedbackStatus) => {
        setDragOver(null);
        const id = dragId.current;
        dragId.current = null;
        if (!id) return;

        const item = feedbacks.find(f => f.id === id);
        if (!item || item.status === targetStatus) return;

        setFeedbacks(prev => prev.map(f => f.id === id ? { ...f, status: targetStatus } : f));
        try {
            await updateFeedback(id, targetStatus, item.answer ?? null, item.type);
        } catch (e) {
            console.error(e);
            setFeedbacks(prev => prev.map(f => f.id === id ? { ...f, status: item.status } : f));
        }
    };

    if (loading) return <div className={styles.center}><Spinner size="medium" /></div>;

    if (feedbacks.length === 0) {
        return (
            <div className={styles.emptyState}>
                <ChatRegular fontSize={32} />
                <Text>{rs.AdminNoFeedbacks}</Text>
            </div>
        );
    }

    const grouped = STATUSES.reduce<Record<FeedbackStatus, AdminFeedback[]>>(
        (acc, s) => { acc[s] = feedbacks.filter(f => f.status === s); return acc; },
        { "New": [], "In Progress": [], "Completed": [] }
    );

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
                        onCardClick={f => { setSelected(f); markSeen("admin-feedback", f.id); }}
                        onToggleCollapse={() => toggleCollapse(status)}
                    />
                ))}
            </div>

            <EditDrawer
                feedback={selected}
                onClose={() => setSelected(null)}
                onSaved={handleSaved}
            />
        </>
    );
};
