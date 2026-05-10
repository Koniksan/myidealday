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
import { AddRegular, ArrowSortFilled, CheckmarkRegular, ChevronDownRegular, DeleteRegular, DismissRegular, EditRegular } from "@fluentui/react-icons";
import React, { useMemo } from "react";
import { DesktopTooltip } from "../common";
import { useLocalization } from "../../infrastructure/context/locale-context";
import { PlanItem, TASK_COLORS } from "../../infrastructure/storages/day-storage";
import { useDayPlanPanelStyles } from "./day-plan-panel-styles";
import { useDayPlanPanel } from "./useDayPlanPanel";

interface DayPlanPanelProps {
    open: boolean;
    mode: "add" | "edit";
    monthName: string;
    planLabels: PlanItem[];
    onClose: () => void;
    addPlanToAllDays: (items: PlanItem[]) => Promise<void>;
    editPlan: (itemsToAdd: PlanItem[], labelsToRemove: string[], orderedLabels: string[], colorChanges: PlanItem[]) => Promise<void>;
    resetPlan: () => Promise<void>;
}

interface PriorityOption {
    label: string;
    color: string | null;
}

interface PriorityBadgeProps {
    color: string | null;
    label: string;
    emptyText: string;
    styles: ReturnType<typeof useDayPlanPanelStyles>;
}

const PriorityBadge: React.FC<PriorityBadgeProps> = ({ color, label, emptyText, styles }) => {
    if (!color) {
        return <span className={styles.priorityBadgeEmpty}>{emptyText}</span>;
    }
    return (
        <span
            className={styles.priorityBadge}
            style={{ backgroundColor: `${color}18`, borderColor: `${color}70`, color }}
        >
            <span className={styles.priorityDot} style={{ backgroundColor: color }} />
            {label}
        </span>
    );
};

export const DayPlanPanel: React.FC<DayPlanPanelProps> = (props) => {
    const styles = useDayPlanPanelStyles();
    const rs = useLocalization();
    const {
        isEditMode,
        items,
        draft,
        setDraft,
        openPickerIndex,
        togglePicker,
        setItemColor,
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

    const priorityOptions: PriorityOption[] = useMemo(() => [
        { label: rs.TaskColorNames[0], color: null },
        ...TASK_COLORS.map((color, i) => ({ color, label: rs.TaskColorNames[i + 1] })),
    ], [rs]);

    const getOptionForColor = (color: string | null) =>
        priorityOptions.find(o => o.color === color) ?? priorityOptions[0];

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
                            appearance="secondary"
                            icon={<AddRegular />}
                            onClick={addItem}
                            disabled={!draft.trim()}
                        >{rs.AddTask}</Button>
                    </div>

                    {items.length > 0 && (
                        <div className={styles.list}>
                            {items.map((item, i) => {
                                const opt = getOptionForColor(item.color ?? null);
                                const isOpen = openPickerIndex === i;
                                return (
                                    <div
                                        key={item.label}
                                        className={mergeClasses(
                                            styles.listItemWrapper,
                                            draggingIndex === i && styles.listItemWrapperDragging,
                                        )}
                                        data-drag-index={i}
                                        draggable
                                        onDragStart={() => handleDragStart(i)}
                                        onDragOver={e => handleDragOver(e, i)}
                                        onDragEnd={handleDragEnd}
                                    >
                                        {/* Row */}
                                        <div
                                            className={mergeClasses(styles.listItem, isOpen && styles.listItemOpen)}
                                            onClick={() => editingIndex !== i && togglePicker(i)}
                                        >
                                            <span
                                                className={styles.dragHandle}
                                                onTouchStart={() => handleTouchStart(i)}
                                            >
                                                <ArrowSortFilled fontSize={16} />
                                            </span>
                                            {editingIndex === i ? (
                                                <Input
                                                    autoFocus
                                                    size="small"
                                                    className={styles.listItemInput}
                                                    value={editingValue}
                                                    onChange={(_, d) => setEditingValue(d.value)}
                                                    onKeyDown={e => {
                                                        if (e.key === "Enter") commitEdit();
                                                        if (e.key === "Escape") cancelEdit();
                                                    }}
                                                    onClick={e => e.stopPropagation()}
                                                />
                                            ) : (
                                                <span className={styles.taskName}>{item.label}</span>
                                            )}
                                            {editingIndex !== i && (
                                                <PriorityBadge
                                                    color={item.color ?? null}
                                                    label={opt.label}
                                                    emptyText={rs.AddPriority}
                                                    styles={styles}
                                                />
                                            )}
                                            {editingIndex === i ? (
                                                <button
                                                    className={styles.deleteButton}
                                                    onClick={e => { e.stopPropagation(); commitEdit(); }}
                                                    onPointerDown={e => e.stopPropagation()}
                                                >
                                                    <CheckmarkRegular fontSize={14} />
                                                </button>
                                            ) : (
                                                <>
                                                    <span className={mergeClasses(styles.chevron, isOpen && styles.chevronOpen)}>
                                                        <ChevronDownRegular fontSize={14} />
                                                    </span>
                                                    <button
                                                        className={styles.deleteButton}
                                                        onClick={e => { e.stopPropagation(); startEditing(i); }}
                                                        onPointerDown={e => e.stopPropagation()}
                                                    >
                                                        <EditRegular fontSize={14} />
                                                    </button>
                                                </>
                                            )}
                                            <button
                                                className={styles.deleteButton}
                                                onClick={e => { e.stopPropagation(); editingIndex === i ? cancelEdit() : removeItem(i); }}
                                                onPointerDown={e => e.stopPropagation()}
                                            >
                                                <DismissRegular fontSize={14} />
                                            </button>
                                        </div>

                                        {/* Inline priority picker */}
                                        <div className={mergeClasses(styles.priorityPicker, isOpen && styles.priorityPickerOpen)}>
                                            {priorityOptions.map(opt => {
                                                const isSelected = (item.color ?? null) === opt.color;
                                                const isNone = opt.color === null;
                                                return (
                                                    <button
                                                        key={opt.label}
                                                        className={mergeClasses(
                                                            styles.priorityPill,
                                                            isNone && styles.priorityPillNone,
                                                            isNone && isSelected && styles.priorityPillNoneSelected,
                                                            !isNone && isSelected && styles.priorityPillSelected,
                                                        )}
                                                        style={!isNone ? {
                                                            backgroundColor: `${opt.color}18`,
                                                            borderColor: isSelected ? opt.color! : `${opt.color}50`,
                                                            color: opt.color!,
                                                        } : undefined}
                                                        onClick={e => { e.stopPropagation(); setItemColor(i, opt.color); }}
                                                    >
                                                        <span
                                                            className={styles.priorityDot}
                                                            style={{ backgroundColor: opt.color ?? "#888" }}
                                                        />
                                                        {opt.label}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                );
                            })}
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
