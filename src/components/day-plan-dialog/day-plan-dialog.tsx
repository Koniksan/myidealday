import {
    Button,
    Dialog,
    DialogActions,
    DialogBody,
    DialogContent,
    DialogSurface,
    DialogTitle,
    Input,
} from "@fluentui/react-components";
import { AddRegular, ArrowSortFilled, DismissRegular } from "@fluentui/react-icons";
import React from "react";
import { useDayPlanDialogStyles } from "./day-plan-dialog-styles";
import { useDayPlanDialog } from "./useDayPlanDialog";

interface DayPlanDialogProps {
    open: boolean;
    mode: "add" | "edit";
    planLabels: string[];
    onClose: () => void;
    addPlanToAllDays: (labels: string[]) => Promise<void>;
    editPlan: (labelsToAdd: string[], labelsToRemove: string[], orderedLabels: string[]) => Promise<void>;
}

export const DayPlanDialog: React.FC<DayPlanDialogProps> = (props) => {
    const styles = useDayPlanDialogStyles();
    const {
        isEditMode,
        items,
        draft,
        setDraft,
        hasChanges,
        confirmDiscard,
        setConfirmDiscard,
        handleOpenChange,
        addItem,
        removeItem,
        handleDragStart,
        handleDragOver,
        handleDragEnd,
        apply,
    } = useDayPlanDialog(props);

    return (
        <>
            <Dialog open={props.open} onOpenChange={handleOpenChange}>
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

                            {items.length > 0 && (
                                <div className={styles.list}>
                                    {items.map((label, i) => (
                                        <div
                                            key={label}
                                            className={styles.listItem}
                                            draggable
                                            onDragStart={() => handleDragStart(i)}
                                            onDragOver={e => handleDragOver(e, i)}
                                            onDragEnd={handleDragEnd}
                                        >
                                            <span className={styles.dragHandle}><ArrowSortFilled /></span>
                                            <span className={styles.listItemLabel}>{label}</span>
                                            <Button
                                                appearance="subtle"
                                                size="small"
                                                icon={<DismissRegular />}
                                                onClick={() => removeItem(i)}
                                            />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </DialogContent>

                        <DialogActions className={styles.actions}>
                            <Button appearance="secondary" onClick={() => hasChanges ? setConfirmDiscard(true) : props.onClose()}>Cancel</Button>
                            <Button appearance="primary" onClick={apply} disabled={items.length === 0}>
                                {isEditMode ? "Save changes" : "Add to all days"}
                            </Button>
                        </DialogActions>
                    </DialogBody>
                </DialogSurface>
            </Dialog>

            <Dialog open={confirmDiscard} onOpenChange={(_, d) => !d.open && setConfirmDiscard(false)}>
                <DialogSurface className={styles.confirmSurface}>
                    <DialogBody>
                        <DialogTitle>Discard changes?</DialogTitle>
                        <DialogContent>
                            You have unsaved changes. Are you sure you want to discard them?
                        </DialogContent>
                        <DialogActions className={styles.actions}>
                            <Button appearance="secondary" onClick={() => setConfirmDiscard(false)}>Keep editing</Button>
                            <Button appearance="primary" onClick={props.onClose}>Discard</Button>
                        </DialogActions>
                    </DialogBody>
                </DialogSurface>
            </Dialog>
        </>
    );
};
