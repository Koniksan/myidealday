import { DayCardProps } from "../day";

export const useDayCardList = (): { days: DayCardProps[]; monthName: string; year: number } => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const monthName = now.toLocaleString("default", { month: "long" });
    const today = now.getDate();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const days: DayCardProps[] = Array.from({ length: daysInMonth }, (_, i) => {
        const date = new Date(year, month, i + 1);
        const dow = date.getDay();
        return {
            day: i + 1,
            shortName: date.toLocaleString("default", { weekday: "short" }),
            isToday: i + 1 === today,
            isWeekend: dow === 0 || dow === 6,
        };
    });

    return { days, monthName, year };
};
