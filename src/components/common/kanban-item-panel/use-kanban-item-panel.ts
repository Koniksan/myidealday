import { useEffect, useRef, useState } from "react";
import { AdminFeedback, FeedbackStatus, FeedbackType, createFeedback, updateFeedback, uploadFeedbackImage, useAuthSession, useImageUpload, useLocalization } from "../../../infrastructure";

interface KanbanItemPanelEditProps {
    mode: 'Edit';
    feedback: AdminFeedback | null;
    onClose: () => void;
    onSaved: (id: string, status: FeedbackStatus, answer: string | null, type: FeedbackType) => void;
}

interface KanbanItemPanelCreateProps {
    mode: 'Create';
    open: boolean;
    onClose: () => void;
    onCreated: (feedback: AdminFeedback) => void;
}

export type KanbanItemPanelProps = KanbanItemPanelEditProps | KanbanItemPanelCreateProps;

export const useKanbanItemPanel = (props: KanbanItemPanelProps) => {
    const { mode, onClose } = props;
    const rs = useLocalization();
    const { user } = useAuthSession();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { compressedBlob, imagePreview, imageOriginalSize, imageCompressedSize, handleImageSelect, handleRemoveImage } = useImageUpload(1200);
    const [editStatus, setEditStatus] = useState<FeedbackStatus>("New");
    const [editType, setEditType] = useState<FeedbackType>(FeedbackType.Unassign);
    const [editAnswer, setEditAnswer] = useState("");
    const [editMessage, setEditMessage] = useState("");
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (mode === 'Edit' && props.feedback) {
            setEditStatus(props.feedback.status);
            setEditType(props.feedback.type ?? FeedbackType.Unassign);
            setEditAnswer(props.feedback.answer ?? "");
        }
    }, [mode === 'Edit' ? props.feedback?.id : undefined]);

    useEffect(() => {
        if (mode === 'Create' && props.open) {
            setEditMessage("");
            setEditStatus("New");
            setEditType(FeedbackType.Unassign);
            handleRemoveImage();
        }
    }, [mode === 'Create' ? props.open : undefined]);

    const handleSave = async () => {
        setSaving(true);
        try {
            if (mode === 'Edit') {
                if (!props.feedback) return;
                const type = editType === FeedbackType.Unassign ? null : editType;
                await updateFeedback(props.feedback.id, editStatus, editAnswer || null, type);
                props.onSaved(props.feedback.id, editStatus, editAnswer || null, editType);
            } else {
                const type = editType === FeedbackType.Unassign ? null : editType;
                let uploadedImageUrl: string | undefined;
                if (compressedBlob) {
                    uploadedImageUrl = await uploadFeedbackImage(compressedBlob, user!.id);
                }
                const stored = await createFeedback(user!.id, editMessage, user!.email ?? "", uploadedImageUrl);
                await updateFeedback(stored.id, editStatus, null, type);
                props.onCreated({
                    id: stored.id,
                    userId: user!.id,
                    email: user!.email ?? null,
                    message: stored.message,
                    status: editStatus,
                    answer: null,
                    createdAt: stored.created_at,
                    type,
                    imageUrl: uploadedImageUrl ?? null,
                    avatarUrl: null,
                    displayName: null,
                });
            }
            onClose();
        } catch (e) {
            console.error(e);
        } finally {
            setSaving(false);
        }
    };

    const isOpen = mode === 'Edit' ? !!props.feedback : props.open;
    const titleText = mode === 'Edit'
        ? (props.feedback?.displayName ?? props.feedback?.email ?? rs.AdminAnonymous)
        : rs.AddCard;

    return {
        rs,
        fileInputRef,
        editStatus,
        editType,
        editAnswer,
        editMessage,
        imagePreview,
        imageOriginalSize,
        imageCompressedSize,
        saving,
        isOpen,
        titleText,
        setEditStatus,
        setEditType,
        setEditAnswer,
        setEditMessage,
        handleImageSelect,
        handleRemoveImage,
        handleSave,
    };
};
