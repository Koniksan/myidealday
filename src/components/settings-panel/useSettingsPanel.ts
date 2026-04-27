import { useEffect, useRef, useState } from "react";
import { useAuth } from "../../infrastructure/context/auth-context";

interface UseSettingsPanelProps {
    open: boolean;
    onClose: () => void;
}

export const useSettingsPanel = ({ open, onClose }: UseSettingsPanelProps) => {
    const { profile, updateProfile } = useAuth();

    const initialName = profile?.fullName ?? "";
    const initialAvatarUrl: string | null = profile?.avatarUrl ?? null;

    const [displayName, setDisplayName] = useState(initialName);
    const [avatarUrl, setAvatarUrl] = useState<string | null>(initialAvatarUrl);
    const [pendingFile, setPendingFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (!open) return;
        setDisplayName(initialName);
        setAvatarUrl(initialAvatarUrl);
        setPendingFile(null);
        setPreviewUrl(null);
        setError(null);
    }, [open]);

    useEffect(() => {
        if (!pendingFile) {
            setPreviewUrl(null);
            return;
        }
        const url = URL.createObjectURL(pendingFile);
        setPreviewUrl(url);
        return () => URL.revokeObjectURL(url);
    }, [pendingFile]);

    const displayedAvatar = previewUrl ?? avatarUrl ?? undefined;

    const hasChanges =
        displayName.trim() !== initialName ||
        pendingFile !== null ||
        avatarUrl !== initialAvatarUrl;

    const pickPhoto = () => fileInputRef.current?.click();

    const handleFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        e.target.value = "";
        if (!file) return;
        if (!file.type.startsWith("image/")) {
            setError("Please choose an image file.");
            return;
        }
        setError(null);
        setPendingFile(file);
    };

    const removePhoto = () => {
        setPendingFile(null);
        setAvatarUrl(null);
    };

    const save = async () => {
        if (saving) return;
        setSaving(true);
        setError(null);

        try {
            const trimmedName = displayName.trim();
            const errMsg = await updateProfile({
                ...(trimmedName !== initialName && { fullName: trimmedName }),
                ...(pendingFile ? { avatarFile: pendingFile } : avatarUrl !== initialAvatarUrl && { avatarUrl }),
            });

            if (errMsg) {
                setError(errMsg);
                return;
            }
            onClose();
        } catch (e) {
            setError(e instanceof Error ? e.message : "Failed to save profile");
        } finally {
            setSaving(false);
        }
    };

    const cancel = () => {
        if (saving) return;
        onClose();
    };

    return {
        displayName,
        setDisplayName,
        displayedAvatar,
        hasPhoto: Boolean(displayedAvatar),
        pickPhoto,
        removePhoto,
        handleFileSelected,
        fileInputRef,
        save,
        cancel,
        saving,
        error,
        hasChanges,
    };
};
