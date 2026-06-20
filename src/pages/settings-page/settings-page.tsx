import { Avatar, Button, Input, Switch, Text } from "@fluentui/react-components";
import { CheckmarkRegular, CropRegular, DeleteRegular, ImageAddRegular } from "@fluentui/react-icons";
import React, { useEffect, useRef, useState } from "react";
import { AvatarCropper } from "../../components/common";
import { FlagRU, FlagUS } from "../../components/common/language-switcher/language-switcher-icon-list";
import { PageLayout } from "../../components/common/page-layout";
import { PageShell, usePageShellStyles } from "../../components/common/page-shell";
import { useAuth } from "../../infrastructure/context/auth-context";
import { useLocale, useLocalization } from "../../infrastructure/context/locale-context";
import { useTheme } from "../../infrastructure/context/theme-context";
import { useSettingsPageStyles } from "./settings-page-styles";

export const SettingsPage: React.FC = () => {
    const styles = useSettingsPageStyles();
    const shell = usePageShellStyles();
    const { profile, updateProfile } = useAuth();
    const rs = useLocalization();
    const { isDark, toggleTheme } = useTheme();
    const { locale, setLocale } = useLocale();

    const [displayName, setDisplayName] = useState("");
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
    const [pendingFile, setPendingFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [originalSrc, setOriginalSrc] = useState<string | null>(null);
    const [cropSrc, setCropSrc] = useState<string | null>(null);
    const [editLoading, setEditLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const profileInitialized = useRef(false);

    useEffect(() => {
        if (!profile) return;
        if (!profileInitialized.current) {
            profileInitialized.current = true;
            setDisplayName(profile.fullName ?? "");
            setAvatarUrl(profile.avatarUrl ?? null);
        } else if (!pendingFile && !originalSrc) {
            setAvatarUrl(profile.avatarUrl ?? null);
        }
    }, [profile, pendingFile, originalSrc]);

    useEffect(() => {
        if (!pendingFile) { setPreviewUrl(null); return; }
        const url = URL.createObjectURL(pendingFile);
        setPreviewUrl(url);
        return () => URL.revokeObjectURL(url);
    }, [pendingFile]);

    const displayedAvatar = previewUrl ?? avatarUrl ?? undefined;
    const savedName = profile?.fullName ?? "";
    const savedAvatarUrl = profile?.avatarUrl ?? null;
    const hasChanges = displayName.trim() !== savedName || pendingFile !== null || avatarUrl !== savedAvatarUrl;

    const pickPhoto = () => fileInputRef.current?.click();

    const handleFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        e.target.value = "";
        if (!file) return;
        if (!file.type.startsWith("image/")) { setError("Please choose an image file."); return; }
        setError(null);
        if (originalSrc) URL.revokeObjectURL(originalSrc);
        const src = URL.createObjectURL(file);
        setOriginalSrc(src);
        setCropSrc(src);
    };

    const handleCropConfirm = (blob: Blob) => {
        const file = new File([blob], "avatar.jpg", { type: "image/jpeg" });
        setPendingFile(file);
        setCropSrc(null);
    };

    const handleCropCancel = () => setCropSrc(null);

    const handleEditPhoto = async () => {
        if (originalSrc) { setCropSrc(originalSrc); return; }
        if (!avatarUrl) return;
        setEditLoading(true);
        try {
            const res = await fetch(avatarUrl);
            const blob = await res.blob();
            const src = URL.createObjectURL(blob);
            setOriginalSrc(src);
            setCropSrc(src);
        } finally {
            setEditLoading(false);
        }
    };

    const removePhoto = () => {
        if (originalSrc) URL.revokeObjectURL(originalSrc);
        setOriginalSrc(null);
        setCropSrc(null);
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
                ...(trimmedName !== savedName && { fullName: trimmedName }),
                ...(pendingFile ? { avatarFile: pendingFile } : avatarUrl !== savedAvatarUrl && { avatarUrl }),
            });
            if (errMsg) { setError(errMsg); return; }
            setPendingFile(null);
            if (originalSrc) URL.revokeObjectURL(originalSrc);
            setOriginalSrc(null);
        } catch (e) {
            setError(e instanceof Error ? e.message : "Failed to save profile");
        } finally {
            setSaving(false);
        }
    };

    return (
        <PageLayout>
            <PageShell>

                <Text className={shell.sectionLabel}>{rs.Profile}</Text>
                <div className={shell.card}>
                    <div className={styles.profileSection}>
                        <Avatar
                            name={displayName || undefined}
                            image={displayedAvatar ? { src: displayedAvatar } : undefined}
                            color="colorful"
                            size={96}
                        />
                        <input
                            ref={fileInputRef}
                            className={styles.hiddenInput}
                            type="file"
                            accept="image/*"
                            onChange={handleFileSelected}
                        />
                        <div className={styles.avatarButtons}>
                            <Button appearance="secondary" icon={<ImageAddRegular />} onClick={pickPhoto} disabled={saving}>
                                {displayedAvatar ? rs.ChangePhoto : rs.AddPhoto}
                            </Button>
                            {displayedAvatar && (
                                <Button appearance="subtle" icon={<CropRegular />} onClick={handleEditPhoto} disabled={saving || editLoading}>
                                    {rs.Edit}
                                </Button>
                            )}
                            {displayedAvatar && (
                                <Button appearance="subtle" icon={<DeleteRegular />} onClick={removePhoto} disabled={saving}>
                                    {rs.Remove}
                                </Button>
                            )}
                        </div>
                    </div>

                    <div className={styles.profileFields}>
                        <div className={styles.field}>
                            <label className={styles.fieldLabel} htmlFor="settings-display-name">{rs.DisplayName}</label>
                            <Input
                                id="settings-display-name"
                                className={styles.input}
                                value={displayName}
                                onChange={(_, d) => setDisplayName(d.value)}
                                disabled={saving}
                                placeholder={rs.YourName}
                            />
                        </div>
                        {error && <div className={styles.error} role="alert">{error}</div>}
                        <Button
                            className={styles.saveButton}
                            appearance="primary"
                            onClick={save}
                            disabled={!hasChanges || saving}
                        >
                            {saving ? rs.Saving : rs.Save}
                        </Button>
                    </div>
                </div>

                <Text className={shell.sectionLabel}>{rs.Appearance}</Text>
                <div className={shell.card}>
                    <div className={styles.themeRow}>
                        <Switch
                            className={styles.themeSwitch}
                            checked={isDark}
                            onChange={toggleTheme}
                            label={rs.DarkMode}
                            labelPosition="before"
                        />
                    </div>
                </div>

                <Text className={shell.sectionLabel}>{rs.Language}</Text>
                <div className={shell.card}>
                    <button className={shell.row} onClick={() => setLocale("en")}>
                        <FlagUS />
                        <span className={shell.rowLabel}>{rs.English}</span>
                        {locale === "en" && <CheckmarkRegular className={styles.checkmark} />}
                    </button>
                    <button className={shell.row} onClick={() => setLocale("ru")}>
                        <FlagRU />
                        <span className={shell.rowLabel}>{rs.Russian}</span>
                        {locale === "ru" && <CheckmarkRegular className={styles.checkmark} />}
                    </button>
                </div>

            </PageShell>
            {cropSrc && (
                <AvatarCropper
                    imageSrc={cropSrc}
                    onConfirm={handleCropConfirm}
                    onClose={handleCropCancel}
                />
            )}
        </PageLayout>
    );
};
