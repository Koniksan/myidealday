import {
    Button,
    Dialog,
    DialogActions,
    DialogBody,
    DialogContent,
    DialogSurface,
    DialogTitle,
    Input,
    Tag,
    TagGroup,
} from "@fluentui/react-components";
import { AddRegular, DismissRegular } from "@fluentui/react-icons";
import React, { useState } from "react";
import { useDayPlanDialogStyles } from "./day-plan-dialog-styles";

interface DayPlanDialogProps {
    open: boolean;
    mode: "add" | "edit";
    planLabels: string[];
    onClose: () => void;
    addPlanToAllDays: (labels: string[]) => Promise<void>;
    editPlan: (labelsToAdd: string[], labelsToRemove: string[]) => Promise<void>;
}

export const DayPlanDialog: React.FC<DayPlanDialogProps> = ({
    open,
    mode,
    planLabels,
    onClose,
    addPlanToAllDays,
    editPlan,
}) => {
    const styles = useDayPlanDialogStyles();
    const isEditMode = mode === "edit";

    const [originalLabels] = useState<string[]>(planLabels);
    const [dialogItems, setDialogItems] = useState<string[]>(planLabels);
    const [draft, setDraft] = useState("");

    const addItem = () => {
        const label = draft.trim();
        if (label && !dialogItems.includes(label)) {
            setDialogItems(prev => [...prev, label]);
            setDraft("");
        }
    };

    const removeItem = (index: number) =>
        setDialogItems(prev => prev.filter((_, i) => i !== index));

    const apply = () => {
        if (isEditMode) {
            const labelsToRemove = originalLabels.filter(l => !dialogItems.includes(l));
            const labelsToAdd = dialogItems.filter(l => !originalLabels.includes(l));
            if (labelsToRemove.length > 0 || labelsToAdd.length > 0) {
                editPlan(labelsToAdd, labelsToRemove).catch(console.error);
            }
        } else {
            if (dialogItems.length > 0) addPlanToAllDays(dialogItems).catch(console.error);
        }
        onClose();
    };

    return (
        <Dialog open={open} onOpenChange={(_, d) => !d.open && onClose()}>
            <DialogSurface className={styles.surface}>
                <DialogBody>
                    <DialogTitle>{isEditMode ? "Edit plan" : "Add plan to all days"}</DialogTitle>
                    <DialogContent>
                        <div className={styles.inputRow}>
                            <Input
                                className={styles.input}
                                placeholder="Task name..."
                                value={draft}
                                onChange={(_, d) => setDraft(d.value)}
                                onKeyDown={e => { if (e.key === "Enter") addItem(); }}
                            />
                            <Button
                                appearance="subtle"
                                icon={<AddRegular />}
                                onClick={addItem}
                                disabled={!draft.trim()}
                            />
                        </div>

                        {dialogItems.length > 0 && (
                            <TagGroup className={styles.tagGroup}>
                                {dialogItems.map((label, i) => (
                                    <Tag
                                        key={i}
                                        dismissible
                                        dismissIcon={<DismissRegular />}
                                        value={label}
                                        onClick={() => removeItem(i)}
                                    >
                                        {label}
                                    </Tag>
                                ))}
                            </TagGroup>
                        )}
                    </DialogContent>

                    <DialogActions className={styles.actions}>
                        <Button appearance="secondary" onClick={onClose}>Cancel</Button>
                        <Button
                            appearance="primary"
                            onClick={apply}
                            disabled={dialogItems.length === 0}
                        >
                            {isEditMode ? "Save changes" : "Add to all days"}
                        </Button>
                    </DialogActions>
                </DialogBody>
            </DialogSurface>
        </Dialog>
    );
};
