import { Checkbox, Input, mergeClasses } from "@fluentui/react-components";
import React, { useState } from "react";
import { useDayCardStyles } from "./day-card-styles";

interface Task {
    label: string;
    checked: boolean;
}

export interface DayCardProps {
    day: number;
    shortName: string;
    isToday: boolean;
    isWeekend: boolean;
}

export const DayCard: React.FC<DayCardProps> = ({ day, shortName, isToday, isWeekend }) => {
    const styles = useDayCardStyles();
    const [tasks, setTasks] = useState<Task[]>([]);
    const [adding, setAdding] = useState(false);
    const [draft, setDraft] = useState("");

    const progress = tasks.length > 0
        ? (tasks.filter(t => t.checked).length / tasks.length) * 100
        : 0;

    const toggle = (i: number) =>
        setTasks(prev => prev.map((t, idx) => idx === i ? { ...t, checked: !t.checked } : t));

    const commitDraft = () => {
        const label = draft.trim();
        if (label) setTasks(prev => [...prev, { label, checked: false }]);
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
                        className={styles.checkboxItem}
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

                <button className={styles.addButton} onClick={() => setAdding(true)}>
                    + add task
                </button>
            </div>
        </div>
    );
};
