import {
    Avatar,
    Button,
    DrawerBody,
    DrawerFooter,
    DrawerHeader,
    DrawerHeaderTitle,
    Input,
    OverlayDrawer,
} from "@fluentui/react-components";
import { DeleteRegular, DismissRegular, ImageAddRegular } from "@fluentui/react-icons";
import React, { useState } from "react";
import { useSettingsPanelStyles } from "./settings-panel-styles";
import { useSettingsPanel } from "./useSettingsPanel";

interface SettingsPanelProps {
    open: boolean;
    onClose: () => void;
}

export const SettingsPanel: React.FC<SettingsPanelProps> = ({ open, onClose }) => {
    const styles = useSettingsPanelStyles();
    const [isMobile] = useState(() => window.matchMedia("(max-width: 480px)").matches);
    const {
        displayName,
        setDisplayName,
        displayedAvatar,
        hasPhoto,
        pickPhoto,
        removePhoto,
        handleFileSelected,
        fileInputRef,
        save,
        cancel,
        saving,
        error,
        hasChanges,
    } = useSettingsPanel({ open, onClose });

    return (
        <OverlayDrawer
            open={open}
            onOpenChange={(_, d) => !d.open && cancel()}
            position={isMobile ? "bottom" : "end"}
            size={isMobile ? "full" : "small"}
        >
            <DrawerHeader>
                <DrawerHeaderTitle
                    action={
                        <Button
                            appearance="subtle"
                            icon={<DismissRegular />}
                            aria-label="Close"
                            onClick={cancel}
                            disabled={saving}
                        />
                    }
                >
                    Settings
                </DrawerHeaderTitle>
            </DrawerHeader>

            <DrawerBody className={styles.body}>
                <div className={styles.avatarRow}>
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
                        <Button
                            appearance="secondary"
                            icon={<ImageAddRegular />}
                            onClick={pickPhoto}
                            disabled={saving}
                        >
                            {hasPhoto ? "Change photo" : "Add photo"}
                        </Button>
                        {hasPhoto && (
                            <Button
                                appearance="subtle"
                                icon={<DeleteRegular />}
                                onClick={removePhoto}
                                disabled={saving}
                            >
                                Remove
                            </Button>
                        )}
                    </div>
                </div>

                <div className={styles.field}>
                    <label className={styles.label} htmlFor="settings-display-name">Display name</label>
                    <Input
                        id="settings-display-name"
                        className={styles.input}
                        value={displayName}
                        onChange={(_, d) => setDisplayName(d.value)}
                        disabled={saving}
                        placeholder="Your name"
                    />
                </div>

                {error && <div className={styles.error} role="alert">{error}</div>}
            </DrawerBody>

            <DrawerFooter className={styles.footer}>
                <Button appearance="secondary" onClick={cancel} disabled={saving}>Cancel</Button>
                <Button
                    appearance="primary"
                    onClick={save}
                    disabled={!hasChanges || saving}
                >
                    {saving ? "Saving..." : "Save"}
                </Button>
            </DrawerFooter>
        </OverlayDrawer>
    );
};
