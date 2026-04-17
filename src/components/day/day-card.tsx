import { Checkbox, Input, mergeClasses } from "@fluentui/react-components";
import React, { useEffect, useState } from "react";
import { useDayCardStyles } from "./day-card-styles";
import { saveTask, updateTask, StoredTask } from "../../infrastructure/storages/day-storage";

export interface DayCardProps {
    year: number;
    month: number;
    day: number;
    shortName: string;
    isToday: boolean;
    isWeekend: boolean;
    initialTasks?: StoredTask[];
}

export const DayCard: React.FC<DayCardProps> = ({ year, month, day, shortName, isToday, isWeekend, initialTasks = [] }) => {
    const styles = useDayCardStyles();
    const [tasks, setTasks] = useState<StoredTask[]>(initialTasks);
    const [adding, setAdding] = useState(false);
    const [draft, setDraft] = useState("");

    useEffect(() => {
        setTasks(initialTasks);
    }, [initialTasks]);

    const progress = tasks.length > 0
        ? (tasks.filter(t => t.checked).length / tasks.length) * 100
        : 0;

    const toggle = (i: number) => {
        const task = tasks[i];
        if (!task.id) return;
        const checked = !task.checked;
        updateTask(task.id, { checked }).catch(console.error);
        setTasks(prev => prev.map((t, idx) => idx === i ? { ...t, checked } : t));
    };

    const commitDraft = () => {
        const label = draft.trim();
        if (label) {
            saveTask(year, month, day, { label, checked: false, position: tasks.length })
                .then(saved => setTasks(prev => [...prev, saved]))
                .catch(console.error);
        }
        setDraft("");
        setAdding(false);
    };

    const onKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") commitDraft();
        if (e.key === "Escape") { setDraft(""); setAdding(false); }
    };

    return (
        <div
            className={mergeClasses(
                styles.card,
                isToday && styles.today,
                !isToday && isWeekend && styles.weekend,
            )}
        >
            <div className={styles.progressTrack}>
                <div className={styles.progressFill} style={{ width: `${progress}%` }} />
            </div>

            <div className={styles.header}>
                <span className={mergeClasses(styles.dayName, isToday && styles.dayNameToday)}>
                    {shortName}
                </span>
                <span className={mergeClasses(styles.dayNumber, isToday && styles.dayNumberToday)}>
                    {day}
                </span>
            </div>

            <div className={styles.body}>
                {tasks.map(({ label, checked }, i) => (
                    <Checkbox
                        key={i}
                        className={mergeClasses(styles.checkboxItem, isToday && styles.checkboxItemToday)}
                        label={label}
                        checked={checked}
                        onChange={() => toggle(i)}
                    />
                ))}

                {adding && (
                    <Input
                        autoFocus
                        size="small"
                        className={styles.addInput}
                        placeholder="Task name..."
                        value={draft}
                        onChange={(_, d) => setDraft(d.value)}
                        onKeyDown={onKeyDown}
                        onBlur={commitDraft}
                    />
                )}

                <button className={mergeClasses(styles.addButton, isToday && styles.addButtonToday, adding && styles.addButtonVisible)} onClick={() => setAdding(true)}>
                    + add task
                </button>
            </div>
        </div>
    );
};
