import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLocalization } from "../../infrastructure/context/locale-context";
import {
    loadTasksForMonth,
    bulkSaveTasksForMonth,
    deleteTasksByLabelForMonth,
    deleteAllTasksFromDate,
    reorderTasksByLabelsForMonth,
    updateTaskColorByLabel,
    StoredDay,
    PlanItem,
} from "../../infrastructure/storages/day-storage";

export const useHabitPage = () => {
    const navigate = useNavigate();
    const rs = useLocalization();

    const realToday = new Date();
    const year = realToday.getFullYear();
    const month = realToday.getMonth();
    const today = realToday.getDate();
    const fromDay = today;

    const monthName = useMemo(
        () => new Date(year, month).toLocaleString(rs.DateLocale, { month: "long" }),
        [rs.DateLocale, year, month]
    );

    const toDateStr = (day: number) =>
        `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

    const [daysByDate, setDaysByDate] = useState<Record<string, StoredDay>>({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadTasksForMonth(year, month)
            .then(setDaysByDate)
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    const planLabels = useMemo(() => {
        const todayStr = toDateStr(today);
        const activeDays = Object.values(daysByDate)
            .filter(d => d.date >= todayStr && d.tasks.length > 0)
            .sort((a, b) => a.date.localeCompare(b.date));

        if (activeDays.length === 0) return [];

        const universalLabels = new Set(
            [...new Set(activeDays.flatMap(d => d.tasks.map(t => t.label)))]
                .filter(label => activeDays.every(d => d.tasks.some(t => t.label === label)))
        );

        return activeDays[0].tasks
            .filter(t => universalLabels.has(t.label))
            .map(t => ({ label: t.label, color: t.color ?? null }));
    }, [daysByDate]);

    // Editing state
    const originalItems = useRef<PlanItem[]>([]);
    const isEditModeRef = useRef(false);
    const initialized = useRef(false);
    const [items, setItems] = useState<PlanItem[]>([]);
    const [draft, setDraft] = useState("");
    const [openPickerIndex, setOpenPickerIndex] = useState<number | null>(null);
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [editingValue, setEditingValue] = useState("");
    const [confirmDiscard, setConfirmDiscard] = useState(false);
    const [confirmReset, setConfirmReset] = useState(false);
    const [saving, setSaving] = useState(false);
    const dragIndex = useRef<number | null>(null);
    const [draggingIndex, setDraggingIndex] = useState<number | null>(null);

    useEffect(() => {
        if (loading || initialized.current) return;
        initialized.current = true;
        originalItems.current = planLabels;
        isEditModeRef.current = planLabels.length > 0;
        setItems(planLabels);
    }, [loading, planLabels]);

    const hasChanges = JSON.stringify(items) !== JSON.stringify(originalItems.current);
    const isEditMode = isEditModeRef.current;

    const handleBack = () => {
        if (hasChanges) setConfirmDiscard(true);
        else navigate("/user");
    };

    const handleDiscard = () => {
        setConfirmDiscard(false);
        navigate("/user");
    };

    const addItem = () => {
        const label = draft.trim();
        if (label && !items.some(i => i.label === label)) {
            setItems(prev => [...prev, { label, color: null }]);
            setDraft("");
        }
    };

    const removeItem = (index: number) => {
        setItems(prev => prev.filter((_, i) => i !== index));
        if (openPickerIndex === index) setOpenPickerIndex(null);
    };

    const setItemColor = (index: number, color: string | null) => {
        setItems(prev => prev.map((item, i) => i === index ? { ...item, color } : item));
        setOpenPickerIndex(null);
    };

    const togglePicker = (index: number) =>
        setOpenPickerIndex(prev => prev === index ? null : index);

    const startEditing = (index: number) => {
        setEditingIndex(index);
        setEditingValue(items[index].label);
        setOpenPickerIndex(null);
    };

    const commitEdit = () => {
        if (editingIndex === null) return;
        const value = editingValue.trim();
        if (value && !items.some((item, i) => item.label === value && i !== editingIndex)) {
            setItems(prev => prev.map((item, i) => i === editingIndex ? { ...item, label: value } : item));
        }
        setEditingIndex(null);
        setEditingValue("");
    };

    const cancelEdit = () => {
        setEditingIndex(null);
        setEditingValue("");
    };

    const handleDragStart = (i: number) => {
        dragIndex.current = i;
        setDraggingIndex(i);
    };

    const handleDragOver = (e: React.DragEvent, i: number) => {
        e.preventDefault();
        if (dragIndex.current === null || dragIndex.current === i) return;
        setItems(prev => {
            const next = [...prev];
            const [item] = next.splice(dragIndex.current!, 1);
            next.splice(i, 0, item);
            dragIndex.current = i;
            return next;
        });
        setDraggingIndex(i);
    };

    const handleDragEnd = () => {
        dragIndex.current = null;
        setDraggingIndex(null);
    };

    const handleTouchStart = (i: number) => {
        dragIndex.current = i;
        setDraggingIndex(i);

        const onMove = (e: TouchEvent) => {
            e.preventDefault();
            const touch = e.touches[0];
            const el = document.elementFromPoint(touch.clientX, touch.clientY);
            const item = el?.closest("[data-drag-index]");
            if (!item) return;
            const targetIndex = parseInt(item.getAttribute("data-drag-index") ?? "-1", 10);
            if (targetIndex < 0 || targetIndex === dragIndex.current) return;
            setItems(prev => {
                const next = [...prev];
                const [moved] = next.splice(dragIndex.current!, 1);
                next.splice(targetIndex, 0, moved);
                dragIndex.current = targetIndex;
                return next;
            });
            setDraggingIndex(targetIndex);
        };

        const onEnd = () => {
            dragIndex.current = null;
            setDraggingIndex(null);
            document.removeEventListener("touchmove", onMove);
            document.removeEventListener("touchend", onEnd);
        };

        document.addEventListener("touchmove", onMove, { passive: false });
        document.addEventListener("touchend", onEnd);
    };

    // Plan operations
    const addPlanToAllDays = async (newItems: PlanItem[]) => {
        const newByDate = await bulkSaveTasksForMonth(year, month, newItems, 0, fromDay);
        setDaysByDate(prev => {
            const updated = { ...prev };
            for (const [date, newDay] of Object.entries(newByDate)) {
                if (updated[date]) {
                    updated[date] = { ...updated[date], tasks: [...updated[date].tasks, ...newDay.tasks] };
                } else {
                    updated[date] = newDay;
                }
            }
            return updated;
        });
    };

    const editPlan = async (itemsToAdd: PlanItem[], labelsToRemove: string[], orderedLabels: string[], colorChanges: PlanItem[]) => {
        await Promise.all(labelsToRemove.map(label => deleteTasksByLabelForMonth(year, month, label, fromDay)));

        if (labelsToRemove.length > 0) {
            setDaysByDate(prev => {
                const updated = { ...prev };
                for (const date of Object.keys(updated)) {
                    if (date >= toDateStr(fromDay)) {
                        updated[date] = { ...updated[date], tasks: updated[date].tasks.filter(t => !labelsToRemove.includes(t.label)) };
                    }
                }
                return updated;
            });
        }

        if (colorChanges.length > 0) {
            await Promise.all(colorChanges.map(item => updateTaskColorByLabel(year, month, item.label, item.color ?? null, fromDay)));
            setDaysByDate(prev => {
                const updated = { ...prev };
                const colorMap = new Map(colorChanges.map(i => [i.label, i.color ?? null]));
                for (const date of Object.keys(updated)) {
                    if (date >= toDateStr(fromDay)) {
                        updated[date] = { ...updated[date], tasks: updated[date].tasks.map(t => colorMap.has(t.label) ? { ...t, color: colorMap.get(t.label) } : t) };
                    }
                }
                return updated;
            });
        }

        if (itemsToAdd.length > 0) {
            const newByDate = await bulkSaveTasksForMonth(year, month, itemsToAdd, originalItems.current.length, fromDay);
            setDaysByDate(prev => {
                const updated = { ...prev };
                for (const [date, newDay] of Object.entries(newByDate)) {
                    if (updated[date]) {
                        updated[date] = { ...updated[date], tasks: [...updated[date].tasks, ...newDay.tasks] };
                    } else {
                        updated[date] = newDay;
                    }
                }
                return updated;
            });
        }

        await reorderTasksByLabelsForMonth(year, month, orderedLabels, fromDay);
        setDaysByDate(prev => {
            const updated = { ...prev };
            for (const date of Object.keys(updated)) {
                if (date >= toDateStr(fromDay)) {
                    const reordered = orderedLabels
                        .map(label => updated[date].tasks.find(t => t.label === label))
                        .filter((t): t is NonNullable<typeof t> => t !== undefined);
                    const rest = updated[date].tasks.filter(t => !orderedLabels.includes(t.label));
                    updated[date] = { ...updated[date], tasks: [...reordered, ...rest] };
                }
            }
            return updated;
        });
    };

    const apply = async () => {
        if (saving) return;
        setSaving(true);
        try {
            if (isEditMode) {
                const origLabels = originalItems.current.map(i => i.label);
                const currentLabels = items.map(i => i.label);
                const labelsToRemove = origLabels.filter(l => !currentLabels.includes(l));
                const itemsToAdd = items.filter(item => !origLabels.includes(item.label));
                const colorChanges = items.filter(item => {
                    const orig = originalItems.current.find(o => o.label === item.label);
                    return orig && orig.color !== item.color;
                });
                await editPlan(itemsToAdd, labelsToRemove, currentLabels, colorChanges);
            } else {
                if (items.length > 0) await addPlanToAllDays(items);
            }
            navigate("/user");
        } catch (e) {
            console.error(e);
        } finally {
            setSaving(false);
        }
    };

    const reset = async () => {
        try {
            const fromStr = toDateStr(fromDay);
            await deleteAllTasksFromDate(fromStr);
        } catch (e) {
            console.error(e);
        }
        setConfirmReset(false);
        navigate("/user");
    };

    return {
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
    };
};
