import {
    Button,
    Dialog,
    DialogActions,
    DialogBody,
    DialogContent,
    DialogSurface,
    DialogTitle,
    Input,
    Spinner,
    mergeClasses,
} from "@fluentui/react-components";
import {
    AddRegular,
    ArrowSortFilled,
    CheckmarkRegular,
    ChevronDownRegular,
    DeleteRegular,
    DismissRegular,
    EditRegular,
} from "@fluentui/react-icons";
import React, { useMemo } from "react";
import { useDayPlanPanelStyles } from "../../components/day-plan-panel/day-plan-panel-styles";
import { PageLayout } from "../../components/common/page-layout";
import { PageShell } from "../../components/common/page-shell";
import { useLocalization } from "../../infrastructure/context/locale-context";
import { PlanItem, TASK_COLORS } from "../../infrastructure/storages/day-storage";
import { useHabitPageStyles } from "./habit-page-styles";
import { useHabitPage } from "./use-habit-page";

interface PriorityBadgeProps {
    color: string | null;
    label: string;
    emptyText: string;
    panelStyles: ReturnType<typeof useDayPlanPanelStyles>;
}

const PriorityBadge: React.FC<PriorityBadgeProps> = ({ color, label, emptyText, panelStyles }) => {
    if (!color) {
        return <span className={panelStyles.priorityBadgeEmpty}>{emptyText}</span>;
    }
    return (
        <span
            className={panelStyles.priorityBadge}
            style={{ backgroundColor: `${color}18`, borderColor: `${color}70`, color }}
        >
            <span className={panelStyles.priorityDot} style={{ backgroundColor: color }} />
            {label}
        </span>
    );
};

export const HabitPage: React.FC = () => {
    const styles = useHabitPageStyles();
    const panelStyles = useDayPlanPanelStyles();
    const rs = useLocalization();
    const {
        loading,
        monthName,
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
        handleBack,
        handleDiscard,
        addItem,
        removeItem,
        draggingIndex,
        handleDragStart,
        handleDragOver,
        handleDragEnd,
        handleTouchStart,
        apply,
        reset,
    } = useHabitPage();

    const priorityOptions = useMemo(() => [
        { label: rs.TaskColorNames[0], color: null as string | null },
        ...TASK_COLORS.map((color, i) => ({ color, label: rs.TaskColorNames[i + 1] })),
    ], [rs]);

    const getOptionForColor = (color: string | null) =>
        priorityOptions.find(o => o.color === color) ?? priorityOptions[0];

    return (
        <>
            <PageLayout>
                <PageShell onBack={handleBack}>
                    <p className={panelStyles.description}>
                        {rs.ChangesApplyTo} {monthName}.
                    </p>

                    <div className={panelStyles.inputRow}>
                        <Input
                            className={panelStyles.input}
                            placeholder={rs.TaskNamePlaceholder}
                            value={draft}
                            onChange={(_, d) => setDraft(d.value)}
                            onKeyDown={e => { if (e.key === "Enter") addItem(); }}
                            disabled={loading}
                        />
                        <Button
                            appearance="secondary"
                            icon={<AddRegular />}
                            onClick={addItem}
                            disabled={!draft.trim() || loading}
                        >
                            {rs.AddTask}
                        </Button>
                    </div>

                    {items.length > 0 && (
                        <div className={panelStyles.list}>
                            {items.map((item, i) => {
                                const opt = getOptionForColor(item.color ?? null);
                                const isOpen = openPickerIndex === i;
                                return (
                                    <div
                                        key={item.label}
                                        className={mergeClasses(
                                            panelStyles.listItemWrapper,
                                            draggingIndex === i && panelStyles.listItemWrapperDragging,
                                        )}
                                        data-drag-index={i}
                                        draggable
                                        onDragStart={() => handleDragStart(i)}
                                        onDragOver={e => handleDragOver(e, i)}
                                        onDragEnd={handleDragEnd}
                                    >
                                        <div
                                            className={mergeClasses(panelStyles.listItem, isOpen && panelStyles.listItemOpen)}
                                            onClick={() => editingIndex !== i && togglePicker(i)}
                                        >
                                            <span
                                                className={panelStyles.dragHandle}
                                                onTouchStart={() => handleTouchStart(i)}
                                            >
                                                <ArrowSortFilled fontSize={16} />
                                            </span>
                                            {editingIndex === i ? (
                                                <Input
                                                    autoFocus
                                                    size="small"
                                                    className={panelStyles.listItemInput}
                                                    value={editingValue}
                                                    onChange={(_, d) => setEditingValue(d.value)}
                                                    onKeyDown={e => {
                                                        if (e.key === "Enter") commitEdit();
                                                        if (e.key === "Escape") cancelEdit();
                                                    }}
                                                    onClick={e => e.stopPropagation()}
                                                />
                                            ) : (
                                                <span className={panelStyles.taskName}>{item.label}</span>
                                            )}
                                            {editingIndex !== i && (
                                                <PriorityBadge
                                                    color={item.color ?? null}
                                                    label={opt.label}
                                                    emptyText={rs.AddPriority}
                                                    panelStyles={panelStyles}
                                                />
                                            )}
                                            {editingIndex === i ? (
                                                <button
                                                    className={panelStyles.deleteButton}
                                                    onClick={e => { e.stopPropagation(); commitEdit(); }}
                                                    onPointerDown={e => e.stopPropagation()}
                                                >
                                                    <CheckmarkRegular fontSize={14} />
                                                </button>
                                            ) : (
                                                <>
                                                    <span className={mergeClasses(panelStyles.chevron, isOpen && panelStyles.chevronOpen)}>
                                                        <ChevronDownRegular fontSize={14} />
                                                    </span>
                                                    <button
                                                        className={panelStyles.deleteButton}
                                                        onClick={e => { e.stopPropagation(); startEditing(i); }}
                                                        onPointerDown={e => e.stopPropagation()}
                                                    >
                                                        <EditRegular fontSize={14} />
                                                    </button>
                                                </>
                                            )}
                                            <button
                                                className={panelStyles.deleteButton}
                                                onClick={e => { e.stopPropagation(); editingIndex === i ? cancelEdit() : removeItem(i); }}
                                                onPointerDown={e => e.stopPropagation()}
                                            >
                                                <DismissRegular fontSize={14} />
                                            </button>
                                        </div>

                                        <div className={mergeClasses(panelStyles.priorityPicker, isOpen && panelStyles.priorityPickerOpen)}>
                                            {priorityOptions.map(option => {
                                                const isSelected = (item.color ?? null) === option.color;
                                                const isNone = option.color === null;
                                                return (
                                                    <button
                                                        key={option.label}
                                                        className={mergeClasses(
                                                            panelStyles.priorityPill,
                                                            isNone && panelStyles.priorityPillNone,
                                                            isNone && isSelected && panelStyles.priorityPillNoneSelected,
                                                            !isNone && isSelected && panelStyles.priorityPillSelected,
                                                        )}
                                                        style={!isNone ? {
                                                            backgroundColor: `${option.color}18`,
                                                            borderColor: isSelected ? option.color! : `${option.color}50`,
                                                            color: option.color!,
                                                        } : undefined}
                                                        onClick={e => { e.stopPropagation(); setItemColor(i, option.color); }}
                                                    >
                                                        <span
                                                            className={panelStyles.priorityDot}
                                                            style={{ backgroundColor: option.color ?? "#888" }}
                                                        />
                                                        {option.label}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    <div className={styles.footer}>
                        {isEditMode && (
                            <Button
                                className={panelStyles.resetButton}
                                appearance="subtle"
                                icon={<DeleteRegular />}
                                onClick={() => setConfirmReset(true)}
                            >
                                {rs.ResetAllTasks}
                            </Button>
                        )}
                        <Button
                            appearance="primary"
                            onClick={apply}
                            disabled={!hasChanges || saving}
                            icon={saving ? <Spinner size="tiny" /> : undefined}
                        >
                            {isEditMode ? rs.SaveChanges : rs.AddToAllDays}
                        </Button>
                    </div>
                </PageShell>
            </PageLayout>

            <Dialog open={confirmDiscard} onOpenChange={(_, d) => !d.open && setConfirmDiscard(false)}>
                <DialogSurface>
                    <DialogBody>
                        <DialogTitle>{rs.DiscardChangesTitle}</DialogTitle>
                        <DialogContent>{rs.DiscardChangesMessage}</DialogContent>
                        <DialogActions>
                            <Button appearance="secondary" onClick={() => setConfirmDiscard(false)}>{rs.KeepEditing}</Button>
                            <Button appearance="primary" onClick={handleDiscard}>{rs.Discard}</Button>
                        </DialogActions>
                    </DialogBody>
                </DialogSurface>
            </Dialog>

            <Dialog open={confirmReset} onOpenChange={(_, d) => !d.open && setConfirmReset(false)}>
                <DialogSurface>
                    <DialogBody>
                        <DialogTitle>{rs.ResetAllTasksTitle}</DialogTitle>
                        <DialogContent>{rs.ResetWarningMessage}</DialogContent>
                        <DialogActions>
                            <Button appearance="secondary" onClick={() => setConfirmReset(false)}>{rs.Cancel}</Button>
                            <Button appearance="primary" onClick={reset}>{rs.Reset}</Button>
                        </DialogActions>
                    </DialogBody>
                </DialogSurface>
            </Dialog>
        </>
    );
};
