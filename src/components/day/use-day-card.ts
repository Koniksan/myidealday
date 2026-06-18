import { useEffect, useState } from "react";
import { PlanItem, saveDay, StoredTask } from "../../infrastructure/storages/day-storage";

interface UseDayCardOptions {
    year: number;
    month: number;
    day: number;
    initialTasks: StoredTask[];
    onTasksChange?: (tasks: StoredTask[]) => void;
}

const toDateStr = (year: number, month: number, day: number) =>
    `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

export const useDayCard = ({ year, month, day, initialTasks, onTasksChange }: UseDayCardOptions) => {
    const [tasks, setTasks] = useState<StoredTask[]>(initialTasks);
    const [editPanelOpen, setEditPanelOpen] = useState(false);

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(0, 0, 0, 0);

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    const cardDate = new Date(year, month, day);
    const isPast = cardDate <= yesterday;
    const isReadOnly = cardDate >= tomorrow;

    useEffect(() => {
        setTasks(initialTasks);
    }, [initialTasks]);

    const progress = tasks.length > 0
        ? (tasks.filter(t => t.checked).length / tasks.length) * 100
        : 0;

    const persist = (newTasks: StoredTask[]) => {
        setTasks(newTasks);
        onTasksChange?.(newTasks);
        saveDay(toDateStr(year, month, day), newTasks).catch(console.error);
    };

    const toggle = (i: number) => {
        persist(tasks.map((x, idx) => idx === i ? { ...x, checked: !x.checked } : x));
    };

const onSaveFromPanel = (items: PlanItem[]) => {
        const newTasks: StoredTask[] = items.map((x, i) => {
            const s = x as StoredTask;
            if (typeof s.checked === "undefined") {
                return {
                    label: s.label,
                    checked: false,
                    position: i,
                    is_custom: true,
                    id: crypto.randomUUID(),
                    ...(s.color != null && { color: s.color }),
                    ...(s.time_mode != null && { time_mode: s.time_mode }),
                    ...(s.time_exact != null && { time_exact: s.time_exact }),
                    ...(s.time_start != null && { time_start: s.time_start }),
                    ...(s.time_end != null && { time_end: s.time_end }),
                };
            }
            return { ...s, position: i };
        });
        persist(newTasks);
    };

    return {
        tasks,
        isPast,
        isReadOnly,
        progress,
        toggle,
        editPanelOpen,
        setEditPanelOpen,
        onSaveFromPanel,
    };
};
