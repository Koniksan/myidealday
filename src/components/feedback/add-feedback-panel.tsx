import { OverlayDrawer, DrawerHeader, DrawerHeaderTitle, Button, DrawerBody, DrawerFooter, Textarea, Spinner } from "@fluentui/react-components";
import React from "react";
import { ArrowLeftRegular, DismissRegular } from "@fluentui/react-icons";
import { useLocalization } from "../../infrastructure/context/locale-context";
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
    const {
        draft,
        setDraft,
        sending,
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
                <Textarea
                    className={styles.textarea}
                    placeholder={rs.FeedbackPlaceholder}
                    value={draft}
                    onChange={(_, d) => setDraft(d.value)}
                    resize="vertical"
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