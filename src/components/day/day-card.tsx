import { Badge, Checkbox, Divider, Input, mergeClasses, Spinner, tokens } from "@fluentui/react-components";
import { CheckmarkCircle24Filled, DismissRegular } from "@fluentui/react-icons";
import React, { useEffect, useState } from "react";
import { useDayCardStyles } from "./day-card-styles";
import { saveTask, updateTask, deleteTask, StoredTask } from "../../infrastructure/storages/day-storage";

const CIRCLE_SIZE = 36;
const CIRCLE_RADIUS = 14;
const CIRCUMFERENCE = 2 * Math.PI * CIRCLE_RADIUS;

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
    const [saving, setSaving] = useState(false);

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(0, 0, 0, 0);

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    const cardDate = new Date(year, month, day);
    const isReadOnly = cardDate < yesterday || cardDate > tomorrow;

    useEffect(() => {
        setTasks(initialTasks);
    }, [initialTasks]);

    const progress = tasks.length > 0
        ? (tasks.filter(t => t.checked).length / tasks.length) * 100
        : 0;
    const isComplete = progress === 100;

    const toggle = (i: number) => {
        const task = tasks[i];
        if (!task.id) return;
        const checked = !task.checked;
        updateTask(task.id, { checked }).catch(console.error);
        setTasks(prev => prev.map((t, idx) => idx === i ? { ...t, checked } : t));
    };

    const removeCustomTask = (id: string) => {
        setTasks(prev => prev.filter(t => t.id !== id));
        deleteTask(id).catch(console.error);
    };

    const commitDraft = () => {
        const label = draft.trim();
        setDraft("");
        setAdding(false);
        if (label) {
            setSaving(true);
            saveTask(year, month, day, { label, checked: false, position: tasks.length, is_custom: true })
                .then(saved => setTasks(prev => [...prev, saved]))
                .catch(console.error)
                .finally(() => setSaving(false));
        }
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
            {...(isToday ? { "data-today": "true" } : {})}
        >
            {isToday && (
                <Badge appearance="filled" color="brand" size="small" className={styles.todayBadge}>
                    Today
                </Badge>
            )}

            {saving ? (
                <Spinner size="tiny" className={styles.progressCircle} />
            ) : tasks.length > 0 && (
                isComplete ? (
                    <CheckmarkCircle24Filled
                        className={mergeClasses(styles.progressCircle, styles.completedCircle)}
                        style={{ width: CIRCLE_SIZE, height: CIRCLE_SIZE, color: "hsl(120, 75%, 42%)" }}
                    />
                ) : (
                    <svg
                        width={CIRCLE_SIZE}
                        height={CIRCLE_SIZE}
                        viewBox={`0 0 ${CIRCLE_SIZE} ${CIRCLE_SIZE}`}
                        className={styles.progressCircle}
                    >
                        <circle
                            cx={CIRCLE_SIZE / 2}
                            cy={CIRCLE_SIZE / 2}
                            r={CIRCLE_RADIUS}
                            fill="none"
                            stroke={tokens.colorNeutralStroke2}
                            strokeWidth="3"
                        />
                        {progress > 0 && (
                            <circle
                                cx={CIRCLE_SIZE / 2}
                                cy={CIRCLE_SIZE / 2}
                                r={CIRCLE_RADIUS}
                                fill="none"
                                stroke={`hsl(${progress * 1.2}, 75%, 42%)`}
                                strokeWidth="3"
                                strokeLinecap="round"
                                strokeDasharray={CIRCUMFERENCE}
                                strokeDashoffset={CIRCUMFERENCE * (1 - progress / 100)}
                                transform={`rotate(-90 ${CIRCLE_SIZE / 2} ${CIRCLE_SIZE / 2})`}
                                style={{ transition: "stroke-dashoffset 0.4s ease" }}
                            />
                        )}
                        <text
                            x={CIRCLE_SIZE / 2}
                            y={CIRCLE_SIZE / 2}
                            textAnchor="middle"
                            dominantBaseline="central"
                            fontSize="8"
                            fontWeight="600"
                            fill={tokens.colorNeutralForeground2}
                        >
                            {Math.round(progress)}%
                        </text>
                    </svg>
                )
            )}

            <div className={styles.header}>
                <span className={styles.dayName}>{shortName}</span>
                <span className={styles.dayNumber}>{day}</span>
            </div>

            <div className={styles.body}>
                {tasks.filter(t => !t.is_custom).map((task) => {
                    const idx = tasks.indexOf(task);
                    return (
                        <Checkbox
                            key={idx}
                            className={styles.checkboxItem}
                            label={task.label}
                            checked={task.checked}
                            disabled={isReadOnly}
                            onChange={() => toggle(idx)}
                            onPointerDown={!isReadOnly ? (e) => {
                                if (e.pointerType === "touch") {
                                    e.preventDefault();
                                    toggle(idx);
                                }
                            } : undefined}
                        />
                    );
                })}

                {tasks.some(t => t.is_custom) && tasks.some(t => !t.is_custom) && (
                    <Divider className={styles.customDivider}>Custom</Divider>
                )}

                {tasks.filter(t => t.is_custom).map((task) => {
                    const idx = tasks.indexOf(task);
                    return (
                        <div key={`custom-${idx}`} className={styles.customTaskRow}>
                            <Checkbox
                                className={styles.customTaskCheckbox}
                                label={task.label}
                                checked={task.checked}
                                disabled={isReadOnly}
                                onChange={() => toggle(idx)}
                                onPointerDown={!isReadOnly ? (e) => {
                                    if (e.pointerType === "touch") {
                                        e.preventDefault();
                                        toggle(idx);
                                    }
                                } : undefined}
                            />
                            {task.id && (
                                <button
                                    className={styles.deleteTaskButton}
                                    onClick={() => removeCustomTask(task.id!)}
                                    onPointerDown={(e) => e.stopPropagation()}
                                >
                                    <DismissRegular fontSize={12} />
                                </button>
                            )}
                        </div>
                    );
                })}

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

                <button className={mergeClasses(styles.addButton, adding && styles.addButtonVisible)} onClick={() => setAdding(true)}>
                    + add task
                </button>
            </div>
        </div>
    );
};
