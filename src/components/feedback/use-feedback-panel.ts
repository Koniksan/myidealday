import { useEffect, useState } from "react";
import { compressImage, createFeedback, deleteFeedback, getFeedbacks, StoredFeedback, uploadFeedbackImage, useLocalization, useAuth, useNotification } from "../../infrastructure";

export const useFeedbackPanel = (open: boolean, onClose: () => void, onSuccess?: (feedback: StoredFeedback) => void) => {
    const rs = useLocalization();
    const { user } = useAuth();
    const { notify } = useNotification();

    const [feedbacks, setFeedbacks] = useState<StoredFeedback[]>([]);
    const [loading, setLoading] = useState(false);
    const [composing, setComposing] = useState(false);
    const [draft, setDraft] = useState("");
    const [sending, setSending] = useState(false);
    const [compressedBlob, setCompressedBlob] = useState<Blob | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [imageOriginalSize, setImageOriginalSize] = useState<number | null>(null);
    const [imageCompressedSize, setImageCompressedSize] = useState<number | null>(null);

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

    const handleImageSelect = async (file: File) => {
        if (imagePreview) URL.revokeObjectURL(imagePreview);
        const blob = await compressImage(file);
        setCompressedBlob(blob);
        setImagePreview(URL.createObjectURL(blob));
        setImageOriginalSize(file.size);
        setImageCompressedSize(blob.size);
    };

    const handleRemoveImage = () => {
        if (imagePreview) URL.revokeObjectURL(imagePreview);
        setCompressedBlob(null);
        setImagePreview(null);
        setImageOriginalSize(null);
        setImageCompressedSize(null);
    };

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
        handleDelete,
        handleSubmit,
        handleClose,
        prependFeedback,
    };
};
