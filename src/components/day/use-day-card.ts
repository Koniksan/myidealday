import React, { useEffect, useState } from "react";
import { saveTask, updateTask, deleteTask, StoredTask } from "../../infrastructure/storages/day-storage";

interface UseDayCardOptions {
    year: number;
    month: number;
    day: number;
    initialTasks: StoredTask[];
}

export const useDayCard = ({ year, month, day, initialTasks }: UseDayCardOptions) => {
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
        commitDraft,
        onKeyDown,
    };
};
