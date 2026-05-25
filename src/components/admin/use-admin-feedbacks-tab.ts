import { useEffect, useRef, useState } from "react";
import { AdminFeedback, FeedbackStatus, FeedbackType, getAllFeedbacks, updateFeedback, useLocalization } from "../../infrastructure";
import { useNotificationBadge } from "../../infrastructure/context/notification-badge-context";

export const STATUSES: FeedbackStatus[] = ["New", "In Progress", "Completed"];

export const useAdminFeedbacksTab = () => {
    const rs = useLocalization();
    const { markSeen, getUnreadIds } = useNotificationBadge();
    const unreadIds = getUnreadIds("admin-feedback");
    const [feedbacks, setFeedbacks] = useState<AdminFeedback[]>([]);
    const [loading, setLoading] = useState(true);
    const [selected, setSelected] = useState<AdminFeedback | null>(null);
    const dragId = useRef<string | null>(null);
    const [dragOver, setDragOver] = useState<FeedbackStatus | null>(null);
    const [collapsedColumns, setCollapsedColumns] = useState<Set<FeedbackStatus>>(new Set());

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

    const toggleCollapse = (status: FeedbackStatus) =>
        setCollapsedColumns(prev => {
            const next = new Set(prev);
            if (next.has(status)) next.delete(status);
            else next.add(status);
            return next;
        });

    const handleSaved = (id: string, status: FeedbackStatus, answer: string | null, type: FeedbackType) =>
        setFeedbacks(prev => prev.map(x => x.id === id ? { ...x, status, answer, type } : x));

    const handleDrop = async (targetStatus: FeedbackStatus) => {
        setDragOver(null);
        const id = dragId.current;
        dragId.current = null;
        if (!id) return;

        const item = feedbacks.find(x => x.id === id);
        if (!item || item.status === targetStatus) return;

        setFeedbacks(prev => prev.map(x => x.id === id ? { ...x, status: targetStatus } : x));
        try {
            await updateFeedback(id, targetStatus, item.answer ?? null, item.type);
        } catch (e) {
            console.error(e);
            setFeedbacks(prev => prev.map(x => x.id === id ? { ...x, status: item.status } : x));
        }
    };

    const grouped = STATUSES.reduce<Record<FeedbackStatus, AdminFeedback[]>>(
        (acc, s) => { acc[s] = feedbacks.filter(x => x.status === s); return acc; },
        { "New": [], "In Progress": [], "Completed": [] }
    );

    return {
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
    };
};
