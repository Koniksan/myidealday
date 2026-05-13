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
import { ChatRegular, DismissRegular } from "@fluentui/react-icons";
import React, { useEffect, useRef, useState } from "react";
import { useLocalization } from "../../infrastructure/context/locale-context";
import { AdminFeedback, FeedbackTag, getAllFeedbacks, setFeedbackTag, updateFeedback } from "../../infrastructure/storages/admin-storage";
import { useNotificationBadge } from "../../infrastructure/context/notification-badge-context";
import { FeedbackStatus } from "../../infrastructure/storages/feedback-storage";
import { useAdminPanelStyles } from "./admin-panel-styles";

const STATUSES: FeedbackStatus[] = ["New", "In Progress", "Completed"];

const DOT_COLOR: Record<FeedbackStatus, string> = {
    "New": "#0078d4",
    "In Progress": "#d97706",
    "Completed": "#16a34a",
};

// --- Edit drawer ---

const TAGS: (FeedbackTag | "")[] = ["", "Feature", "Bug"];

interface EditDrawerProps {
    feedback: AdminFeedback | null;
    onClose: () => void;
    onSaved: (id: string, status: FeedbackStatus, answer: string | null, tag: FeedbackTag | null) => void;
}

const EditDrawer: React.FC<EditDrawerProps> = ({ feedback, onClose, onSaved }) => {
    const styles = useAdminPanelStyles();
    const rs = useLocalization();
    const [editStatus, setEditStatus] = useState<FeedbackStatus>("New");
    const [editTag, setEditTag] = useState<FeedbackTag | "">("");
    const [editAnswer, setEditAnswer] = useState("");
    const [saving, setSaving] = useState(false);

    const STATUS_LABEL: Record<FeedbackStatus, string> = {
        "New": rs.StatusNew,
        "In Progress": rs.StatusInProgress,
        "Completed": rs.StatusCompleted,
    };

    const TAG_LABEL: Record<FeedbackTag | "", string> = {
        "": "—",
        "Feature": rs.TagFeature,
        "Bug": rs.TagBug,
    };

    useEffect(() => {
        if (feedback) {
            setEditStatus(feedback.status);
            setEditTag(feedback.tag ?? "");
            setEditAnswer(feedback.answer ?? "");
        }
    }, [feedback?.id]);

    const handleSave = async () => {
        if (!feedback) return;
        setSaving(true);
        try {
            const tag = editTag || null;
            await updateFeedback(feedback.id, editStatus, editAnswer || null);
            setFeedbackTag(feedback.id, tag);
            onSaved(feedback.id, editStatus, editAnswer || null, tag);
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
                <Select
                    value={editTag}
                    onChange={(_, d) => setEditTag(d.value as FeedbackTag | "")}
                >
                    {TAGS.map(t => (
                        <option key={t} value={t}>{TAG_LABEL[t]}</option>
                    ))}
                </Select>
                <Select value={editStatus} onChange={(_, d) => setEditStatus(d.value as FeedbackStatus)}>
                    {STATUSES.map(s => (
                        <option key={s} value={s}>{STATUS_LABEL[s]}</option>
                    ))}
                </Select>
                <Textarea
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
    onDragStart: () => void;
    onClick: () => void;
}

const KanbanCard: React.FC<KanbanCardProps> = ({ feedback, onDragStart, onClick }) => {
    const styles = useAdminPanelStyles();
    const rs = useLocalization();
    const dateStr = new Date(feedback.createdAt).toLocaleDateString(rs.DateLocale, {
        day: "numeric",
        month: "short",
    });

    const TAG_LABEL: Record<string, string> = {
        Feature: rs.TagFeature,
        Bug: rs.TagBug,
    };

    return (
        <div
            className={styles.kanbanCard}
            draggable
            onDragStart={onDragStart}
            onClick={onClick}
        >
            <div className={styles.kanbanCardHeader}>
                <span className={styles.kanbanCardEmail}>
                    {feedback.email ?? rs.AdminAnonymous}
                </span>
                <span className={styles.kanbanCardDate}>{dateStr}</span>
            </div>
            <span className={styles.kanbanCardMessage}>{feedback.message}</span>
            {(feedback.tag || feedback.answer) && (
                <div className={styles.kanbanCardFooter}>
                    {feedback.tag && (
                        <span className={mergeClasses(
                            styles.kanbanTag,
                            feedback.tag === "Feature" && styles.kanbanTagFeature,
                            feedback.tag === "Bug" && styles.kanbanTagBug,
                        )}>
                            {TAG_LABEL[feedback.tag]}
                        </span>
                    )}
                    {feedback.answer && (
                        <span className={styles.kanbanCardReplyBadge}>{rs.AdminReply}</span>
                    )}
                </div>
            )}
        </div>
    );
};

// --- Kanban column ---

interface KanbanColumnProps {
    status: FeedbackStatus;
    label: string;
    feedbacks: AdminFeedback[];
    isDragOver: boolean;
    onDragOver: (e: React.DragEvent) => void;
    onDragLeave: (e: React.DragEvent) => void;
    onDrop: () => void;
    onCardDragStart: (id: string) => void;
    onCardClick: (feedback: AdminFeedback) => void;
}

const KanbanColumn: React.FC<KanbanColumnProps> = ({
    status, label, feedbacks, isDragOver,
    onDragOver, onDragLeave, onDrop,
    onCardDragStart, onCardClick,
}) => {
    const styles = useAdminPanelStyles();

    return (
        <div
            className={mergeClasses(styles.kanbanColumn, isDragOver && styles.kanbanColumnDragOver)}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
        >
            <div className={styles.kanbanColumnHeader}>
                <span className={styles.kanbanDot} style={{ backgroundColor: DOT_COLOR[status] }} />
                <span className={styles.kanbanColumnTitle}>{label}</span>
                <span className={styles.kanbanColumnCount}>{feedbacks.length}</span>
            </div>
            <div className={styles.kanbanCards}>
                {feedbacks.map(f => (
                    <KanbanCard
                        key={f.id}
                        feedback={f}
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
    const styles = useAdminPanelStyles();
    const rs = useLocalization();
    const { markSeen } = useNotificationBadge();
    const [feedbacks, setFeedbacks] = useState<AdminFeedback[]>([]);
    const [loading, setLoading] = useState(true);
    const [selected, setSelected] = useState<AdminFeedback | null>(null);
    const dragId = useRef<string | null>(null);
    const [dragOver, setDragOver] = useState<FeedbackStatus | null>(null);

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

    const handleSaved = (id: string, status: FeedbackStatus, answer: string | null, tag: FeedbackTag | null) =>
        setFeedbacks(prev => prev.map(f => f.id === id ? { ...f, status, answer, tag } : f));

    const handleDrop = async (targetStatus: FeedbackStatus) => {
        setDragOver(null);
        const id = dragId.current;
        dragId.current = null;
        if (!id) return;

        const item = feedbacks.find(f => f.id === id);
        if (!item || item.status === targetStatus) return;

        setFeedbacks(prev => prev.map(f => f.id === id ? { ...f, status: targetStatus } : f));
        try {
            await updateFeedback(id, targetStatus, item.answer ?? null);
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
            <div className={styles.kanbanBoard}>
                {STATUSES.map(status => (
                    <KanbanColumn
                        key={status}
                        status={status}
                        label={STATUS_LABEL[status]}
                        feedbacks={grouped[status]}
                        isDragOver={dragOver === status}
                        onDragOver={e => { e.preventDefault(); setDragOver(status); }}
                        onDragLeave={e => {
                            if (!e.currentTarget.contains(e.relatedTarget as Node)) setDragOver(null);
                        }}
                        onDrop={() => handleDrop(status)}
                        onCardDragStart={id => { dragId.current = id; }}
                        onCardClick={f => { setSelected(f); markSeen("admin-feedback", f.id); }}
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
