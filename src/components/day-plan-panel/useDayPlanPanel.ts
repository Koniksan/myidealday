import { useEffect, useRef, useState } from "react";

interface UseDayPlanPanelProps {
    open: boolean;
    mode: "add" | "edit";
    planLabels: string[];
    onClose: () => void;
    addPlanToAllDays: (labels: string[]) => Promise<void>;
    editPlan: (labelsToAdd: string[], labelsToRemove: string[], orderedLabels: string[]) => Promise<void>;
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

    const originalLabels = useRef<string[]>(planLabels);
    const [items, setItems] = useState<string[]>(planLabels);
    const [draft, setDraft] = useState("");
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [editingValue, setEditingValue] = useState("");
    const [confirmDiscard, setConfirmDiscard] = useState(false);
    const [confirmReset, setConfirmReset] = useState(false);
    const [saving, setSaving] = useState(false);
    const dragIndex = useRef<number | null>(null);

    useEffect(() => {
        if (!open) return;
        originalLabels.current = planLabels;
        setItems(planLabels);
        setDraft("");
        setConfirmDiscard(false);
        setConfirmReset(false);
    }, [open]);

    useEffect(() => {
        if (!open) return;
        const prev = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => { document.body.style.overflow = prev; };
    }, [open]);

    const hasChanges = isEditMode
        ? JSON.stringify(items) !== JSON.stringify(originalLabels.current) || draft.trim().length > 0
        : items.length > 0 || draft.trim().length > 0;

    const handleOpenChange = (_: unknown, d: { open: boolean }) => {
        if (!d.open) {
            if (hasChanges) setConfirmDiscard(true);
            else onClose();
        }
    };

    const addItem = () => {
        const label = draft.trim();
        if (label && !items.includes(label)) {
            setItems(prev => [...prev, label]);
            setDraft("");
        }
    };

    const removeItem = (index: number) =>
        setItems(prev => prev.filter((_, i) => i !== index));

    const startEditing = (index: number) => {
        setEditingIndex(index);
        setEditingValue(items[index]);
    };

    const commitEdit = () => {
        if (editingIndex === null) return;
        const value = editingValue.trim();
        if (value && !items.some((l, i) => l === value && i !== editingIndex)) {
            setItems(prev => prev.map((l, i) => i === editingIndex ? value : l));
        }
        setEditingIndex(null);
        setEditingValue("");
    };

    const cancelEdit = () => {
        setEditingIndex(null);
        setEditingValue("");
    };

    const handleDragStart = (i: number) => { dragIndex.current = i; };

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
    };

    const handleDragEnd = () => { dragIndex.current = null; };

    const handleTouchStart = (i: number) => {
        dragIndex.current = i;

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
        };

        const onEnd = () => {
            dragIndex.current = null;
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
                const labelsToRemove = originalLabels.current.filter(l => !items.includes(l));
                const labelsToAdd = items.filter(l => !originalLabels.current.includes(l));
                await editPlan(labelsToAdd, labelsToRemove, items);
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
        handleDragStart,
        handleDragOver,
        handleDragEnd,
        handleTouchStart,
        apply,
        reset,
    };
};
