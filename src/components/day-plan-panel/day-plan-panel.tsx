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
    Subtitle2,
    mergeClasses,
} from "@fluentui/react-components";
import { AddRegular, ArrowSortFilled, CheckmarkRegular, DeleteRegular, DismissRegular, EditRegular } from "@fluentui/react-icons";
import React from "react";
import { DesktopTooltip } from "../common";
import { useLocalization } from "../../infrastructure/context/locale-context";
import { useDayPlanPanelStyles } from "./day-plan-panel-styles";
import { useDayPlanPanel } from "./useDayPlanPanel";

interface DayPlanPanelProps {
    open: boolean;
    mode: "add" | "edit";
    monthName: string;
    planLabels: string[];
    onClose: () => void;
    addPlanToAllDays: (labels: string[]) => Promise<void>;
    editPlan: (labelsToAdd: string[], labelsToRemove: string[], orderedLabels: string[]) => Promise<void>;
    resetPlan: () => Promise<void>;
}

export const DayPlanPanel: React.FC<DayPlanPanelProps> = (props) => {
    const styles = useDayPlanPanelStyles();
    const rs = useLocalization();
    const {
        isEditMode,
        items,
        draft,
        setDraft,
        editingIndex,
        editingValue,
        setEditingValue,
        startEditing,
        commitEdit,
        cancelEdit,
        hasChanges,
        saving,
        confirmDiscard,
        setConfirmDiscard,
        confirmReset,
        setConfirmReset,
        handleOpenChange,
        addItem,
        removeItem,
        draggingIndex,
        handleDragStart,
        handleDragOver,
        handleDragEnd,
        handleTouchStart,
        apply,
        reset,
    } = useDayPlanPanel(props);

    return (
        <>
            <OverlayDrawer
                open={props.open}
                onOpenChange={handleOpenChange}
                position="end"
                size="medium"
            >
                <DrawerHeader>
                    <DrawerHeaderTitle
                        action={
                            <Button
                                appearance="subtle"
                                icon={<DismissRegular />}
                                aria-label={rs.Close}
                                onClick={() => hasChanges ? setConfirmDiscard(true) : props.onClose()}
                            />
                        }
                    >
                        {isEditMode ? rs.EditPlan : rs.AddPlanToAllDays}
                    </DrawerHeaderTitle>
                    <Subtitle2 block as="h2" className={styles.description}>
                        {rs.ChangesApplyTo} {props.monthName}.
                    </Subtitle2>
                </DrawerHeader>

                <DrawerBody className={styles.body}>
                    <div className={styles.inputRow}>
                        <Input
                            className={styles.input}
                            placeholder={rs.TaskNamePlaceholder}
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
                                    className={mergeClasses(styles.listItem, draggingIndex === i && styles.listItemDragging)}
                                    data-drag-index={i}
                                    draggable={editingIndex !== i}
                                    onDragStart={() => handleDragStart(i)}
                                    onDragOver={e => handleDragOver(e, i)}
                                    onDragEnd={handleDragEnd}
                                >
                                    <span
                                        className={styles.dragHandle}
                                        onTouchStart={editingIndex !== i ? () => handleTouchStart(i) : undefined}
                                    ><ArrowSortFilled /></span>
                                    {editingIndex === i ? (
                                        <Input
                                            autoFocus
                                            className={styles.listItemInput}
                                            value={editingValue}
                                            onChange={(_, d) => setEditingValue(d.value)}
                                            onBlur={commitEdit}
                                            onKeyDown={e => {
                                                if (e.key === "Enter") commitEdit();
                                                if (e.key === "Escape") cancelEdit();
                                            }}
                                        />
                                    ) : (
                                        <span className={styles.listItemLabel}>{label}</span>
                                    )}
                                    <Button
                                        appearance="subtle"
                                        size="small"
                                        icon={editingIndex === i ? <CheckmarkRegular /> : <EditRegular />}
                                        onClick={() => editingIndex === i ? commitEdit() : startEditing(i)}
                                    />
                                    {editingIndex !== i && (
                                        <Button
                                            appearance="subtle"
                                            size="small"
                                            icon={<DismissRegular />}
                                            onClick={() => removeItem(i)}
                                        />
                                    )}
                                </div>
                            ))}
                        </div>
                    )}

                </DrawerBody>

                <DrawerFooter className={styles.footer}>
                    {isEditMode && (
                        <DesktopTooltip content={rs.ResetAllTasks} relationship="label">
                            <Button
                                className={styles.resetButton}
                                appearance="subtle"
                                icon={<DeleteRegular />}
                                aria-label={rs.ResetAllTasks}
                                onClick={() => setConfirmReset(true)}
                            />
                        </DesktopTooltip>
                    )}
                    <Button appearance="secondary" onClick={() => hasChanges ? setConfirmDiscard(true) : props.onClose()}>{rs.Cancel}</Button>
                    <Button
                        appearance="primary"
                        onClick={apply}
                        disabled={!hasChanges || saving}
                        icon={saving ? <Spinner size="tiny" /> : undefined}
                    >
                        {isEditMode ? rs.SaveChanges : rs.AddToAllDays}
                    </Button>
                </DrawerFooter>
            </OverlayDrawer>

            <Dialog open={confirmDiscard} onOpenChange={(_, d) => !d.open && setConfirmDiscard(false)}>
                <DialogSurface className={styles.confirmSurface}>
                    <DialogBody>
                        <DialogTitle>{rs.DiscardChangesTitle}</DialogTitle>
                        <DialogContent>{rs.DiscardChangesMessage}</DialogContent>
                        <DialogActions className={styles.confirmActions}>
                            <Button appearance="secondary" onClick={() => setConfirmDiscard(false)}>{rs.KeepEditing}</Button>
                            <Button appearance="primary" onClick={props.onClose}>{rs.Discard}</Button>
                        </DialogActions>
                    </DialogBody>
                </DialogSurface>
            </Dialog>

            <Dialog open={confirmReset} onOpenChange={(_, d) => !d.open && setConfirmReset(false)}>
                <DialogSurface className={styles.confirmSurface}>
                    <DialogBody>
                        <DialogTitle>{rs.ResetAllTasksTitle}</DialogTitle>
                        <DialogContent>{rs.ResetWarningMessage}</DialogContent>
                        <DialogActions className={styles.confirmActions}>
                            <Button appearance="secondary" onClick={() => setConfirmReset(false)}>{rs.Cancel}</Button>
                            <Button appearance="primary" onClick={reset}>{rs.Reset}</Button>
                        </DialogActions>
                    </DialogBody>
                </DialogSurface>
            </Dialog>
        </>
    );
};
