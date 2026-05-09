import {
    Badge, Button, DrawerBody, DrawerHeader, DrawerHeaderTitle,
    OverlayDrawer, Select, Spinner, Text, Textarea,
} from "@fluentui/react-components";
import { ChatRegular, DismissRegular } from "@fluentui/react-icons";
import React, { useEffect, useState } from "react";
import { useLocalization } from "../../infrastructure/context/locale-context";
import { AdminFeedback, getAllFeedbacks, updateFeedback } from "../../infrastructure/storages/admin-storage";
import { useNotificationBadge } from "../../infrastructure/context/notification-badge-context";
import { FeedbackStatus } from "../../infrastructure/storages/feedback-storage";
import { useAdminPanelStyles } from "./admin-panel-styles";

const STATUSES: FeedbackStatus[] = ["New", "In Progress", "Completed"];

const STATUS_COLOR: Record<FeedbackStatus, "informative" | "warning" | "success"> = {
    "New": "informative",
    "In Progress": "warning",
    "Completed": "success",
};

interface FeedbackItemProps {
    feedback: AdminFeedback;
    onUpdated: (id: string, status: FeedbackStatus, answer: string | null) => void;
    onSeen: () => void;
}

const FeedbackItem: React.FC<FeedbackItemProps> = ({ feedback, onUpdated, onSeen }) => {
    const styles = useAdminPanelStyles();
    const rs = useLocalization();
    const [open, setOpen] = useState(false);
    const [editStatus, setEditStatus] = useState<FeedbackStatus>(feedback.status);
    const [editAnswer, setEditAnswer] = useState(feedback.answer ?? "");
    const [saving, setSaving] = useState(false);

    const STATUS_LABEL: Record<FeedbackStatus, string> = {
        "New": rs.StatusNew,
        "In Progress": rs.StatusInProgress,
        "Completed": rs.StatusCompleted,
    };

    useEffect(() => {
        if (open) {
            setEditStatus(feedback.status);
            setEditAnswer(feedback.answer ?? "");
        }
    }, [open]);

    const handleSave = async () => {
        setSaving(true);
        try {
            await updateFeedback(feedback.id, editStatus, editAnswer || null);
            onUpdated(feedback.id, editStatus, editAnswer || null);
            setOpen(false);
        } catch (e) {
            console.error(e);
        } finally {
            setSaving(false);
        }
    };

    return (
        <>
            <div className={styles.feedbackItem} onClick={() => { setOpen(true); onSeen(); }}>
                <div className={styles.feedbackMeta}>
                    <Text className={styles.feedbackEmail}>{feedback.email ?? rs.AdminAnonymous}</Text>
                    <Badge appearance="tint" color={STATUS_COLOR[feedback.status]} size="small">
                        {STATUS_LABEL[feedback.status]}
                    </Badge>
                    <Text className={styles.feedbackDate}>
                        {new Date(feedback.createdAt).toLocaleDateString(rs.DateLocale, {
                            day: "numeric", month: "short", year: "numeric",
                        })}
                    </Text>
                </div>
                <Text className={styles.feedbackMessage}>{feedback.message}</Text>
                {feedback.answer && (
                    <div className={styles.feedbackAnswer}>
                        <Text className={styles.feedbackAnswerLabel}>{rs.AdminReply}</Text>
                        <Text>{feedback.answer}</Text>
                    </div>
                )}
            </div>

            <OverlayDrawer
                open={open}
                size="medium"
                onOpenChange={(_, d) => setOpen(d.open)}
                position="end"
            >
                <DrawerHeader>
                    <DrawerHeaderTitle
                        action={
                            <Button
                                appearance="subtle"
                                icon={<DismissRegular />}
                                onClick={() => setOpen(false)}
                            />
                        }
                    >
                        {feedback.email ?? rs.AdminAnonymous}
                    </DrawerHeaderTitle>
                </DrawerHeader>
                <DrawerBody className={styles.feedbackPanelBody}>
                    <Text className={styles.feedbackDialogMessage}>{feedback.message}</Text>
                    <Select
                        value={editStatus}
                        onChange={(_, d) => setEditStatus(d.value as FeedbackStatus)}
                    >
                        {STATUSES.map(s => (
                            <option key={s} value={s}>{STATUS_LABEL[s]}</option>
                        ))}
                    </Select>
                    <Textarea
                        resize="vertical"
                        placeholder={rs.AdminReplyPlaceholder}
                        value={editAnswer}
                        onChange={(_, d) => setEditAnswer(d.value)}
                    />
                    <Button appearance="primary" disabled={saving} onClick={handleSave}>
                        {saving ? rs.Saving : rs.Save}
                    </Button>
                </DrawerBody>
            </OverlayDrawer>
        </>
    );
};

export const AdminFeedbacksTab: React.FC = () => {
    const styles = useAdminPanelStyles();
    const rs = useLocalization();
    const { markSeen } = useNotificationBadge();
    const [feedbacks, setFeedbacks] = useState<AdminFeedback[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getAllFeedbacks()
            .then(setFeedbacks)
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    const handleUpdated = (id: string, status: FeedbackStatus, answer: string | null) => {
        setFeedbacks(prev => prev.map(f => f.id === id ? { ...f, status, answer } : f));
    };

    if (loading) {
        return <div className={styles.center}><Spinner size="medium" /></div>;
    }

    if (feedbacks.length === 0) {
        return (
            <div className={styles.emptyState}>
                <ChatRegular fontSize={32} />
                <Text>{rs.AdminNoFeedbacks}</Text>
            </div>
        );
    }

    return (
        <>
            {feedbacks.map(f => (
                <FeedbackItem
                    key={f.id}
                    feedback={f}
                    onUpdated={handleUpdated}
                    onSeen={() => markSeen("admin-feedback", f.id)}
                />
            ))}
        </>
    );
};
