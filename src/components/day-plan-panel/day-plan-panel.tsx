import {
    Button,
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
import { AddRegular, ArrowSortFilled, CheckmarkRegular, ChevronDownRegular, ClockRegular, DeleteRegular, DismissRegular, EditRegular, TimerRegular } from "@fluentui/react-icons";
import React, { useMemo } from "react";
import { ConfirmDialog, DesktopTooltip, PriorityBadge } from "../common";
import { PlanItem, TASK_COLORS, useLocalization } from "../../infrastructure";
import { useDayPlanPanelStyles } from "./day-plan-panel-styles";
import { TimePickerPanel } from "./time-picker-panel";
import { useDayPlanPanel } from "./useDayPlanPanel";

interface DayPlanPanelProps {
    open: boolean;
    mode: "add" | "edit" | "editDay";
    monthName?: string;
    dateLabel?: string;
    planLabels: PlanItem[];
    onClose: () => void;
    addPlanToAllDays?: (items: PlanItem[]) => Promise<void>;
    editPlan?: (itemsToAdd: PlanItem[], labelsToRemove: string[], orderedLabels: string[], fieldChanges: PlanItem[]) => Promise<void>;
    resetPlan?: () => Promise<void>;
    onSaveDay?: (items: PlanItem[]) => void;
}

interface PriorityOption {
    label: string;
    color: string | null;
}

export const DayPlanPanel: React.FC<DayPlanPanelProps> = (props) => {
    const styles = useDayPlanPanelStyles();
    const rs = useLocalization();
    const {
        isEditMode,
        isEditDayMode,
        items,
        draft,
        setDraft,
        openPickerIndex,
        togglePicker,
        setItemColor,
        openTimePickerIndex,
        toggleTimePicker,
        setItemTime,
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
        priorityOptions.find(x => x.color === color) ?? priorityOptions[0];

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
                        {isEditDayMode ? props.dateLabel : (isEditMode ? rs.EditPlan : rs.AddPlanToAllDays)}
                    </DrawerHeaderTitle>
                    {!isEditDayMode && (
                        <Subtitle2 block as="h2" className={styles.description}>
                            {rs.ChangesApplyTo} {props.monthName}.
                        </Subtitle2>
                    )}
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
                                const isPriorityOpen = openPickerIndex === i;
                                const isTimeOpen = openTimePickerIndex === i;
                                const isAnyOpen = isPriorityOpen || isTimeOpen;
                                const hasTime = !!(item.time_mode && (item.time_exact || item.time_start));
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
                                        <div
                                            className={mergeClasses(styles.listItem, isAnyOpen && styles.listItemOpen)}
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
                                                <>
                                                    <button
                                                        className={mergeClasses(styles.timeChip, hasTime ? styles.timeChipSet : styles.timeChipEmpty)}
                                                        onClick={e => { e.stopPropagation(); toggleTimePicker(i); }}
                                                        onPointerDown={e => e.stopPropagation()}
                                                    >
                                                        {item.time_mode === "interval" ? <TimerRegular fontSize={16} /> : <ClockRegular fontSize={16} />}
                                                    </button>
                                                    <PriorityBadge
                                                        color={item.color ?? null}
                                                        label={opt.label}
                                                        size="mini"
                                                    />
                                                </>
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
                                                    <span className={mergeClasses(styles.chevron, isPriorityOpen && styles.chevronOpen)}>
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

                                        <div className={mergeClasses(styles.timePicker, isTimeOpen && styles.timePickerOpen)}>
                                            <TimePickerPanel
                                                item={item}
                                                onUpdate={patch => setItemTime(i, patch)}
                                                panelStyles={styles}
                                                rs={rs}
                                            />
                                        </div>

                                        <div className={mergeClasses(styles.priorityPicker, isPriorityOpen && styles.priorityPickerOpen)}>
                                            {priorityOptions.map(x => {
                                                const isSelected = (item.color ?? null) === x.color;
                                                const isNone = x.color === null;
                                                return (
                                                    <button
                                                        key={x.label}
                                                        className={mergeClasses(
                                                            styles.priorityPill,
                                                            isNone && styles.priorityPillNone,
                                                            isNone && isSelected && styles.priorityPillNoneSelected,
                                                            !isNone && isSelected && styles.priorityPillSelected,
                                                        )}
                                                        style={!isNone ? {
                                                            backgroundColor: `${x.color}18`,
                                                            borderColor: isSelected ? x.color! : `${x.color}50`,
                                                            color: x.color!,
                                                        } : undefined}
                                                        onClick={e => { e.stopPropagation(); setItemColor(i, x.color); }}
                                                    >
                                                        <span
                                                            className={styles.priorityDot}
                                                            style={{ backgroundColor: x.color ?? "#888" }}
                                                        />
                                                        {x.label}
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
                    {isEditMode && !isEditDayMode && (
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
                        {isEditDayMode ? rs.SaveChanges : (isEditMode ? rs.SaveChanges : rs.AddToAllDays)}
                    </Button>
                </DrawerFooter>
            </OverlayDrawer>

            <ConfirmDialog
                open={confirmDiscard}
                title={rs.DiscardChangesTitle}
                message={rs.DiscardChangesMessage}
                cancelLabel={rs.KeepEditing}
                confirmLabel={rs.Discard}
                onCancel={() => setConfirmDiscard(false)}
                onConfirm={props.onClose}
            />

            <ConfirmDialog
                open={confirmReset}
                title={rs.ResetAllTasksTitle}
                message={rs.ResetWarningMessage}
                cancelLabel={rs.Cancel}
                confirmLabel={rs.Reset}
                onCancel={() => setConfirmReset(false)}
                onConfirm={reset}
            />
        </>
    );
};
