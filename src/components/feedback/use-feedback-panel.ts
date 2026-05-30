import { useEffect, useState } from "react";
import { createFeedback, getFeedbacks, StoredFeedback, uploadFeedbackImage, useImageUpload, useLocalization, useAuth, useNotification } from "../../infrastructure";

export const useFeedbackPanel = (open: boolean, onClose: () => void, onSuccess?: (feedback: StoredFeedback) => void) => {
    const rs = useLocalization();
    const { user } = useAuth();
    const { notify } = useNotification();

    const { compressedBlob, imagePreview, imageOriginalSize, imageCompressedSize, handleImageSelect, handleRemoveImage } = useImageUpload(1200);
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

    const handleSubmit = async () => {
        if (!draft.trim() || !user) return;
        setSending(true);
        try {
            let imageUrl: string | undefined;
            if (compressedBlob) {
                imageUrl = await uploadFeedbackImage(compressedBlob, user.id);
            }
            const saved = await createFeedback(user.id, draft.trim(), user.email ?? "", imageUrl);
            setDraft("");
            handleRemoveImage();
            onClose();
            onSuccess?.(saved);
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
        handleRemoveImage();
        onClose();
    };

    const prependFeedback = (feedback: StoredFeedback) => setFeedbacks(x => [feedback, ...x]);

    return {
        feedbacks,
        loading,
        composing,
        setComposing,
        draft,
        setDraft,
        sending,
        imagePreview,
        imageOriginalSize,
        imageCompressedSize,
        handleImageSelect,
        handleRemoveImage,
        handleSubmit,
        handleClose,
        prependFeedback,
    };
};
