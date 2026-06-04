import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLocalization } from "../../infrastructure/context/locale-context";
import {
    loadPlan,
    savePlan,
    deleteDaysFromDate,
    PlanItem,
} from "../../infrastructure/storages/day-storage";

export const useHabitPage = () => {
    const navigate = useNavigate();
    const rs = useLocalization();

    const realToday = new Date();
    const year = realToday.getFullYear();
    const month = realToday.getMonth();
    const today = realToday.getDate();

    const monthName = new Date(year, month).toLocaleString(rs.DateLocale, { month: "long" });

    const toDateStr = (day: number) =>
        `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

    const [loading, setLoading] = useState(true);
    const originalItems = useRef<PlanItem[]>([]);
    const isEditModeRef = useRef(false);
    const [items, setItems] = useState<PlanItem[]>([]);
    const [draft, setDraft] = useState("");
    const [openPickerIndex, setOpenPickerIndex] = useState<number | null>(null);
    const [openTimePickerIndex, setOpenTimePickerIndex] = useState<number | null>(null);
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [editingValue, setEditingValue] = useState("");
    const [confirmDiscard, setConfirmDiscard] = useState(false);
    const [confirmReset, setConfirmReset] = useState(false);
    const [saving, setSaving] = useState(false);
    const dragIndex = useRef<number | null>(null);
    const [draggingIndex, setDraggingIndex] = useState<number | null>(null);

    useEffect(() => {
        loadPlan()
            .then(plan => {
                originalItems.current = plan;
                isEditModeRef.current = plan.length > 0;
                setItems(plan);
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    const hasChanges = JSON.stringify(items) !== JSON.stringify(originalItems.current);
    const isEditMode = isEditModeRef.current;

    const handleBack = () => {
        if (hasChanges) setConfirmDiscard(true);
        else navigate("/home");
    };

    const handleDiscard = () => {
        setConfirmDiscard(false);
        navigate("/home");
    };

    const addItem = () => {
        const label = draft.trim();
        if (label && !items.some(x => x.label === label)) {
            setItems(prev => [...prev, { label, color: null }]);
            setDraft("");
        }
    };

    const removeItem = (index: number) => {
        setItems(prev => prev.filter((_, i) => i !== index));
        if (openPickerIndex === index) setOpenPickerIndex(null);
        if (openTimePickerIndex === index) setOpenTimePickerIndex(null);
    };

    const setItemColor = (index: number, color: string | null) => {
        setItems(prev => prev.map((x, i) => i === index ? { ...x, color } : x));
        setOpenPickerIndex(null);
    };

    const setItemTime = (index: number, patch: Partial<Pick<PlanItem, "time_mode" | "time_exact" | "time_start" | "time_end">>) => {
        setItems(prev => prev.map((x, i) => i === index ? { ...x, ...patch } : x));
    };

    const togglePicker = (index: number) => {
        setOpenPickerIndex(prev => prev === index ? null : index);
        setOpenTimePickerIndex(null);
    };

    const toggleTimePicker = (index: number) => {
        setOpenTimePickerIndex(prev => prev === index ? null : index);
        setOpenPickerIndex(null);
    };

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

    const apply = async () => {
        if (saving) return;
        setSaving(true);
        try {
            await savePlan(items);
            navigate("/home");
        } catch (e) {
            console.error(e);
        } finally {
            setSaving(false);
        }
    };

    const reset = async () => {
        try {
            await Promise.all([savePlan([]), deleteDaysFromDate(toDateStr(today))]);
        } catch (e) {
            console.error(e);
        }
        setConfirmReset(false);
        navigate("/home");
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
        openTimePickerIndex,
        toggleTimePicker,
        setItemTime,
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
