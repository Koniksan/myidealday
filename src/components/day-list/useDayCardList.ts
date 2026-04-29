import { useEffect, useMemo, useRef, useState, RefObject } from "react";
import { DayCardProps } from "../day";
import {
    loadTasksForMonth,
    bulkSaveTasksForMonth,
    deleteTasksByLabelForMonth,
    deleteAllTasksFromDate,
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
    resetPlan: () => Promise<void>;
    prevMonth: () => void;
    nextMonth: () => void;
    goToToday: () => void;
}

export const useDayCardList = (): UseDayCardListResult => {
    const realToday = new Date();
    const todayYear = realToday.getFullYear();
    const todayMonth = realToday.getMonth();
    const today = realToday.getDate();

    const [selectedDate, setSelectedDate] = useState<Date>(() => {
        const d = new Date();
        d.setDate(1);
        return d;
    });
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth();
    const monthName = selectedDate.toLocaleString("default", { month: "long" });
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const prevMonth = () => setSelectedDate(d => {
        const next = new Date(d);
        next.setMonth(next.getMonth() - 1);
        return next;
    });

    const nextMonth = () => setSelectedDate(d => {
        const next = new Date(d);
        next.setMonth(next.getMonth() + 1);
        return next;
    });

    const goToToday = () => {
        if (year === todayYear && month === todayMonth) {
            document.querySelector("[data-today]")?.scrollIntoView({ behavior: "smooth", block: "center", inline: "center" });
        } else {
            setSelectedDate(new Date(todayYear, todayMonth, 1));
        }
    };

    const isFutureMonth = year > todayYear || (year === todayYear && month > todayMonth);
    const fromDay = isFutureMonth ? 1 : today;

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
        const todayStr = toDateString(today);
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
            .map(t => t.label);
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
            isToday: year === todayYear && month === todayMonth && day === today,
            isWeekend: dow === 0 || dow === 6,
            initialTasks: daysByDate[toDateString(day)]?.tasks ?? [],
        };
    });

    const addPlanToAllDays = async (labels: string[]) => {
        const newByDate = await bulkSaveTasksForMonth(year, month, labels, 0, fromDay);
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
        await Promise.all(labelsToRemove.map(label => deleteTasksByLabelForMonth(year, month, label, fromDay)));

        if (labelsToRemove.length > 0) {
            setDaysByDate(prev => {
                const updated = { ...prev };
                for (const date of Object.keys(updated)) {
                    if (date >= toDateString(fromDay)) {
                        updated[date] = { ...updated[date], tasks: updated[date].tasks.filter(t => !labelsToRemove.includes(t.label)) };
                    }
                }
                return updated;
            });
        }

        if (labelsToAdd.length > 0) {
            const newByDate = await bulkSaveTasksForMonth(year, month, labelsToAdd, planLabels.length, fromDay);
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
                if (date >= toDateString(fromDay)) {
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

    const resetPlan = async () => {
        const fromStr = toDateString(fromDay);
        await deleteAllTasksFromDate(fromStr);
        setDaysByDate(prev => {
            const updated = { ...prev };
            for (const date of Object.keys(updated)) {
                if (date >= fromStr) {
                    updated[date] = { ...updated[date], tasks: [] };
                }
            }
            return updated;
        });
    };

    useEffect(() => {
        if (loading) return;
        if (year === todayYear && month === todayMonth) {
            document.querySelector("[data-today]")?.scrollIntoView({ behavior: "smooth", block: "center", inline: "center" });
        } else {
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    }, [loading]);

    return { days, monthName, year, planLabels, loading, gridRef, addPlanToAllDays, editPlan, resetPlan, prevMonth, nextMonth, goToToday };
};
