import {
    Button,
    DrawerBody, DrawerHeader, DrawerHeaderTitle,
    OverlayDrawer,
    Spinner,
    Text,
    Textarea,
    Toast, ToastTitle,
    useToastController,
} from "@fluentui/react-components";
import { AddRegular, ArrowLeftRegular, ChatRegular, DismissRegular } from "@fluentui/react-icons";
import React, { useEffect, useState } from "react";
import { useAuth } from "../../infrastructure/context/auth-context";
import { createFeedback, deleteFeedback, getFeedbacks, StoredFeedback } from "../../infrastructure/storages/feedback-storage";
import { FeedbackItem } from "./feedback-item";
import { useFeedbackPanelStyles } from "./feedback-panel-styles";

interface FeedbackPanelProps {
    open: boolean;
    onClose: () => void;
}

export const FeedbackPanel: React.FC<FeedbackPanelProps> = ({ open, onClose }) => {
    const styles = useFeedbackPanelStyles();
    const { user } = useAuth();
    const { dispatchToast } = useToastController("app");

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
            dispatchToast(
                <Toast>
                    <ToastTitle>Feedback sent successfully!</ToastTitle>
                </Toast>,
                { intent: "success" },
            );
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

    return (
        <>
            <OverlayDrawer position="end" open={open} onOpenChange={(_, { open: isOpen }) => !isOpen && handleClose()}>
                <DrawerHeader>
                    <DrawerHeaderTitle
                        action={<Button appearance="subtle" icon={<DismissRegular />} onClick={handleClose} />}
                    >
                        My feedbacks
                    </DrawerHeaderTitle>
                </DrawerHeader>
                <DrawerBody className={styles.body}>
                    <Button appearance="primary" icon={<AddRegular />} onClick={() => setComposing(true)}>
                        New feedback
                    </Button>

                    {loading ? (
                        <div className={styles.center}><Spinner size="medium" /></div>
                    ) : feedbacks.length === 0 ? (
                        <div className={styles.emptyState}>
                            <ChatRegular fontSize={32} />
                            <Text>No feedback yet</Text>
                        </div>
                    ) : (
                        <div className={styles.list}>
                            {feedbacks.map(f => (
                                <FeedbackItem key={f.id} feedback={f} onDelete={handleDelete} />
                            ))}
                        </div>
                    )}
                </DrawerBody>
            </OverlayDrawer>

            <OverlayDrawer position="end" open={composing} onOpenChange={(_, { open: isOpen }) => !isOpen && setComposing(false)}>
                <DrawerHeader>
                    <DrawerHeaderTitle
                        action={<Button appearance="subtle" icon={<DismissRegular />} onClick={() => setComposing(false)} />}
                    >
                        <Button appearance="subtle" icon={<ArrowLeftRegular />} onClick={() => setComposing(false)} />
                        New feedback
                    </DrawerHeaderTitle>
                </DrawerHeader>
                <DrawerBody className={styles.composeBody}>
                    <Textarea
                        className={styles.textarea}
                        placeholder="Share your thoughts..."
                        value={draft}
                        onChange={(_, d) => setDraft(d.value)}
                        resize="vertical"
                    />
                    <Button
                        appearance="primary"
                        disabled={!draft.trim() || sending}
                        icon={sending ? <Spinner size="tiny" /> : undefined}
                        onClick={handleSubmit}
                    >
                        Send
                    </Button>
                </DrawerBody>
            </OverlayDrawer>
        </>
    );
};
