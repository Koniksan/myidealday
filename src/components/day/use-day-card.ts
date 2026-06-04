import React, { useEffect, useRef, useState } from "react";
import { saveDay, StoredTask } from "../../infrastructure/storages/day-storage";

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
    const [adding, setAdding] = useState(false);
    const [draft, setDraft] = useState("");
    const [saving, setSaving] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(0, 0, 0, 0);

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    const cardDate = new Date(year, month, day);
    const isPast = cardDate <= yesterday;
    const isReadOnly = cardDate < yesterday || cardDate > tomorrow;

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

    const removeCustomTask = (id: string) => {
        persist(tasks.filter(x => x.id !== id));
    };

    const persistDraft = (label: string, currentTasks: StoredTask[]) => {
        setSaving(true);
        const newTask: StoredTask = {
            label,
            checked: false,
            position: currentTasks.length,
            is_custom: true,
            id: crypto.randomUUID(),
        };
        const newTasks = [...currentTasks, newTask];
        setTasks(newTasks);
        onTasksChange?.(newTasks);
        saveDay(toDateStr(year, month, day), newTasks)
            .catch(console.error)
            .finally(() => setSaving(false));
    };

    const submitDraft = () => {
        const label = draft.trim();
        setDraft("");
        if (label) persistDraft(label, tasks);
        inputRef.current?.focus();
    };

    const commitDraft = () => {
        const label = draft.trim();
        setDraft("");
        setAdding(false);
        if (label) persistDraft(label, tasks);
    };

    const onKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") submitDraft();
        if (e.key === "Escape") { setDraft(""); setAdding(false); }
    };

    return {
        tasks,
        adding,
        setAdding,
        draft,
        setDraft,
        saving,
        isPast,
        isReadOnly,
        progress,
        toggle,
        removeCustomTask,
        inputRef,
        commitDraft,
        onKeyDown,
    };
};
