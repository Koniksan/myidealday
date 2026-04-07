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
import { AddRegular, DismissRegular } from "@fluentui/react-icons";
import React, { useState } from "react";
import { DayCard } from "../day";
import { useDayCardListStyles } from "./day-card-list-styles";
import { useDayCardList } from "./useDayCardList";

export const DayCardList: React.FC = () => {
    const styles = useDayCardListStyles();
    const { days, monthName, year } = useDayCardList();

    const [planTasks, setPlanTasks] = useState<string[]>([]);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogItems, setDialogItems] = useState<string[]>([]);
    const [draft, setDraft] = useState("");

    const addDialogItem = () => {
        const label = draft.trim();
        if (label) {
            setDialogItems(prev => [...prev, label]);
            setDraft("");
        }
    };

    const removeDialogItem = (index: number) =>
        setDialogItems(prev => prev.filter((_, i) => i !== index));

    const applyPlan = () => {
        if (dialogItems.length > 0) setPlanTasks(prev => [...prev, ...dialogItems]);
        setDialogItems([]);
        setDraft("");
        setDialogOpen(false);
    };

    const cancelDialog = () => {
        setDialogItems([]);
        setDraft("");
        setDialogOpen(false);
    };

    return (
        <>
            <div className={styles.header}>
                <Title2 as="h1">{monthName} {year}</Title2>
                <Button
                    appearance="primary"
                    icon={<AddRegular />}
                    onClick={() => setDialogOpen(true)}
                >
                    Add plan
                </Button>
            </div>

            <div className={styles.grid}>
                {days.map(({ day, shortName, isToday, isWeekend }) => (
                    <DayCard
                        key={day}
                        day={day}
                        shortName={shortName}
                        isToday={isToday}
                        isWeekend={isWeekend}
                        planTasks={planTasks}
                    />
                ))}
            </div>

            <Dialog open={dialogOpen} onOpenChange={(_, d) => !d.open && cancelDialog()}>
                <DialogSurface>
                    <DialogBody>
                        <DialogTitle>Add plan to all days</DialogTitle>
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

                        <DialogActions>
                            <Button appearance="secondary" onClick={cancelDialog}>Cancel</Button>
                            <Button
                                appearance="primary"
                                onClick={applyPlan}
                                disabled={dialogItems.length === 0}
                            >
                                Add to all days
                            </Button>
                        </DialogActions>
                    </DialogBody>
                </DialogSurface>
            </Dialog>
        </>
    );
};
