import { useEffect, useState } from "react";
import { useAuth } from "../../infrastructure/context/auth-context";
import { useLocalization } from "../../infrastructure/context/locale-context";
import { useNotification } from "../../infrastructure/context/notification-context";
import { createFeedback, deleteFeedback, getFeedbacks, StoredFeedback } from "../../infrastructure/storages/feedback-storage";

export const useFeedbackPanel = (open: boolean, onClose: () => void) => {
    const rs = useLocalization();
    const { user } = useAuth();
    const { notify } = useNotification();

    const [feedbacks, setFeedbacks] = useState<StoredFeedback[]>([]);
    const [loading, setLoading] = useState(false);
    const [composing, setComposing] = useState(false);
    const [draft, setDraft] = useState("");
    const [sending, setSending] = useState(false);

    useEffect(() => {
        if (!open || !user) return;
        setLoading(true);
        getFeedbacks(user.id)
            .then(setFeedbacks)
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [open, user]);

    const handleDelete = (id: string) => {
        setFeedbacks(prev => prev.filter(f => f.id !== id));
        deleteFeedback(id).catch(console.error);
    };

    const handleSubmit = async () => {
        if (!draft.trim() || !user) return;
        setSending(true);
        try {
            const saved = await createFeedback(user.id, draft.trim(), user.email ?? "");
            setFeedbacks(prev => [saved, ...prev]);
            setDraft("");
            setComposing(false);
            notify(rs.FeedbackSent);
        } catch {
            // no-op
        } finally {
            setSending(false);
        }
    };

    const handleClose = () => {
        setComposing(false);
        setDraft("");
        onClose();
    };

    return {
        feedbacks,
        loading,
        composing,
        setComposing,
        draft,
        setDraft,
        sending,
        handleDelete,
        handleSubmit,
        handleClose,
    };
};
