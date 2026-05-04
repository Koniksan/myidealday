import {
    Badge,
    Button,
    Dialog, DialogActions, DialogBody, DialogContent, DialogSurface, DialogTitle, DialogTrigger,
    DrawerBody, DrawerHeader, DrawerHeaderTitle,
    OverlayDrawer,
    Spinner,
    Text,
    Textarea,
    Toast, ToastTitle,
    useToastController,
} from "@fluentui/react-components";
import { AddRegular, ChatRegular, DeleteRegular, DismissRegular } from "@fluentui/react-icons";
import React, { useEffect, useState } from "react";
import { useAuth } from "../../infrastructure/context/auth-context";
import { createFeedback, deleteFeedback, getFeedbacks, FeedbackStatus, StoredFeedback } from "../../infrastructure/storages/feedback-storage";

const STATUS_BADGE: Record<FeedbackStatus, { color: "informative" | "warning" | "success"; label: string }> = {
    "New":         { color: "informative", label: "New" },
    "In Progress": { color: "warning",     label: "In Progress" },
    "Completed":   { color: "success",     label: "Completed" },
};
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
    const [dialogOpen, setDialogOpen] = useState(false);
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
            const saved = await createFeedback(user.id, draft.trim());
            setFeedbacks(prev => [saved, ...prev]);
            setDraft("");
            setDialogOpen(false);
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

    return (
        <>
            <OverlayDrawer position="end" open={open} onOpenChange={(_, { open: isOpen }) => !isOpen && onClose()}>
                <DrawerHeader>
                    <DrawerHeaderTitle
                        action={<Button appearance="subtle" icon={<DismissRegular />} onClick={onClose} />}
                    >
                        My feedbacks
                    </DrawerHeaderTitle>
                </DrawerHeader>
                <DrawerBody className={styles.body}>
                    <Button appearance="primary" icon={<AddRegular />} onClick={() => setDialogOpen(true)}>
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
                                <div key={f.id} className={styles.item}>
                                    <div className={styles.itemHeader}>
                                        <div className={styles.itemMeta}>
                                            <Text className={styles.itemDate}>
                                                {new Date(f.created_at).toLocaleDateString(undefined, {
                                                    day: "numeric",
                                                    month: "short",
                                                    year: "numeric",
                                                })}
                                            </Text>
                                            {f.status && STATUS_BADGE[f.status] && (
                                                <Badge
                                                    appearance="tint"
                                                    color={STATUS_BADGE[f.status].color}
                                                    size="small"
                                                >
                                                    {STATUS_BADGE[f.status].label}
                                                </Badge>
                                            )}
                                        </div>
                                        <Button
                                            appearance="subtle"
                                            size="small"
                                            icon={<DeleteRegular />}
                                            onClick={() => handleDelete(f.id)}
                                        />
                                    </div>
                                    <Text className={styles.itemMessage}>{f.message}</Text>
                                </div>
                            ))}
                        </div>
                    )}
                </DrawerBody>
            </OverlayDrawer>

            <Dialog open={dialogOpen} onOpenChange={(_, { open: isOpen }) => !isOpen && setDialogOpen(false)}>
                <DialogSurface>
                    <DialogBody>
                        <DialogTitle>New feedback</DialogTitle>
                        <DialogContent>
                            <Textarea
                                className={styles.textarea}
                                placeholder="Share your thoughts..."
                                value={draft}
                                onChange={(_, d) => setDraft(d.value)}
                                resize="vertical"
                            />
                        </DialogContent>
                        <DialogActions>
                            <DialogTrigger disableButtonEnhancement>
                                <Button appearance="secondary">Cancel</Button>
                            </DialogTrigger>
                            <Button
                                appearance="primary"
                                disabled={!draft.trim() || sending}
                                icon={sending ? <Spinner size="tiny" /> : undefined}
                                onClick={handleSubmit}
                            >
                                Send
                            </Button>
                        </DialogActions>
                    </DialogBody>
                </DialogSurface>
            </Dialog>
        </>
    );
};
