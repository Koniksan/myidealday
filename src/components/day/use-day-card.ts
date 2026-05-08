import React, { useEffect, useRef, useState } from "react";
import { saveTask, updateTask, deleteTask, StoredTask } from "../../infrastructure/storages/day-storage";

interface UseDayCardOptions {
    year: number;
    month: number;
    day: number;
    initialTasks: StoredTask[];
    onTasksChange?: (tasks: StoredTask[]) => void;
}

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

    const toggle = (i: number) => {
        const task = tasks[i];
        if (!task.id) return;
        const checked = !task.checked;
        updateTask(task.id, { checked }).catch(console.error);
        const newTasks = tasks.map((t, idx) => idx === i ? { ...t, checked } : t);
        setTasks(newTasks);
        onTasksChange?.(newTasks);
    };

    const removeCustomTask = (id: string) => {
        const newTasks = tasks.filter(t => t.id !== id);
        setTasks(newTasks);
        deleteTask(id).catch(console.error);
        onTasksChange?.(newTasks);
    };

    const persistDraft = (label: string, currentTasks: StoredTask[]) => {
        setSaving(true);
        saveTask(year, month, day, { label, checked: false, position: currentTasks.length, is_custom: true })
            .then(saved => {
                const newTasks = [...currentTasks, saved];
                setTasks(newTasks);
                onTasksChange?.(newTasks);
            })
            .catch(console.error)
            .finally(() => setSaving(false));
    };

    // Enter: save current draft but keep input open for the next task
    const submitDraft = () => {
        const label = draft.trim();
        setDraft("");
        if (label) persistDraft(label, tasks);
        inputRef.current?.focus();
    };

    // Blur: save any pending draft and close the input
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
