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
    Title2,
} from "@fluentui/react-components";
import { AddRegular, DismissRegular, EditRegular } from "@fluentui/react-icons";
import React, { useState } from "react";
import { DayCard } from "../day";
import { useDayCardListStyles } from "./day-card-list-styles";
import { useDayCardList } from "./useDayCardList";

export const DayCardList: React.FC = () => {
    const styles = useDayCardListStyles();
    const { days, monthName, year, planLabels, gridRef, addPlanToAllDays, editPlan } = useDayCardList();

    const [dialogOpen, setDialogOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [originalLabels, setOriginalLabels] = useState<string[]>([]);
    const [dialogItems, setDialogItems] = useState<string[]>([]);
    const [draft, setDraft] = useState("");

    const openAddDialog = () => {
        setIsEditMode(false);
        setOriginalLabels([]);
        setDialogItems([]);
        setDraft("");
        setDialogOpen(true);
    };

    const openEditDialog = () => {
        setIsEditMode(true);
        setOriginalLabels([...planLabels]);
        setDialogItems([...planLabels]);
        setDraft("");
        setDialogOpen(true);
    };

    const addDialogItem = () => {
        const label = draft.trim();
        if (label && !dialogItems.includes(label)) {
            setDialogItems(prev => [...prev, label]);
            setDraft("");
        }
    };

    const removeDialogItem = (index: number) =>
        setDialogItems(prev => prev.filter((_, i) => i !== index));

    const applyPlan = () => {
        if (isEditMode) {
            const labelsToRemove = originalLabels.filter(l => !dialogItems.includes(l));
            const labelsToAdd = dialogItems.filter(l => !originalLabels.includes(l));
            if (labelsToRemove.length > 0 || labelsToAdd.length > 0) {
                editPlan(labelsToAdd, labelsToRemove).catch(console.error);
            }
        } else {
            if (dialogItems.length > 0) addPlanToAllDays(dialogItems).catch(console.error);
        }
        setDialogOpen(false);
    };

    const cancelDialog = () => {
        setDialogItems([]);
        setDraft("");
        setDialogOpen(false);
    };

    const hasExistingPlan = planLabels.length > 0;

    return (
        <>
            <div className={styles.header}>
                <Title2 as="h1">{monthName} {year}</Title2>
                <Button
                    appearance="primary"
                    icon={hasExistingPlan ? <EditRegular /> : <AddRegular />}
                    onClick={hasExistingPlan ? openEditDialog : openAddDialog}
                >
                    {hasExistingPlan ? "Edit plan" : "Add plan"}
                </Button>
            </div>

            <div className={styles.grid} ref={gridRef}>
                {days.map(({ year, month, day, shortName, isToday, isWeekend, initialTasks }) => (
                    <DayCard
                        key={day}
                        year={year}
                        month={month}
                        day={day}
                        shortName={shortName}
                        isToday={isToday}
                        isWeekend={isWeekend}
                        initialTasks={initialTasks}
                    />
                ))}
            </div>

            <Dialog open={dialogOpen} onOpenChange={(_, d) => !d.open && cancelDialog()}>
                <DialogSurface className={styles.dialogSurface}>
                    <DialogBody>
                        <DialogTitle>{isEditMode ? "Edit plan" : "Add plan to all days"}</DialogTitle>
                        <DialogContent>
                            <div className={styles.dialogInputRow}>
                                <Input
                                    className={styles.dialogInput}
                                    placeholder="Task name..."
                                    value={draft}
                                    onChange={(_, d) => setDraft(d.value)}
                                    onKeyDown={e => { if (e.key === "Enter") addDialogItem(); }}
                                />
                                <Button
                                    appearance="subtle"
                                    icon={<AddRegular />}
                                    onClick={addDialogItem}
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
                                            onClick={() => removeDialogItem(i)}
                                        >
                                            {label}
                                        </Tag>
                                    ))}
                                </TagGroup>
                            )}
                        </DialogContent>

                        <DialogActions className={styles.dialogActions}>
                            <Button appearance="secondary" onClick={cancelDialog}>Cancel</Button>
                            <Button
                                appearance="primary"
                                onClick={applyPlan}
                                disabled={dialogItems.length === 0}
                            >
                                {isEditMode ? "Save changes" : "Add to all days"}
                            </Button>
                        </DialogActions>
                    </DialogBody>
                </DialogSurface>
            </Dialog>
        </>
    );
};
