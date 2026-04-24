import { useEffect, useMemo, useRef, useState, RefObject } from "react";
import { DayCardProps } from "../day";
import {
    loadTasksForMonth,
    bulkSaveTasksForMonth,
    deleteTasksByLabelForMonth,
    reorderTasksByLabelsForMonth,
    StoredDay,
} from "../../infrastructure/storages/day-storage";

interface UseDayCardListResult {
    days: DayCardProps[];
    monthName: string;
    year: number;
    planLabels: string[];
    loading: boolean;
    gridRef: RefObject<HTMLDivElement | null>;
    addPlanToAllDays: (labels: string[]) => Promise<void>;
    editPlan: (labelsToAdd: string[], labelsToRemove: string[], orderedLabels: string[]) => Promise<void>;
}

export const useDayCardList = (): UseDayCardListResult => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const monthName = now.toLocaleString("default", { month: "long" });
    const today = now.getDate();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const gridRef = useRef<HTMLDivElement>(null);
    const [daysByDate, setDaysByDate] = useState<Record<string, StoredDay>>({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        loadTasksForMonth(year, month)
            .then(setDaysByDate)
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [year, month]);

    const toDateString = (day: number) =>
        `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

    const planLabels = useMemo(() => {
        const firstDay = Object.values(daysByDate).find(d => d.tasks.length > 0);
        return firstDay ? firstDay.tasks.map(t => t.label) : [];
    }, [daysByDate]);

    const days: DayCardProps[] = Array.from({ length: daysInMonth }, (_, i) => {
        const date = new Date(year, month, i + 1);
        const dow = date.getDay();
        const day = i + 1;
        return {
            year,
            month,
            day,
            shortName: date.toLocaleString("default", { weekday: "short" }),
            isToday: day === today,
            isWeekend: dow === 0 || dow === 6,
            initialTasks: daysByDate[toDateString(day)]?.tasks ?? [],
        };
    });

    const addPlanToAllDays = async (labels: string[]) => {
        const newByDate = await bulkSaveTasksForMonth(year, month, labels, 0, today);
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

    const editPlan = async (labelsToAdd: string[], labelsToRemove: string[], orderedLabels: string[]) => {
        await Promise.all(labelsToRemove.map(label => deleteTasksByLabelForMonth(year, month, label, today)));

        if (labelsToRemove.length > 0) {
            setDaysByDate(prev => {
                const updated = { ...prev };
                for (const date of Object.keys(updated)) {
                    if (date >= toDateString(today)) {
                        updated[date] = { ...updated[date], tasks: updated[date].tasks.filter(t => !labelsToRemove.includes(t.label)) };
                    }
                }
                return updated;
            });
        }

        if (labelsToAdd.length > 0) {
            const newByDate = await bulkSaveTasksForMonth(year, month, labelsToAdd, planLabels.length, today);
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

        await reorderTasksByLabelsForMonth(year, month, orderedLabels, today);
        setDaysByDate(prev => {
            const updated = { ...prev };
            for (const date of Object.keys(updated)) {
                if (date >= toDateString(today)) {
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

    useEffect(() => {
        if (loading) return;
        document.querySelector("[data-today]")?.scrollIntoView({ behavior: "instant", block: "center", inline: "center" });
    }, [loading]);

    return { days, monthName, year, planLabels, loading, gridRef, addPlanToAllDays, editPlan };
};
