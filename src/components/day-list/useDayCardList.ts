import { useCallback, useEffect, useRef, useState, RefObject } from "react";
import { useLocalization } from "../../infrastructure/context/locale-context";
import { usePlanVersion } from "../../infrastructure";
import { DayCardProps } from "../day";
import {
    loadPlan,
    savePlan,
    loadAllDays,
    deleteDaysFromDate,
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
    editPlan: (itemsToAdd: PlanItem[], labelsToRemove: string[], orderedLabels: string[], fieldChanges: PlanItem[]) => Promise<void>;
    resetPlan: () => Promise<void>;
    prevMonth: () => void;
    nextMonth: () => void;
    goToToday: () => void;
    showGoToToday: boolean;
    updateDayTasks: (day: number, tasks: StoredTask[]) => void;
}

export const useDayCardList = (): UseDayCardListResult => {
    const rs = useLocalization();
    const { planVersion } = usePlanVersion();
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
        const grid = gridRef.current;
        if (grid && grid.scrollWidth > grid.clientWidth) {
            const todayEl = grid.querySelector<HTMLElement>("[data-today]");
            if (todayEl) {
                const gridRect = grid.getBoundingClientRect();
                const todayRect = todayEl.getBoundingClientRect();
                const scrollTarget = grid.scrollLeft + (todayRect.left - gridRect.left) - (grid.clientWidth - todayRect.width) / 2;
                grid.scrollTo({ left: Math.max(0, scrollTarget), behavior: "smooth" });
                return;
            }
        }
        const el = [...document.querySelectorAll("[data-today]")].find(e => e.getBoundingClientRect().width > 0);
        el?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
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
    const [planItems, setPlanItems] = useState<PlanItem[]>([]);
    const [daysByDate, setDaysByDate] = useState<Record<string, StoredDay>>({});
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
        todayEls.forEach(x => observer.observe(x));
        return () => observer.disconnect();
    }, [isViewingToday, loading]);

    const firstDayOffset = (new Date(year, month, 1).getDay() + 6) % 7;
    const prevYear = month === 0 ? year - 1 : year;
    const prevMonthIndex = month === 0 ? 11 : month - 1;

    const loadData = useCallback((silent = false) => {
        if (!silent) setLoading(true);
        return Promise.all([loadPlan(), loadAllDays()])
            .then(([plan, days]) => {
                setPlanItems(plan);
                setDaysByDate(days);
            })
            .catch(console.error)
            .finally(() => { if (!silent) setLoading(false); });
    }, []);

    useEffect(() => { loadData(); }, []);
    useEffect(() => { if (planVersion > 0) loadData(true); }, [planVersion]);

    useEffect(() => {
        if (loading) return;
        if (year === todayYear && month === todayMonth) {
            requestAnimationFrame(() => scrollToToday());
        } else {
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    }, [loading]);

    const toDateString = (day: number) =>
        `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

    const toPrevDateString = (day: number) =>
        `${prevYear}-${String(prevMonthIndex + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

    // Merge the global plan with a day's snapshot: plan defines what tasks exist and their
    // metadata; the snapshot only contributes each task's checked state and custom tasks.
    const getEffectiveTasks = (dateStr: string): StoredTask[] => {
        const planTasks: StoredTask[] = planItems.map((x, i) => ({
            label: x.label,
            checked: false,
            position: i,
            is_custom: false,
            color: x.color ?? null,
            time_mode: x.time_mode ?? null,
            time_exact: x.time_exact ?? null,
            time_start: x.time_start ?? null,
            time_end: x.time_end ?? null,
        }));
        const snapshot = daysByDate[dateStr];
        if (!snapshot) return planTasks;
        const merged = planTasks.map(x => {
            const snap = snapshot.tasks.find(y => y.label === x.label && !y.is_custom);
            if (!snap) return x;
            return {
                ...x,
                checked: snap.checked,
                color: snap.color !== undefined ? snap.color : x.color,
                time_mode: snap.time_mode !== undefined ? snap.time_mode : x.time_mode,
                time_exact: snap.time_exact !== undefined ? snap.time_exact : x.time_exact,
                time_start: snap.time_start !== undefined ? snap.time_start : x.time_start,
                time_end: snap.time_end !== undefined ? snap.time_end : x.time_end,
            };
        });
        return [...merged, ...snapshot.tasks.filter(x => x.is_custom)];
    };

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
            initialTasks: getEffectiveTasks(toDateString(day)),
        };
    });

    const prevMonthLastDay = new Date(year, month, 0).getDate();

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
            initialTasks: daysByDate[toPrevDateString(day)]?.tasks ?? [],
        };
    });

    const planLabels = planItems;

    const addPlanToAllDays = async (items: PlanItem[]) => {
        const newPlan = [...planItems, ...items];
        await savePlan(newPlan);
        setPlanItems(newPlan);
    };

    const editPlan = async (itemsToAdd: PlanItem[], labelsToRemove: string[], orderedLabels: string[], fieldChanges: PlanItem[]) => {
        let newPlan = planItems
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
        setPlanItems(newPlan);
    };

    const resetPlan = async () => {
        const fromStr = toDateString(fromDay);
        await Promise.all([savePlan([]), deleteDaysFromDate(fromStr)]);
        setPlanItems([]);
        setDaysByDate(prev => {
            const updated = { ...prev };
            for (const date of Object.keys(updated)) {
                if (date >= fromStr) delete updated[date];
            }
            return updated;
        });
    };

    const selectedDayDate = new Date(year, month, selectedDay);
    const selectedDayProps: DayCardProps = {
        year,
        month,
        day: selectedDay,
        shortName: selectedDayDate.toLocaleString(rs.DateLocale, { weekday: "short" }),
        isToday: year === todayYear && month === todayMonth && selectedDay === today,
        isWeekend: [0, 6].includes(selectedDayDate.getDay()),
        initialTasks: getEffectiveTasks(toDateString(selectedDay)),
    };

    const updateDayTasks = (day: number, tasks: StoredTask[]) => {
        const dateStr = toDateString(day);
        setDaysByDate(prev => ({
            ...prev,
            [dateStr]: { date: dateStr, tasks },
        }));
    };

    const showGoToToday = !isViewingToday || !isTodayInView;

    return { days, offsetDays, selectedDay, setSelectedDay, selectedDayProps, monthName, year, month, firstDayOffset, planLabels, loading, gridRef, addPlanToAllDays, editPlan, resetPlan, prevMonth, nextMonth, goToToday, showGoToToday, updateDayTasks };
};
