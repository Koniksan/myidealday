import { useState } from "react";
import { deleteDaysFromDate, loadPlan, PlanItem, savePlan } from "../../../infrastructure";

export const useBottomNav = () => {
    const [panelOpen, setPanelOpen] = useState(false);
    const [planLabels, setPlanLabels] = useState<PlanItem[]>([]);
    const [mode, setMode] = useState<"add" | "edit">("add");

    const openPanel = async () => {
        const plan = await loadPlan();
        setPlanLabels(plan);
        setMode(plan.length > 0 ? "edit" : "add");
        setPanelOpen(true);
    };

    const closePanel = () => setPanelOpen(false);

    const addPlanToAllDays = async (items: PlanItem[]) => {
        const newPlan = [...planLabels, ...items];
        await savePlan(newPlan);
        setPlanLabels(newPlan);
    };

    const editPlan = async (itemsToAdd: PlanItem[], labelsToRemove: string[], orderedLabels: string[], fieldChanges: PlanItem[]) => {
        let newPlan = planLabels
            .filter(x => !labelsToRemove.includes(x.label))
            .concat(itemsToAdd)
            .map(x => {
                const change = fieldChanges.find(c => c.label === x.label);
                return change ? { ...x, ...change } : x;
            });
        newPlan = orderedLabels
            .map(label => newPlan.find(x => x.label === label))
            .filter((x): x is PlanItem => x !== undefined)
            .concat(newPlan.filter(x => !orderedLabels.includes(x.label)));
        await savePlan(newPlan);
        setPlanLabels(newPlan);
    };

    const resetPlan = async () => {
        const today = new Date();
        const fromStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
        await Promise.all([savePlan([]), deleteDaysFromDate(fromStr)]);
        setPlanLabels([]);
    };

    return { panelOpen, planLabels, mode, openPanel, closePanel, addPlanToAllDays, editPlan, resetPlan };
};
