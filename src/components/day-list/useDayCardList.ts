import { useEffect, useMemo, useRef, useState, RefObject } from "react";
import { useLocalization } from "../../infrastructure/context/locale-context";
import { DayCardProps } from "../day";
import {
    loadTasksForMonth,
    bulkSaveTasksForMonth,
    deleteTasksByLabelForMonth,
    deleteAllTasksFromDate,
    reorderTasksByLabelsForMonth,
    updateTaskColorByLabel,
    StoredDay,
    StoredTask,
    PlanItem,
} from "../../infrastructure/storages/day-storage";

interface UseDayCardListResult {
    days: DayCardProps[];
    offsetDays: DayCardProps[];
    selectedDay: number;
    setSelectedDay: (day: number) => void;
    selectedDayProps: DayCardProps;
    monthName: string;
    year: number;
    month: number;
    firstDayOffset: number;
    planLabels: PlanItem[];
    loading: boolean;
    gridRef: RefObject<HTMLDivElement | null>;
    addPlanToAllDays: (items: PlanItem[]) => Promise<void>;
    editPlan: (itemsToAdd: PlanItem[], labelsToRemove: string[], orderedLabels: string[], colorChanges: PlanItem[]) => Promise<void>;
    resetPlan: () => Promise<void>;
    prevMonth: () => void;
    nextMonth: () => void;
    goToToday: () => void;
    showGoToToday: boolean;
    updateDayTasks: (day: number, tasks: StoredTask[]) => void;
}

export const useDayCardList = (): UseDayCardListResult => {
    const rs = useLocalization();
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
    const monthName = selectedDate.toLocaleString(rs.DateLocale, { month: "long" });
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

    const scrollToToday = () => {
        const el = [...document.querySelectorAll("[data-today]")].find(e => e.getBoundingClientRect().width > 0);
        el?.scrollIntoView({ behavior: "smooth", block: "center", inline: "center" });
    };

    const goToToday = () => {
        if (year === todayYear && month === todayMonth) {
            scrollToToday();
        } else {
            setSelectedDate(new Date(todayYear, todayMonth, 1));
        }
    };

    const isViewingToday = year === todayYear && month === todayMonth;
    const isFutureMonth = year > todayYear || (year === todayYear && month > todayMonth);
    const fromDay = isFutureMonth ? 1 : today;

    const [selectedDay, setSelectedDay] = useState<number>(today);

    useEffect(() => {
        setSelectedDay(year === todayYear && month === todayMonth ? today : 1);
    }, [year, month]);

    const gridRef = useRef<HTMLDivElement>(null);
    const [daysByDate, setDaysByDate] = useState<Record<string, StoredDay>>({});
    const [prevMonthDaysByDate, setPrevMonthDaysByDate] = useState<Record<string, StoredDay>>({});
    const [loading, setLoading] = useState(true);

    const [isTodayInView, setIsTodayInView] = useState(true);

    useEffect(() => {
        if (!isViewingToday || loading) {
            setIsTodayInView(true);
            return;
        }

        const todayEls = Array.from(document.querySelectorAll<Element>("[data-today]"));
        if (todayEls.length === 0) return;

        const intersecting = new Set<Element>();
        const observer = new IntersectionObserver((entries) => {
            for (const entry of entries) {
                if (entry.isIntersecting) intersecting.add(entry.target);
                else intersecting.delete(entry.target);
            }
            setIsTodayInView(intersecting.size > 0);
        }, { threshold: 0.5 });

        todayEls.forEach(el => observer.observe(el));
        return () => observer.disconnect();
    }, [isViewingToday, loading]);

    const firstDayOffset = (new Date(year, month, 1).getDay() + 6) % 7;
    const prevYear = month === 0 ? year - 1 : year;
    const prevMonthIndex = month === 0 ? 11 : month - 1;

    useEffect(() => {
        setLoading(true);
        loadTasksForMonth(year, month)
            .then(setDaysByDate)
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [year, month]);

    useEffect(() => {
        if (firstDayOffset === 0) { setPrevMonthDaysByDate({}); return; }
        loadTasksForMonth(prevYear, prevMonthIndex)
            .then(setPrevMonthDaysByDate)
            .catch(console.error);
    }, [prevYear, prevMonthIndex, firstDayOffset]);

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
            .map(t => ({ label: t.label, color: t.color ?? null }));
    }, [daysByDate]);

    const days: DayCardProps[] = Array.from({ length: daysInMonth }, (_, i) => {
        const date = new Date(year, month, i + 1);
        const dow = date.getDay();
        const day = i + 1;
        return {
            year,
            month,
            day,
            shortName: date.toLocaleString(rs.DateLocale, { weekday: "short" }),
            isToday: year === todayYear && month === todayMonth && day === today,
            isWeekend: dow === 0 || dow === 6,
            initialTasks: daysByDate[toDateString(day)]?.tasks ?? [],
        };
    });

    const prevMonthLastDay = new Date(year, month, 0).getDate();
    const toPrevDateString = (day: number) =>
        `${prevYear}-${String(prevMonthIndex + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

    const offsetDays: DayCardProps[] = Array.from({ length: firstDayOffset }, (_, i) => {
        const day = prevMonthLastDay - firstDayOffset + 1 + i;
        const date = new Date(prevYear, prevMonthIndex, day);
        const dow = date.getDay();
        return {
            year: prevYear,
            month: prevMonthIndex,
            day,
            shortName: date.toLocaleString(rs.DateLocale, { weekday: "short" }),
            isToday: false,
            isWeekend: dow === 0 || dow === 6,
            initialTasks: prevMonthDaysByDate[toPrevDateString(day)]?.tasks ?? [],
        };
    });

    const addPlanToAllDays = async (items: PlanItem[]) => {
        const newByDate = await bulkSaveTasksForMonth(year, month, items, 0, fromDay);
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
                    if (date >= toDateString(fromDay)) {
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
                    if (date >= toDateString(fromDay)) {
                        updated[date] = { ...updated[date], tasks: updated[date].tasks.map(t => colorMap.has(t.label) ? { ...t, color: colorMap.get(t.label) } : t) };
                    }
                }
                return updated;
            });
        }

        if (itemsToAdd.length > 0) {
            const newByDate = await bulkSaveTasksForMonth(year, month, itemsToAdd, planLabels.length, fromDay);
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
            scrollToToday();
        } else {
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    }, [loading]);

    const selectedDayDate = new Date(year, month, selectedDay);
    const selectedDayProps: DayCardProps = {
        year,
        month,
        day: selectedDay,
        shortName: selectedDayDate.toLocaleString(rs.DateLocale, { weekday: "short" }),
        isToday: year === todayYear && month === todayMonth && selectedDay === today,
        isWeekend: [0, 6].includes(selectedDayDate.getDay()),
        initialTasks: daysByDate[toDateString(selectedDay)]?.tasks ?? [],
    };

    const updateDayTasks = (day: number, tasks: StoredTask[]) => {
        const dateStr = toDateString(day);
        setDaysByDate(prev => ({
            ...prev,
            [dateStr]: { ...(prev[dateStr] ?? { date: dateStr }), tasks },
        }));
    };

    const showGoToToday = !isViewingToday || !isTodayInView;

    return { days, offsetDays, selectedDay, setSelectedDay, selectedDayProps, monthName, year, month, firstDayOffset, planLabels, loading, gridRef, addPlanToAllDays, editPlan, resetPlan, prevMonth, nextMonth, goToToday, showGoToToday, updateDayTasks };
};
