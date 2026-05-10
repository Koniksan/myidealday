import React, { useEffect, useRef, useState } from "react";
import { PlanItem } from "../../infrastructure/storages/day-storage";

interface UseDayPlanPanelProps {
    open: boolean;
    mode: "add" | "edit";
    planLabels: PlanItem[];
    onClose: () => void;
    addPlanToAllDays: (items: PlanItem[]) => Promise<void>;
    editPlan: (itemsToAdd: PlanItem[], labelsToRemove: string[], orderedLabels: string[], colorChanges: PlanItem[]) => Promise<void>;
    resetPlan: () => Promise<void>;
}

export const useDayPlanPanel = ({
    open,
    mode,
    planLabels,
    onClose,
    addPlanToAllDays,
    editPlan,
    resetPlan,
}: UseDayPlanPanelProps) => {
    const isEditMode = mode === "edit";

    const originalItems = useRef<PlanItem[]>(planLabels);
    const [items, setItems] = useState<PlanItem[]>(planLabels);
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
        if (!open) return;
        originalItems.current = planLabels;
        setItems(planLabels);
        setDraft("");
        setOpenPickerIndex(null);
        setEditingIndex(null);
        setEditingValue("");
        setConfirmDiscard(false);
        setConfirmReset(false);
    }, [open]);

    useEffect(() => {
        if (!open) return;
        const prev = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => { document.body.style.overflow = prev; };
    }, [open]);

    const hasChanges = JSON.stringify(items) !== JSON.stringify(originalItems.current);

    const handleOpenChange = (_: unknown, d: { open: boolean }) => {
        if (!d.open) {
            if (hasChanges) setConfirmDiscard(true);
            else onClose();
        }
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
            onClose();
        } catch (e) {
            console.error(e);
        } finally {
            setSaving(false);
        }
    };

    const reset = () => {
        resetPlan().catch(console.error);
        setConfirmReset(false);
        onClose();
    };

    return {
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
        handleOpenChange,
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
