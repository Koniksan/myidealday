import { OverlayDrawer, DrawerHeader, DrawerHeaderTitle, Button, DrawerBody, DrawerFooter, Textarea, Spinner, Text, Tooltip } from "@fluentui/react-components";
import React, { useRef } from "react";
import { ArrowLeftRegular, DismissRegular, Image24Regular } from "@fluentui/react-icons";
import { useLocalization } from "../../infrastructure";
import { ImageUploadPreview } from "../common";
import { useFeedbackPanelStyles } from "./feedback-panel-styles";
import { useFeedbackPanel } from "./use-feedback-panel";
import { StoredFeedback } from "../../infrastructure/storages/feedback-storage";

interface Props {
    open: boolean;
    onClose: () => void;
    onSuccess: (feedback: StoredFeedback) => void;
}

export const AddFeedbackPanel: React.FC<Props> = ({ open, onClose, onSuccess }) => {
    const styles = useFeedbackPanelStyles();
    const rs = useLocalization();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const {
        draft,
        setDraft,
        sending,
        imagePreview,
        imageOriginalSize,
        imageCompressedSize,
        handleImageSelect,
        handleRemoveImage,
        handleSubmit,
    } = useFeedbackPanel(open, onClose, onSuccess);

    return (
        <OverlayDrawer size="medium" position="end" open={open} onOpenChange={(_, { open: isOpen }) => !isOpen && onClose()}>
            <DrawerHeader>
                <DrawerHeaderTitle
                    action={<Button appearance="subtle" icon={<DismissRegular />} onClick={onClose} />}
                >
                    <Button appearance="subtle" icon={<ArrowLeftRegular />} onClick={onClose} />
                    {rs.NewFeedback}
                </DrawerHeaderTitle>
            </DrawerHeader>
            <DrawerBody className={styles.composeBody}>
                <Text className={styles.feedbackDescription}>{rs.FeedbackDescription}</Text>
                <div className={styles.textareaWrapper}>
                    <Textarea
                        className={styles.textarea}
                        placeholder={rs.FeedbackPlaceholder}
                        value={draft}
                        onChange={(_, d) => setDraft(d.value)}
                        resize="vertical"
                        appearance="outline"
                    />
                    <div className={styles.textareaToolbar}>
                        <Tooltip content={rs.AttachImage} relationship="label">
                            <Button
                                appearance="subtle"
                                size="large"
                                icon={<Image24Regular />}
                                onClick={() => fileInputRef.current?.click()}
                                disabled={sending}
                            />
                        </Tooltip>
                    </div>
                </div>
                {imagePreview && (
                    <ImageUploadPreview
                        imagePreview={imagePreview}
                        imageOriginalSize={imageOriginalSize}
                        imageCompressedSize={imageCompressedSize}
                        onRemove={handleRemoveImage}
                    />
                )}
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={e => { const f = e.target.files?.[0]; if (f) handleImageSelect(f); e.target.value = ""; }}
                />
            </DrawerBody>
            <DrawerFooter>
                <Button
                    appearance="primary"
                    disabled={!draft.trim() || sending}
                    icon={sending ? <Spinner size="tiny" /> : undefined}
                    onClick={handleSubmit}
                >
                    {rs.Send}
                </Button>
                <Button appearance="secondary" onClick={onClose}>
                    {rs.Cancel}
                </Button>
            </DrawerFooter>
        </OverlayDrawer>
    );
};
