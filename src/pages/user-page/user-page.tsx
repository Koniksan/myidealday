import { mergeClasses, Title2 } from "@fluentui/react-components";
import React from "react";
import { PageLayout } from "../../components";
import { useUserPageStyles } from "./user-page-styles";

interface DayInfo {
    day: number;
    shortName: string;
    isToday: boolean;
    isWeekend: boolean;
}

const buildMonthDays = (): { days: DayInfo[]; monthName: string; year: number } => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const today = now.getDate();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const monthName = now.toLocaleString("default", { month: "long" });

    const days: DayInfo[] = Array.from({ length: daysInMonth }, (_, i) => {
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

export const UserPage: React.FC = () => {
    const styles = useUserPageStyles();
    const { days, monthName, year } = buildMonthDays();

    return (
        <PageLayout>
            <div className={styles.root}>
                <Title2 as="h1" className={styles.heading}>{monthName} {year}</Title2>
                <div className={styles.grid}>
                    {days.map(({ day, shortName, isToday, isWeekend }) => (
                        <div
                            key={day}
                            className={mergeClasses(
                                styles.card,
                                isToday && styles.today,
                                !isToday && isWeekend && styles.weekend,
                            )}
                        >
                            <span className={mergeClasses(styles.dayName, isToday && styles.dayNameToday)}>
                                {shortName}
                            </span>
                            <span className={mergeClasses(styles.dayNumber, isToday && styles.dayNumberToday)}>
                                {day}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </PageLayout>
    );
};
