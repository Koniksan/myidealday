import {
    Button,
    DrawerBody,
    DrawerFooter,
    DrawerHeader,
    DrawerHeaderTitle,
    Label,
    OverlayDrawer,
    Text,
    Textarea,
    mergeClasses,
} from "@fluentui/react-components";
import { DismissRegular } from "@fluentui/react-icons";
import React, { useEffect, useState } from "react";
import { AdminFeedback, FeedbackStatus, FeedbackType, updateFeedback, useLocalization } from "../../../infrastructure";
import { StatusBadge, TypeBadge } from "../../common";
import { useEditKanbanItemPanelStyles } from "./edit-kanban-item-panel-styles";

const STATUSES: FeedbackStatus[] = ["New", "In Progress", "Completed"];
const TYPES = [FeedbackType.Unassign, FeedbackType.Feature, FeedbackType.Bug, FeedbackType.Performance];

interface EditKanbanItemPanelProps {
    feedback: AdminFeedback | null;
    onClose: () => void;
    onSaved: (id: string, status: FeedbackStatus, answer: string | null, type: FeedbackType) => void;
}

export const EditKanbanItemPanel: React.FC<EditKanbanItemPanelProps> = ({ feedback, onClose, onSaved }) => {
    const styles = useEditKanbanItemPanelStyles();
    const rs = useLocalization();
    const [editStatus, setEditStatus] = useState<FeedbackStatus>("New");
    const [editType, setEditType] = useState<FeedbackType>(FeedbackType.Unassign);
    const [editAnswer, setEditAnswer] = useState("");
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (feedback) {
            setEditStatus(feedback.status);
            setEditType(feedback.type ?? FeedbackType.Unassign);
            setEditAnswer(feedback.answer ?? "");
        }
    }, [feedback?.id]);

    const handleSave = async () => {
        if (!feedback) return;
        setSaving(true);
        try {
            const type = editType === FeedbackType.Unassign ? null : editType;
            await updateFeedback(feedback.id, editStatus, editAnswer || null, type);
            onSaved(feedback.id, editStatus, editAnswer || null, editType);
            onClose();
        } catch (e) {
            console.error(e);
        } finally {
            setSaving(false);
        }
    };

    return (
        <OverlayDrawer
            open={!!feedback}
            size="medium"
            onOpenChange={(_, d) => !d.open && onClose()}
            position="end"
        >
            <DrawerHeader>
                <DrawerHeaderTitle
                    action={<Button appearance="subtle" icon={<DismissRegular />} onClick={onClose} />}
                >
                    {feedback?.email ?? rs.AdminAnonymous}
                </DrawerHeaderTitle>
            </DrawerHeader>
            <DrawerBody className={styles.feedbackPanelBody}>
                <Text className={styles.feedbackDialogMessage}>{feedback?.message}</Text>
                {feedback?.imageUrl && (
                    <img src={feedback.imageUrl} className={styles.feedbackImage} />
                )}
                <div className={styles.fieldSection}>
                    <Label className={styles.fieldLabel}>{rs.TypeLabel}</Label>
                    <div className={styles.radioGroup}>
                        {TYPES.map(x => (
                            <div
                                key={x}
                                className={mergeClasses(styles.radioItem, editType === x && styles.radioItemSelected)}
                                onClick={e => setEditType(x)}
                            >
                                {x === FeedbackType.Unassign
                                    ? <span className={styles.typeRadioNone}>—</span>
                                    : <TypeBadge type={x} />
                                }
                            </div>
                        ))}
                    </div>
                </div>
                <div className={styles.fieldSection}>
                    <Label className={styles.fieldLabel}>{rs.StatusLabel}</Label>
                    <div className={styles.radioGroup}>
                        {STATUSES.map(x => (
                            <div
                                key={x}
                                className={mergeClasses(styles.radioItem, editStatus === x && styles.radioItemSelected)}
                                onClick={e => setEditStatus(x)}
                            >
                                <StatusBadge status={x} />
                            </div>
                        ))}
                    </div>
                </div>
                <div className={styles.fieldSection}>
                    <Label className={styles.fieldLabel}>{rs.ReplyLabel}</Label>
                    <Textarea
                        className={styles.feedbackAnswer}
                        resize="vertical"
                        placeholder={rs.AdminReplyPlaceholder}
                        value={editAnswer}
                        onChange={(_, d) => setEditAnswer(d.value)}
                    />
                </div>
            </DrawerBody>
            <DrawerFooter className={styles.drawerFooter}>
                <Button appearance="primary" disabled={saving} onClick={handleSave}>
                    {saving ? rs.Saving : rs.Save}
                </Button>
                <Button appearance="subtle" onClick={onClose}>{rs.Cancel}</Button>
            </DrawerFooter>
        </OverlayDrawer>
    );
};
