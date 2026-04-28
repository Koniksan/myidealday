import {
    Button,
    Dialog,
    DialogActions,
    DialogBody,
    DialogContent,
    DialogSurface,
    DialogTitle,
    DrawerBody,
    DrawerFooter,
    DrawerHeader,
    DrawerHeaderTitle,
    Input,
    OverlayDrawer,
    Spinner,
} from "@fluentui/react-components";
import { AddRegular, ArrowSortFilled, DeleteRegular, DismissRegular } from "@fluentui/react-icons";
import React from "react";
import { DesktopTooltip } from "../common";
import { useDayPlanPanelStyles } from "./day-plan-panel-styles";
import { useDayPlanPanel } from "./useDayPlanPanel";

interface DayPlanPanelProps {
    open: boolean;
    mode: "add" | "edit";
    planLabels: string[];
    onClose: () => void;
    addPlanToAllDays: (labels: string[]) => Promise<void>;
    editPlan: (labelsToAdd: string[], labelsToRemove: string[], orderedLabels: string[]) => Promise<void>;
    resetPlan: () => Promise<void>;
}

export const DayPlanPanel: React.FC<DayPlanPanelProps> = (props) => {
    const styles = useDayPlanPanelStyles();
    const {
        isEditMode,
        items,
        draft,
        setDraft,
        hasChanges,
        saving,
        confirmDiscard,
        setConfirmDiscard,
        confirmReset,
        setConfirmReset,
        handleOpenChange,
        addItem,
        removeItem,
        handleDragStart,
        handleDragOver,
        handleDragEnd,
        apply,
        reset,
    } = useDayPlanPanel(props);

    return (
        <>
            <OverlayDrawer
                open={props.open}
                onOpenChange={handleOpenChange}
                position="end"
                size="small"
            >
                <DrawerHeader>
                    <DrawerHeaderTitle
                        action={
                            <Button
                                appearance="subtle"
                                icon={<DismissRegular />}
                                aria-label="Close"
                                onClick={() => hasChanges ? setConfirmDiscard(true) : props.onClose()}
                            />
                        }
                    >
                        {isEditMode ? "Edit plan" : "Add plan to all days"}
                    </DrawerHeaderTitle>
                </DrawerHeader>

                <DrawerBody className={styles.body}>
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

                </DrawerBody>

                <DrawerFooter className={styles.footer}>
                    {isEditMode && (
                        <DesktopTooltip content="Reset all tasks" relationship="label">
                            <Button
                                className={styles.resetButton}
                                appearance="subtle"
                                icon={<DeleteRegular />}
                                aria-label="Reset all tasks"
                                onClick={() => setConfirmReset(true)}
                            />
                        </DesktopTooltip>
                    )}
                    <Button appearance="secondary" onClick={() => hasChanges ? setConfirmDiscard(true) : props.onClose()}>Cancel</Button>
                    <Button
                        appearance="primary"
                        onClick={apply}
                        disabled={items.length === 0 || saving}
                        icon={saving ? <Spinner size="tiny" /> : undefined}
                    >
                        {isEditMode ? "Save changes" : "Add to all days"}
                    </Button>
                </DrawerFooter>
            </OverlayDrawer>

            <Dialog open={confirmDiscard} onOpenChange={(_, d) => !d.open && setConfirmDiscard(false)}>
                <DialogSurface className={styles.confirmSurface}>
                    <DialogBody>
                        <DialogTitle>Discard changes?</DialogTitle>
                        <DialogContent>
                            You have unsaved changes. Are you sure you want to discard them?
                        </DialogContent>
                        <DialogActions className={styles.confirmActions}>
                            <Button appearance="secondary" onClick={() => setConfirmDiscard(false)}>Keep editing</Button>
                            <Button appearance="primary" onClick={props.onClose}>Discard</Button>
                        </DialogActions>
                    </DialogBody>
                </DialogSurface>
            </Dialog>

            <Dialog open={confirmReset} onOpenChange={(_, d) => !d.open && setConfirmReset(false)}>
                <DialogSurface className={styles.confirmSurface}>
                    <DialogBody>
                        <DialogTitle>Reset all tasks?</DialogTitle>
                        <DialogContent>
                            This will permanently delete every task from today onwards. This cannot be undone.
                        </DialogContent>
                        <DialogActions className={styles.confirmActions}>
                            <Button appearance="secondary" onClick={() => setConfirmReset(false)}>Cancel</Button>
                            <Button appearance="primary" onClick={reset}>Reset</Button>
                        </DialogActions>
                    </DialogBody>
                </DialogSurface>
            </Dialog>
        </>
    );
};
