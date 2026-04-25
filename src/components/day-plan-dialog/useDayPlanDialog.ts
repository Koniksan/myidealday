import { useRef, useState } from "react";

interface UseDayPlanDialogProps {
    mode: "add" | "edit";
    planLabels: string[];
    onClose: () => void;
    addPlanToAllDays: (labels: string[]) => Promise<void>;
    editPlan: (labelsToAdd: string[], labelsToRemove: string[], orderedLabels: string[]) => Promise<void>;
    resetPlan: () => Promise<void>;
}

export const useDayPlanDialog = ({
    mode,
    planLabels,
    onClose,
    addPlanToAllDays,
    editPlan,
    resetPlan,
}: UseDayPlanDialogProps) => {
    const isEditMode = mode === "edit";

    const [originalLabels] = useState<string[]>(planLabels);
    const [items, setItems] = useState<string[]>(planLabels);
    const [draft, setDraft] = useState("");
    const [confirmDiscard, setConfirmDiscard] = useState(false);
    const [confirmReset, setConfirmReset] = useState(false);
    const dragIndex = useRef<number | null>(null);

    const hasChanges = isEditMode
        ? JSON.stringify(items) !== JSON.stringify(originalLabels) || draft.trim().length > 0
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

    const apply = () => {
        if (isEditMode) {
            const labelsToRemove = originalLabels.filter(l => !items.includes(l));
            const labelsToAdd = items.filter(l => !originalLabels.includes(l));
            editPlan(labelsToAdd, labelsToRemove, items).catch(console.error);
        } else {
            if (items.length > 0) addPlanToAllDays(items).catch(console.error);
        }
        onClose();
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
