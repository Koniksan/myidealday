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
        apply,
        reset,
    };
};
