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
import React from "react";
import { useLocalization } from "../../infrastructure/context/locale-context";
import { useSettingsPanelStyles } from "./settings-panel-styles";
import { useSettingsPanel } from "./useSettingsPanel";

interface SettingsPanelProps {
    open: boolean;
    onClose: () => void;
}

export const SettingsPanel: React.FC<SettingsPanelProps> = ({ open, onClose }) => {
    const styles = useSettingsPanelStyles();
    const rs = useLocalization();
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
            position="end"
            size="small"
        >
            <DrawerHeader>
                <DrawerHeaderTitle
                    action={
                        <Button
                            appearance="subtle"
                            icon={<DismissRegular />}
                            aria-label={rs.Close}
                            onClick={cancel}
                            disabled={saving}
                        />
                    }
                >
                    {rs.Settings}
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
                            {hasPhoto ? rs.ChangePhoto : rs.AddPhoto}
                        </Button>
                        {hasPhoto && (
                            <Button
                                appearance="subtle"
                                icon={<DeleteRegular />}
                                onClick={removePhoto}
                                disabled={saving}
                            >
                                {rs.Remove}
                            </Button>
                        )}
                    </div>
                </div>

                <div className={styles.field}>
                    <label className={styles.label} htmlFor="settings-display-name">{rs.DisplayName}</label>
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
            </DrawerBody>

            <DrawerFooter className={styles.footer}>
                <Button appearance="secondary" onClick={cancel} disabled={saving}>{rs.Cancel}</Button>
                <Button
                    appearance="primary"
                    onClick={save}
                    disabled={!hasChanges || saving}
                >
                    {saving ? rs.Saving : rs.Save}
                </Button>
            </DrawerFooter>
        </OverlayDrawer>
    );
};
